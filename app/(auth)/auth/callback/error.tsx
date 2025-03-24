'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('OAuth callback error:', error);

    // Redirect to login page after a short delay
    const timeout = setTimeout(() => {
      router.push('/login');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [error, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">Authentication Error</h2>
      <p className="mb-4">Sorry, there was a problem authenticating your account.</p>
      <div className="flex gap-4">
        <button
          onClick={() => router.push('/login')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Return to Login
        </button>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );
} 