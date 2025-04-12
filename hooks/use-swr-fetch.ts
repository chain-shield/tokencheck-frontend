/**
 * SWR Fetch Hook
 *
 * A collection of custom hooks for data fetching using SWR with standardized
 * error handling, loading states, and type safety.
 */

import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import { defaultSWRConfig, realtimeSWRConfig, staticSWRConfig } from '@/lib/swr-config';

/**
 * Extended SWR response with additional helper properties
 */
export interface ExtendedSWRResponse<Data = any, Error = any> extends SWRResponse<Data, Error> {
  isLoading: boolean;
  isError: boolean;
}

/**
 * Base hook for data fetching with SWR
 *
 * @param key - The unique key for the request (used for caching/deduplication)
 * @param fetcher - The function to fetch data
 * @param config - SWR configuration options
 * @returns Extended SWR response with additional helper properties
 */
export function useSWRFetch<Data = any, Error = any>(
  key: string | null,
  fetcher: (key: string) => Promise<Data>,
  config?: SWRConfiguration
): ExtendedSWRResponse<Data, Error> {
  const swr = useSWR<Data, Error>(key, fetcher, {
    ...defaultSWRConfig,
    ...config,
  });

  return {
    ...swr,
    isLoading: key !== null && !swr.error && !swr.data,
    isError: !!swr.error,
  };
}

/**
 * Hook for fetching data that updates frequently
 * Uses a shorter polling interval (10 seconds)
 */
export function useRealtimeSWRFetch<Data = any, Error = any>(
  key: string | null,
  fetcher: (key: string) => Promise<Data>,
  config?: SWRConfiguration
): ExtendedSWRResponse<Data, Error> {
  return useSWRFetch<Data, Error>(key, fetcher, {
    ...realtimeSWRConfig,
    ...config,
  });
}

/**
 * Hook for fetching static data that rarely changes
 * Disables automatic polling
 */
export function useStaticSWRFetch<Data = any, Error = any>(
  key: string | null,
  fetcher: (key: string) => Promise<Data>,
  config?: SWRConfiguration
): ExtendedSWRResponse<Data, Error> {
  return useSWRFetch<Data, Error>(key, fetcher, {
    ...staticSWRConfig,
    ...config,
  });
}
