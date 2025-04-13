/**
 * SWR Configuration
 *
 * This file contains the global SWR configuration for the application.
 * It provides consistent settings for caching, revalidation, error handling, and more.
 */

import { SWRConfiguration } from 'swr';

// Check if we're in a test environment
const isTest = process.env.NODE_ENV === 'test';

/**
 * Default SWR configuration
 *
 * - revalidateOnFocus: true to refresh data when the window regains focus
 * - revalidateOnReconnect: true to refresh data when the network reconnects
 * - shouldRetryOnError: true to retry failed requests
 * - errorRetryCount: 3 maximum retry attempts
 * - dedupingInterval: 2 seconds to deduplicate requests
 * - staleTime: 15 minutes (900000ms) for cache invalidation
 */
export const defaultSWRConfig: SWRConfiguration = {
  // No active polling
  refreshInterval: 0,

  // Cache invalidation after 15 minutes
  dedupingInterval: 15 * 60 * 1000,

  // Revalidate stale data
  revalidateIfStale: true,

  // Revalidate when window gets focus (disable in tests)
  revalidateOnFocus: !isTest,

  // Revalidate when network reconnects (disable in tests)
  revalidateOnReconnect: !isTest,

  // Retry on error
  shouldRetryOnError: true,
  errorRetryCount: 3,

  // Disable features that depend on browser APIs in test environment
  ...(isTest && {
    provider: () => new Map(),
    isVisible: () => true,
    isOnline: () => true,
  }),
};

/**
 * SWR configuration for real-time data
 *
 * Similar to default config but with shorter cache invalidation time (1 minute)
 * for data that needs to be more frequently updated
 */
export const realtimeSWRConfig: SWRConfiguration = {
  ...defaultSWRConfig,
  dedupingInterval: 60 * 1000, // 1 minute
  // Enable active polling for truly real-time data
  refreshInterval: 30 * 1000, // 30 seconds
};

/**
 * SWR configuration for static data
 *
 * For data that rarely changes, with much longer cache time (1 day)
 * and no automatic revalidation
 */
export const staticSWRConfig: SWRConfiguration = {
  ...defaultSWRConfig,
  refreshInterval: 0, // No polling
  dedupingInterval: 24 * 60 * 60 * 1000, // 1 day
  revalidateIfStale: false, // Don't revalidate stale data automatically
  revalidateOnFocus: false, // Don't revalidate on focus
  revalidateOnReconnect: false, // Don't revalidate on reconnect
};
