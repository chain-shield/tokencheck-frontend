/**
 * Subscription Plans Hook
 *
 * Custom hook for managing subscription plans using SWR for data fetching
 * with standardized error handling, loading states, and caching.
 */

import { useState } from 'react';
import { UserSubscription, SubscribeToTierResponse } from '@/lib/models/models';
import { getSubscriptionPlans, GetSubscriptionPlansResponse, subscribeToTier } from '@/utils/subscriptionService';
import { useStaticSWRFetch } from '@/hooks/use-swr-fetch';
import { toast } from '@/hooks/use-toast';

// Cache key for subscription plans
const SUBSCRIPTION_PLANS_CACHE_KEY = 'subscription-plans';

/**
 * Hook for managing subscription plans
 *
 * @returns Object containing subscription plans state and functions to manage them
 */
export function useSubscriptionPlans() {
  // Fetch subscription plans using SWR
  // Using static config since plans don't change frequently
  const {
    data,
    error,
    isLoading,
    mutate
  } = useStaticSWRFetch<GetSubscriptionPlansResponse>(
    SUBSCRIPTION_PLANS_CACHE_KEY,
    () => getSubscriptionPlans()
  );

  // Local state for tracking subscription actions
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  /**
   * Subscribes to a specific tier
   *
   * @param planId - ID of the subscription plan
   * @returns Promise resolving to the subscription response
   */
  const subscribe = async (planId: string): Promise<SubscribeToTierResponse> => {
    setIsSubscribing(true);
    setSelectedPlan(planId);

    try {
      const response = await subscribeToTier(planId);

      // Show success toast
      toast({
        title: "Subscription Successful",
        description: "You have successfully subscribed to the plan",
      });


      return response;
    } catch (error) {
      // Show error toast
      toast({
        title: "Subscription Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });

      throw error;
    } finally {
      setIsSubscribing(false);
      setSelectedPlan(null);
    }
  };

  // sorting plans by price
  let plans = data?.plans.sort(
    (a, b) => a.price - b.price
  )

  // Return all the state and functions needed by components
  return {
    plans: plans || [],      // List of subscription plans (empty array if undefined)
    subscribe,               // Function to subscribe to a plan
    selectedPlan,            // ID of the currently selected plan
    error,                   // Error from SWR if plan fetching failed
    isLoading,               // Loading state from SWR
    isSubscribing,           // Loading state for subscription action
    refresh: mutate          // Function to manually refresh the data
  };
}
