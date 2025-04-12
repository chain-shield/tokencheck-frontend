/**
 * SWR Configuration
 * 
 * This file contains the global SWR configuration for the application.
 * It provides consistent settings for caching, revalidation, error handling, and more.
 */

import { SWRConfiguration } from 'swr';

/**
 * Default SWR configuration
 * 
 * - refreshInterval: 15 minutes (900000ms) for automatic polling
 * - revalidateOnFocus: true to refresh data when the window regains focus
 * - revalidateOnReconnect: true to refresh data when the network reconnects
 * - shouldRetryOnError: true to retry failed requests
 * - errorRetryCount: 3 maximum retry attempts
 * - dedupingInterval: 2 seconds to deduplicate requests
 */
export const defaultSWRConfig: SWRConfiguration = {
  // Polling every 15 minutes
  refreshInterval: 15 * 60 * 1000,
  
  // Revalidate when window gets focus
  revalidateOnFocus: true,
  
  // Revalidate when network reconnects
  revalidateOnReconnect: true,
  
  // Retry on error
  shouldRetryOnError: true,
  errorRetryCount: 3,
  
  // Deduplicate requests within 2 seconds
  dedupingInterval: 2000,
};

/**
 * SWR configuration for real-time data
 * 
 * Similar to default config but with shorter polling interval (10 seconds)
 * for data that needs to be more frequently updated
 */
export const realtimeSWRConfig: SWRConfiguration = {
  ...defaultSWRConfig,
  refreshInterval: 10 * 1000, // 10 seconds
};

/**
 * SWR configuration for static data
 * 
 * For data that rarely changes, with longer cache time
 * and no automatic polling
 */
export const staticSWRConfig: SWRConfiguration = {
  ...defaultSWRConfig,
  refreshInterval: 0, // No polling
  revalidateIfStale: false,
};
