import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import type { AnchorHTMLAttributes, HTMLAttributes } from 'react';

import {
  getAllBlogSlugs,
  getBlogPostBySlug,
  type BlogPostFrontmatter,
} from '@/lib/blog';

export const dynamic = 'force-static';
export const dynamicParams = false;

type PageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params;

  try {
    const post = await getBlogPostBySlug(slug);
    return {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      alternates: { canonical: `/blog/${slug}` },
      openGraph: {
        title: post.frontmatter.title,
        description: post.frontmatter.description,
        type: 'article',
      },
    };
  } catch {
    return { title: 'Blog' };
  }
}

function mdxComponents() {
  return {
    a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => {
      const href = props.href ?? '';
      const isInternal = href.startsWith('/');

      if (isInternal) {
        return (
          <Link href={href} className="underline underline-offset-4">
            {props.children}
          </Link>
        );
      }

      return (
        <a
          {...props}
          className="underline underline-offset-4"
          target={props.target ?? '_blank'}
          rel={props.rel ?? 'noopener noreferrer'}
        />
      );
    },
    h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h1
        {...props}
        className="scroll-mt-24 text-3xl font-semibold tracking-tight"
      />
    ),
    h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h2
        {...props}
        className="scroll-mt-24 text-2xl font-semibold tracking-tight mt-8"
      />
    ),
    h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h3
        {...props}
        className="scroll-mt-24 text-xl font-semibold tracking-tight mt-6"
      />
    ),
    p: (props: HTMLAttributes<HTMLParagraphElement>) => (
      <p {...props} className="leading-7 mt-4 text-foreground/90" />
    ),
    ul: (props: HTMLAttributes<HTMLUListElement>) => (
      <ul {...props} className="list-disc pl-6 mt-4 space-y-2" />
    ),
    ol: (props: HTMLAttributes<HTMLOListElement>) => (
      <ol {...props} className="list-decimal pl-6 mt-4 space-y-2" />
    ),
    li: (props: HTMLAttributes<HTMLLIElement>) => (
      <li {...props} className="leading-7" />
    ),
    blockquote: (props: HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote
        {...props}
        className="border-l-2 pl-4 italic text-muted-foreground mt-4"
      />
    ),
    code: (props: HTMLAttributes<HTMLElement>) => (
      <code
        {...props}
        className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm"
      />
    ),
    pre: (props: HTMLAttributes<HTMLPreElement>) => (
      <pre
        {...props}
        className="mt-4 overflow-x-auto rounded-lg border bg-muted p-4 text-sm"
      />
    ),
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = params;

  let post: { frontmatter: BlogPostFrontmatter; content: string };
  try {
    post = await getBlogPostBySlug(slug);
  } catch {
    notFound();
  }

  // `remark-gfm` is ESM-only; dynamic import avoids any CJS interop edge cases.
  const { default: remarkGfm } = await import('remark-gfm');

  const compiled = await compileMDX<{ frontmatter: BlogPostFrontmatter }>({
    source: post.content,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
    components: mdxComponents(),
  });

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="max-w-3xl">
        <Link href="/blog" className="text-sm text-muted-foreground hover:underline">
          ← Back to Blog
        </Link>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          {post.frontmatter.title}
        </h1>
        {post.frontmatter.description ? (
          <p className="mt-3 text-muted-foreground">
            {post.frontmatter.description}
          </p>
        ) : null}

        <article className="mt-8">{compiled.content}</article>
      </div>
    </main>
  );
}
