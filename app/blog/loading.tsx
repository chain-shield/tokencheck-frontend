'use client';

import { Spinner } from '@/components/ui/spinner';

/**
 * Loading component for the blog index route.
 */
export default function BlogLoading() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto" />
        <p className="mt-4 text-muted-foreground">Loading blog...</p>
      </div>
    </div>
  );
}

