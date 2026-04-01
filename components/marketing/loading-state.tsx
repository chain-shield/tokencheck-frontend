'use client';

import { Spinner } from '@/components/ui/spinner';

type MarketingLoadingStateProps = {
  label: string;
};

export function MarketingLoadingState({ label }: MarketingLoadingStateProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#0e0e0e] px-6 text-white md:min-h-[calc(100vh-5rem)]">
      <div className="rounded-[1.5rem] bg-[#131313] px-10 py-9 text-center shadow-[0_20px_50px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
        <Spinner size="lg" className="mx-auto border-[#8bbbff] border-t-transparent" />
        <p className="mt-4 text-sm font-medium uppercase tracking-[0.18em] text-[#adaaaa]">{label}</p>
      </div>
    </div>
  );
}
