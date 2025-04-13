'use client';

/**
 * Token Analysis Client Component
 *
 * This client component handles fetching token data and displaying the analysis.
 * It uses the useTokenData hook with SWR for caching and automatic revalidation.
 */

import { useTokenData, mockTokenData } from '@/hooks/use-token-data';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import TokenAnalysis from './token-analysis';

interface TokenAnalysisClientProps {
  tokenAddress: string;
}

/**
 * Client component for token analysis that handles data fetching
 *
 * @param tokenAddress - The address of the token to analyze
 * @returns TokenAnalysis component with the token data
 */
export default function TokenAnalysisClient({ tokenAddress }: TokenAnalysisClientProps) {
  // Use the custom hook to fetch token data with SWR
  const { tokenData, error, isLoading } = useTokenData(tokenAddress);

  // Show loading state while fetching token data
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-96" />
          </div>
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-64 w-full mb-4" />
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  // Show error message if token data fetching failed
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load token data: {error.message || 'An unknown error occurred'}
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <p>Token Address: {tokenAddress}</p>
          </div>
        </div>
      </div>
    );
  }

  // Use mock data for development if no data is returned from the API
  // In production, this would be removed and we'd rely solely on the API
  const data = tokenData || { ...mockTokenData, token_address: tokenAddress };

  return <TokenAnalysis tokenAddress={tokenAddress} tokenData={data} />;
}
