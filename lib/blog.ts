import 'server-only';

import fs from 'node:fs/promises';
import path from 'node:path';

import matter from 'gray-matter';
import { z } from 'zod';

/**
 * Blog posts live in git at `content/blog/<slug>.mdx`.
 *
 * Important: this module uses the filesystem, so it must only be imported from
 * server components / server-only code (enforced via `server-only`).
 */

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

const slugSchema = z
  .string()
  .min(1)
  // keep it aligned with the spec in BLOG.md
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.string().min(1),
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
  // Either field works; `published` takes precedence if both are present.
  published: z.boolean().optional(),
  draft: z.boolean().optional(),
});

type RawFrontmatter = z.infer<typeof frontmatterSchema>;

export type BlogPostFrontmatter = Omit<RawFrontmatter, 'draft'> & {
  published: boolean;
  draft?: boolean;
  /** Parsed JS date for sorting/formatting (derived from `date`) */
  dateObj: Date;
};

export type BlogPostSummary = {
  slug: string;
  title: string;
  description?: string;
  author?: string;
  tags?: string[];
  date: Date;
};

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseBlogDateOrThrow(dateStr: string): Date {
  const dateOnlyMatch = DATE_ONLY_PATTERN.exec(dateStr);

  if (dateOnlyMatch) {
    const year = Number(dateOnlyMatch[1]);
    const monthIndex = Number(dateOnlyMatch[2]) - 1;
    const day = Number(dateOnlyMatch[3]);
    // Normalize date-only frontmatter to local noon so it remains stable when
    // rendered in different timezones and never drifts to the previous day.
    const d = new Date(year, monthIndex, day, 12);

    if (
      d.getFullYear() !== year
      || d.getMonth() !== monthIndex
      || d.getDate() !== day
    ) {
      throw new Error(`Invalid blog post date: ${dateStr}`);
    }

    return d;
  }

  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Invalid blog post date: ${dateStr}`);
  }
  return d;
}

async function listBlogFilenames(): Promise<string[]> {
  try {
    const entries = await fs.readdir(BLOG_DIR, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .filter((name) => name.endsWith('.mdx') || name.endsWith('.md'));
  } catch {
    // Directory may not exist in early dev setups; treat as empty.
    return [];
  }
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const filenames = await listBlogFilenames();
  return filenames
    .map((f) => f.replace(/\.(mdx|md)$/i, ''))
    .filter((slug) => slugSchema.safeParse(slug).success)
    .sort();
}

export async function getBlogPostBySlug(slug: string): Promise<{
  frontmatter: BlogPostFrontmatter;
  content: string;
}> {
  const parsedSlug = slugSchema.parse(slug);

  const mdxPath = path.join(BLOG_DIR, `${parsedSlug}.mdx`);
  const mdPath = path.join(BLOG_DIR, `${parsedSlug}.md`);

  let raw: string | null = null;
  try {
    raw = await fs.readFile(mdxPath, 'utf8');
  } catch {
    // fall through
  }
  if (raw === null) {
    raw = await fs.readFile(mdPath, 'utf8');
  }

  const parsed = matter(raw);
  const fm = frontmatterSchema.parse(parsed.data);
  const dateObj = parseBlogDateOrThrow(fm.date);

  const published = fm.published ?? (fm.draft !== undefined ? !fm.draft : true);

  return {
    frontmatter: {
      ...fm,
      published,
      dateObj,
    },
    content: parsed.content,
  };
}

export async function getAllPublishedBlogPosts(): Promise<BlogPostSummary[]> {
  const slugs = await getAllBlogSlugs();

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const post = await getBlogPostBySlug(slug);
      return { slug, ...post };
    }),
  );

  return posts
    .filter((p) => p.frontmatter.published !== false)
    .map((p) => ({
      slug: p.slug,
      title: p.frontmatter.title,
      description: p.frontmatter.description,
      author: p.frontmatter.author,
      tags: p.frontmatter.tags,
      date: p.frontmatter.dateObj,
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}
