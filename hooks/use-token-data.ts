/**
 * Token Data Hook
 *
 * Custom hook for fetching token analysis data using SWR
 * with standardized error handling, loading states, and caching.
 */

import { useSWRFetch } from '@/hooks/use-swr-fetch';
import { apiRequest } from '@/utils/apiRequest';

// Define the TokenData interface
export interface TokenData {
  // Basic token information
  token_name: string;          // Name of the token
  token_symbol: string;        // Symbol/ticker of the token
  token_address: string;       // Contract address of the token
  token_dex: string;           // Decentralized exchange where token is listed

  // Security assessment
  token_score: string;         // Overall security score (e.g., "3 - Likely Legit")
  reason: string;              // Explanation for the security score
  possible_scam: boolean;      // Flag indicating if token might be a scam
  reason_possible_scam: string; // Explanation for scam assessment

  // Code analysis
  could_legitimately_justify_suspicious_code: boolean; // Whether suspicious code has legitimate purpose
  reason_could_or_couldnt_justify_suspicious_code: string; // Explanation for code assessment

  // Token metrics
  top_holder_percentage_tokens_held: number;      // Percentage held by largest holder
  percentage_of_tokens_locked_or_burned: number;  // Percentage of supply locked/burned
  percentage_liquidity_locked_or_burned: number;  // Percentage of liquidity locked/burned
  liquidity_in_usd: number;    // Token liquidity in USD

  // Contract verification
  is_contract_verified: boolean; // Whether the contract is verified on blockchain explorer

  // Trading status
  is_token_sellable: boolean;  // Whether the token can be sold/traded

  // Additional checks
  has_website: boolean;        // Whether the token has a website
  has_twitter_or_discord: boolean; // Whether the token has social media presence
}

/**
 * Fetches token data from the API
 *
 * @param tokenAddress - The address of the token to analyze
 * @returns Promise resolving to token data
 */
async function fetchTokenData(tokenAddress: string): Promise<TokenData> {
  return apiRequest<TokenData>(`/token/${tokenAddress}`, 'GET');
}

/**
 * Hook for fetching and managing token data
 *
 * @param tokenAddress - The address of the token to analyze
 * @returns Object containing token data state and loading/error states
 */
export function useTokenData(tokenAddress: string | null) {
  // Generate cache key based on token address
  const cacheKey = tokenAddress ? `token-data-${tokenAddress}` : null;

  // Fetch token data using SWR
  const {
    data,
    error,
    isLoading,
    isError,
    mutate
  } = useSWRFetch<TokenData>(
    cacheKey,
    () => fetchTokenData(tokenAddress as string),
    {
      // Don't fetch if no token address is provided
      shouldRetryOnError: !!tokenAddress
    }
  );

  // Return all the state needed by components
  return {
    tokenData: data,        // Token analysis data
    error,                  // Error from SWR if data fetching failed
    isLoading,              // Loading state from SWR
    isError,                // Error state from SWR
    refresh: mutate         // Function to manually refresh the data
  };
}

// For development/testing - mock token data
export const mockTokenData: TokenData = {
  token_score: "3 - Likely Legit",
  reason: "This token demonstrates several positive indicators including locked liquidity, reasonable token distribution, and verifiable social presence. The contract code shows standard ERC20 implementation with some anti-bot measures that are within acceptable bounds. While there are some concentration risks in token holdings, the overall profile suggests legitimate intentions and proper security measures.",
  token_name: "Example Token",
  token_address: "0x1234567890abcdef1234567890abcdef12345678",
  token_symbol: "EX",
  token_dex: "Uniswap V2",
  possible_scam: false,
  reason_possible_scam: "No significant scam indicators detected. The token contract follows standard practices and does not contain malicious code patterns. The liquidity is adequate and locked, reducing rug pull risk.",
  could_legitimately_justify_suspicious_code: true,
  reason_could_or_couldnt_justify_suspicious_code: "The contract includes anti-bot measures that, while potentially restrictive, are commonly used in legitimate projects to prevent manipulation during launch. These mechanisms are temporary and controlled by a time-lock contract.",
  top_holder_percentage_tokens_held: 15.5,
  percentage_of_tokens_locked_or_burned: 60.0,
  percentage_liquidity_locked_or_burned: 95.0,
  liquidity_in_usd: 250000,
  is_contract_verified: true,
  is_token_sellable: true,
  has_website: true,
  has_twitter_or_discord: true
};
