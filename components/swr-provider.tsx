'use client';

/**
 * SWR Provider Component
 * 
 * This component provides global SWR configuration to the application.
 * It wraps the application with the SWR context and handles global error states.
 */

import { ReactNode } from 'react';
import { SWRConfig } from 'swr';
import { defaultSWRConfig } from '@/lib/swr-config';
import { toast } from '@/hooks/use-toast';

interface SWRProviderProps {
  children: ReactNode;
}

/**
 * Global error handler for SWR
 * Shows a toast notification for fetch errors
 */
const onError = (error: Error) => {
  // Don't show toast for 401 errors (unauthorized) or 404 Not Found Error
  // These are handled by the auth context
  if ('status' in error && (error.status === 401 || error.status == 404)) {
    return;
  }

  toast({
    title: 'Error fetching data',
    description: error.message || 'An unknown error occurred',
    variant: 'destructive',
  });

  console.error('SWR Error:', error);
};

/**
 * SWR Provider component
 * Provides global SWR configuration to the application
 */
export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        ...defaultSWRConfig,
        onError,
      }}
    >
      {children}
    </SWRConfig>
  );
}
