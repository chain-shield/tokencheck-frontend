'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEffect } from 'react';

export default function RegisterError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('Register error:', error.message || 'Unknown error');
    }
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-background to-secondary">
      <Card className="w-full max-w-md p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Login Error</h2>
        <p className="mb-6 text-muted-foreground">{error.message || 'Failed to login'}</p>
        <Button onClick={reset} variant="default">
          Try Again
        </Button>
      </Card>
    </div>
  );
} 