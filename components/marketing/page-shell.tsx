import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type MarketingPageShellProps = {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
  headerAside?: ReactNode;
  contentClassName?: string;
};

export function MarketingPageShell({
  eyebrow,
  title,
  description,
  children,
  headerAside,
  contentClassName,
}: MarketingPageShellProps) {
  return (
    <main className="min-h-screen bg-[#0e0e0e] text-white">
      <section className="relative overflow-hidden px-6 pb-24 pt-10 md:pb-32 md:pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,187,255,0.14),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(145,247,142,0.08),transparent_28%)]" />
        <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:72px_72px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end lg:gap-14">
            <div className="max-w-4xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#262626]/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[#8bbbff] backdrop-blur-xl">
                <span className="h-2 w-2 rounded-full bg-[#91f78e] shadow-[0_0_16px_rgba(145,247,142,0.6)]" />
                {eyebrow}
              </div>
              <h1 className="text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] text-white md:text-6xl">
                {title}
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-[#adaaaa] md:text-xl">{description}</p>
            </div>

            {headerAside ? (
              <div className="rounded-[1.5rem] bg-[#131313]/90 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur-xl">
                {headerAside}
              </div>
            ) : null}
          </div>

          <div className={cn('relative mt-14', contentClassName)}>{children}</div>
        </div>
      </section>
    </main>
  );
}
