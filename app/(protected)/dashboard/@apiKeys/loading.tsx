'use client';

import { Spinner } from '@/components/ui/spinner';

/**
 * Loading component for the API Keys section in the dashboard
 * 
 * Displays a centered spinner when the API Keys section is loading
 */
export default function ApiKeysLoading() {
  return (
    <div className="flex items-center justify-center h-full min-h-[300px]">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto" />
        <p className="mt-4 text-muted-foreground">Loading API keys...</p>
      </div>
    </div>
  );
}
