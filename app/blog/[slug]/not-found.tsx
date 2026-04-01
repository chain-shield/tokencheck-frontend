import Link from 'next/link';

import { MarketingPageShell } from '@/components/marketing/page-shell';

export default function BlogPostNotFound() {
  return (
    <MarketingPageShell
      eyebrow="Article unavailable"
      title={<>Post not found</>}
      description="This research note doesn’t exist yet, or it hasn’t been published publicly."
    >
      <div className="max-w-2xl rounded-[1.5rem] bg-[#131313] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
        <Link href="/blog" className="inline-flex rounded-full border border-white/10 bg-[#20201f] px-4 py-2 text-sm font-medium text-[#8bbbff] transition-colors hover:bg-[#262626]">
          ← Back to Blog
        </Link>
      </div>
    </MarketingPageShell>
  );
}
