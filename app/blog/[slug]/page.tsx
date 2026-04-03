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
import { PageViewTracker } from '@/components/analytics/page-view-tracker';
import { MarketingPageShell } from '@/components/marketing/page-shell';

export const dynamic = 'force-static';
export const dynamicParams = false;

type PageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();

  // Filter out any posts whose MDX cannot be compiled so a single bad file
  // never breaks the entire production build.
  const { default: remarkGfm } = await import('remark-gfm');
  const valid: string[] = [];

  await Promise.all(
    slugs.map(async (slug) => {
      try {
        const post = await getBlogPostBySlug(slug);
        await compileMDX({
          source: post.content,
          options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
        });
        valid.push(slug);
      } catch (err) {
        console.warn(`[blog] Skipping slug "${slug}" — MDX compilation failed:`, err);
      }
    }),
  );

  return valid.map((slug) => ({ slug }));
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
          <Link href={href} className="font-medium text-[#8bbbff] underline underline-offset-4 transition-colors hover:text-white">
            {props.children}
          </Link>
        );
      }

      return (
        <a
          {...props}
          className="font-medium text-[#8bbbff] underline underline-offset-4 transition-colors hover:text-white"
          target={props.target ?? '_blank'}
          rel={props.rel ?? 'noopener noreferrer'}
        />
      );
    },
    h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h1
        {...props}
        className="scroll-mt-24 text-3xl font-bold tracking-[-0.03em] text-white"
      />
    ),
    h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h2
        {...props}
        className="mt-10 scroll-mt-24 text-2xl font-bold tracking-[-0.03em] text-white"
      />
    ),
    h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h3
        {...props}
        className="mt-8 scroll-mt-24 text-xl font-bold tracking-[-0.02em] text-white"
      />
    ),
    p: (props: HTMLAttributes<HTMLParagraphElement>) => (
      <p {...props} className="mt-4 leading-8 text-[#cfcfcf]" />
    ),
    ul: (props: HTMLAttributes<HTMLUListElement>) => (
      <ul {...props} className="mt-4 list-disc space-y-2 pl-6 text-[#cfcfcf]" />
    ),
    ol: (props: HTMLAttributes<HTMLOListElement>) => (
      <ol {...props} className="mt-4 list-decimal space-y-2 pl-6 text-[#cfcfcf]" />
    ),
    li: (props: HTMLAttributes<HTMLLIElement>) => (
      <li {...props} className="leading-7" />
    ),
    blockquote: (props: HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote
        {...props}
        className="mt-6 rounded-r-2xl border-l-2 border-[#8bbbff] bg-[#20201f] px-5 py-4 italic text-[#adaaaa]"
      />
    ),
    code: (props: HTMLAttributes<HTMLElement>) => (
      <code
        {...props}
        className="rounded bg-[#20201f] px-1.5 py-0.5 font-mono text-sm text-[#e6edf7]"
      />
    ),
    pre: (props: HTMLAttributes<HTMLPreElement>) => (
      <pre
        {...props}
        className="mt-6 overflow-x-auto rounded-[1.25rem] border border-white/10 bg-[#0a0a0a] p-5 text-sm text-[#e6edf7]"
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

  let compiled: Awaited<ReturnType<typeof compileMDX>>;
  try {
    compiled = await compileMDX<{ frontmatter: BlogPostFrontmatter }>({
      source: post.content,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      },
      components: mdxComponents(),
    });
  } catch (err) {
    console.error(`[blog] MDX compilation error for slug "${slug}":`, err);
    notFound();
  }

  return (
    <MarketingPageShell
      eyebrow="Research note"
      title={<>{post.frontmatter.title}</>}
      description={post.frontmatter.description ?? 'Security intelligence from the ChainShield team.'}
      headerAside={
        <div className="space-y-4 text-sm text-[#cfcfcf]">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#91f78e]">Published</div>
            <div className="mt-2 text-base font-semibold text-white">{post.frontmatter.date}</div>
          </div>
          {post.frontmatter.author ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8bbbff]">Author</div>
              <div className="mt-2 text-base font-semibold text-white">{post.frontmatter.author}</div>
            </div>
          ) : null}
        </div>
      }
      contentClassName="max-w-4xl"
    >
      <PageViewTracker pageTitle={post.frontmatter.title} pagePath={`/blog/${slug}`} contentCategory="blog" />
      <Link href="/blog" className="inline-flex rounded-full border border-white/10 bg-[#20201f] px-4 py-2 text-sm font-medium text-[#8bbbff] transition-colors hover:bg-[#262626] hover:text-white">
        ← Back to Blog
      </Link>

      <article className="mt-6 rounded-[1.75rem] bg-[#131313] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/10 md:p-10">
        {(post.frontmatter.tags ?? []).length ? (
          <div className="mb-6 flex flex-wrap gap-3">
            {(post.frontmatter.tags ?? []).map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 bg-[#20201f] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#cfcfcf]">{tag}</span>
            ))}
          </div>
        ) : null}

        <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-[#cfcfcf] prose-li:text-[#cfcfcf] prose-strong:text-white prose-code:text-[#e6edf7]">
          {compiled.content}
        </div>

        <div className="mt-10 rounded-[1.5rem] bg-[#20201f] p-6 ring-1 ring-white/10">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#91f78e]">Need this level of scrutiny on your protocol?</div>
          <p className="mt-3 text-base leading-7 text-[#cfcfcf]">ChainShield Discovery Runs are designed to identify high-risk issues quickly, validate what matters, and give engineering teams a faster path to remediation.</p>
          <Link href="/audit-request" className="mt-5 inline-flex rounded-full bg-[linear-gradient(135deg,#8bbbff_0%,#72a3e5_100%)] px-5 py-3 text-sm font-bold text-[#003768] transition-opacity hover:opacity-95">Request Security Quote</Link>
        </div>
      </article>
    </MarketingPageShell>
  );
}
