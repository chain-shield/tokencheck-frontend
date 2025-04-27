/**
 * Payment History Hook
 *
 * Custom hook for fetching and managing payment history using SWR for data fetching
 * with standardized error handling, loading states, and caching.
 */

import { PaymentInfoResponse } from '@/lib/models/models';
import { getPaymentHistory } from '@/utils/subscriptionService';
import { useStaticSWRFetch } from '@/hooks/use-swr-fetch';
import { toast } from '@/hooks/use-toast';

// Cache key for payment history
const PAYMENT_HISTORY_CACHE_KEY = 'payment-history';

/**
 * Hook for fetching and managing payment history
 *
 * @param filters - Optional filters for payment history (e.g., date range, status)
 * @returns Object containing payment history data and loading/error states
 */
export function usePaymentHistory(filters?: Record<string, any>) {
  // Create a unique cache key if filters are provided
  const cacheKey = filters
    ? `${PAYMENT_HISTORY_CACHE_KEY}-${JSON.stringify(filters)}`
    : PAYMENT_HISTORY_CACHE_KEY;

  // Fetch payment history using SWR
  // Note: getPaymentHistory is a POST request, so we need to pass the filters
  const {
    data,
    error,
    isLoading,
    isError,
    mutate
  } = useStaticSWRFetch<PaymentInfoResponse>(
    cacheKey,
    // Pass the filters to getPaymentHistory (which will be sent in the POST request)
    // The actual implementation of getPaymentHistory handles the POST request
    () => getPaymentHistory(filters)
  );

  /**
   * Refreshes the payment history data
   * Useful after new payments or subscription changes
   *
   * @param newFilters - Optional new filters to apply when refreshing
   */
  const refreshPaymentHistory = async (newFilters?: Record<string, any>) => {
    try {
      // If new filters are provided, use them for the refresh
      // This allows changing filters when refreshing
      if (newFilters) {
        // Mutate the data with the new filters
        await mutate(getPaymentHistory(newFilters), {
          revalidate: true,
          populateCache: true,
        });
      } else {
        // Otherwise, just refresh with the current filters
        await mutate();
      }
    } catch (error) {
      toast({
        title: "Failed to refresh payment history",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Return all the state needed by components
  return {
    paymentHistory: data?.intents || [],  // Payment history data (empty array if undefined)
    error,                               // Error from SWR if data fetching failed
    isLoading,                           // Loading state from SWR
    isError,                             // Error state from SWR
    refreshPaymentHistory                // Function to manually refresh the payment history
  };
}
