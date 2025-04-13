'use client';

import { Spinner } from '@/components/ui/spinner';

/**
 * Loading component for the login page
 * 
 * Displays a centered spinner when the login page is loading
 */
export default function LoginLoading() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto" />
        <p className="mt-4 text-muted-foreground">Loading login page...</p>
      </div>
    </div>
  );
}
