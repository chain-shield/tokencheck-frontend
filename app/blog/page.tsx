import Link from 'next/link';
import { format } from 'date-fns';

import { PageViewTracker } from '@/components/analytics/page-view-tracker';
import { MarketingPageShell } from '@/components/marketing/page-shell';
import { getAllPublishedBlogPosts } from '@/lib/blog';

export const dynamic = 'force-static';

export default async function BlogIndexPage() {
  const posts = await getAllPublishedBlogPosts();
  const [featuredPost, ...remainingPosts] = posts;

  return (
    <MarketingPageShell
      eyebrow="Research & Intelligence"
      title={<>ChainShield Journal</>}
      description="Technical notes, audit intelligence, and practical security guidance for teams building under pressure."
      headerAside={
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#91f78e]">Inside the journal</div>
          <p className="text-sm leading-7 text-[#cfcfcf]">Audit methodology, protocol risk patterns, postmortems, and launch-readiness insights from the ChainShield team.</p>
        </div>
      }
      contentClassName="space-y-6"
    >
      <PageViewTracker pageTitle="Blog" pagePath="/blog" />

      {posts.length === 0 ? (
        <div className="rounded-[1.5rem] bg-[#131313] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
          <h2 className="text-2xl font-bold tracking-[-0.03em] text-white">No posts yet</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#adaaaa]">
            New research notes and protocol insights will appear here as soon as they are published.
          </p>
        </div>
      ) : (
        <>
          {featuredPost ? (
            <Link href={`/blog/${featuredPost.slug}`} className="block overflow-hidden rounded-[1.75rem] bg-[#131313] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/10 transition-colors hover:bg-[#1a1a1a] md:p-10">
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#8bbbff]">
                <span>Featured article</span>
                <span className="text-[#767575]">•</span>
                <span>{format(featuredPost.date, 'MMM d, yyyy')}</span>
                {featuredPost.author ? <span className="text-[#adaaaa]">By {featuredPost.author}</span> : null}
              </div>
              <h2 className="mt-5 max-w-3xl text-3xl font-extrabold tracking-[-0.04em] text-white md:text-4xl">{featuredPost.title}</h2>
              {featuredPost.description ? <p className="mt-4 max-w-3xl text-lg leading-8 text-[#adaaaa]">{featuredPost.description}</p> : null}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {(featuredPost.tags ?? []).slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 bg-[#20201f] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-[#cfcfcf]">{tag}</span>
                ))}
              </div>
            </Link>
          ) : null}

          {remainingPosts.length ? (
            <div className="grid gap-6 md:grid-cols-2">
              {remainingPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-[1.5rem] bg-[#131313] p-7 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-white/10 transition-colors hover:bg-[#1a1a1a]">
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#91f78e]">{format(post.date, 'MMM d, yyyy')}</div>
                  <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-white">{post.title}</h3>
                  {post.description ? <p className="mt-3 text-base leading-7 text-[#adaaaa]">{post.description}</p> : null}
                  <div className="mt-5 flex flex-wrap gap-3">
                    {(post.tags ?? []).slice(0, 2).map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 bg-[#20201f] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#cfcfcf]">{tag}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </>
      )}
    </MarketingPageShell>
  );
}

