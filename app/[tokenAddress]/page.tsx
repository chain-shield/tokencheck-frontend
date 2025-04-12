'use client';

/**
 * Token Analysis Page
 *
 * This page displays detailed security analysis for a specific token address.
 * It uses dynamic routing to capture the token address from the URL.
 *
 * It uses the useTokenData hook to fetch token data with SWR for caching,
 * automatic revalidation, and better error handling.
 */

import TokenAnalysis from './token-analysis';
import { useTokenData, mockTokenData } from '@/hooks/use-token-data';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

/**
 * Generate static parameters for common token addresses
 * This improves performance by pre-rendering pages for popular tokens
 *
 * @returns Array of token address parameters for static generation
 */
export function generateStaticParams() {
  return [
    { tokenAddress: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' }, // WBTC
    { tokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }, // WETH
    { tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' }, // USDC
    { tokenAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }, // DAI
    { tokenAddress: '0x1234567890abcdef1234567890abcdef12345678' }, // Example token
  ];
}

/**
 * Token page component that displays analysis for a specific token
 *
 * @param params - Object containing the tokenAddress from the URL
 * @returns TokenAnalysis component with the token data
 */
export default function TokenPage({ params }: { params: { tokenAddress: string } }) {
  // Use the custom hook to fetch token data with SWR
  const { tokenData, error, isLoading } = useTokenData(params.tokenAddress);

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
            <p>Token Address: {params.tokenAddress}</p>
          </div>
        </div>
      </div>
    );
  }

  // Use mock data for development if no data is returned from the API
  // In production, this would be removed and we'd rely solely on the API
  const data = tokenData || { ...mockTokenData, token_address: params.tokenAddress };

  return <TokenAnalysis tokenAddress={params.tokenAddress} tokenData={data} />;
}