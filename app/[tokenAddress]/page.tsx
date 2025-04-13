/**
 * Token Analysis Page
 *
 * This page displays detailed security analysis for a specific token address.
 * It uses dynamic routing to capture the token address from the URL.
 *
 * It uses the TokenAnalysisClient component which handles data fetching with SWR
 * for caching, automatic revalidation, and better error handling.
 */

import TokenAnalysisClient from './token-analysis-client';

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
 * @returns TokenAnalysisClient component with the token address
 */
export default function TokenPage({ params }: { params: { tokenAddress: string } }) {
  return <TokenAnalysisClient tokenAddress={params.tokenAddress} />;
}