'use client';

import { Spinner } from '@/components/ui/spinner';

export default function BlogPostLoading() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto" />
        <p className="mt-4 text-muted-foreground">Loading post...</p>
      </div>
    </div>
  );
}
