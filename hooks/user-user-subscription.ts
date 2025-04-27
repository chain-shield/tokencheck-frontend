/**
 * Subscription Plans Hook
 *
 * Custom hook for managing subscription plans using SWR for data fetching
 * with standardized error handling, loading states, and caching.
 */

import { useEffect, useState } from 'react';
import { UserSubscription, SubscribeToTierResponse, SubscriptionPlanResponse, SubscriptionUserResponse, SubscriptionPlan, PaymentInfo } from '@/lib/models/models';
import { getCurrentSubscription, getSubscriptionPlans, GetSubscriptionPlansResponse, subscribeToTier } from '@/utils/subscriptionService';
import { useStaticSWRFetch } from '@/hooks/use-swr-fetch';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/router';
import { useSubscriptionPlans } from './use-subscription-plans';
import { usePaymentHistory } from './use-payment-history';

export interface UserSubscriptionPlan {
  userSubscription: UserSubscription;
  plan: SubscriptionPlan;
  paymentHistory: PaymentInfo[];
}

// Cache key for subscription plans
const SUBSCRIPTION_PLANS_CACHE_KEY = 'user-subscription';

/**
 * Hook for managing subscription plans
 *
 * @returns Object containing subscription plans state and functions to manage them
 */
export function useUserSubscription() {
  const { plans } = useSubscriptionPlans();
  const { paymentHistory } = usePaymentHistory();
  console.log(paymentHistory);
  // Fetch subscription plans using SWR
  // Using static config since plans don't change frequently
  const {
    data,
    error,
    isLoading,
    mutate
  } = useStaticSWRFetch<SubscriptionUserResponse>(
    SUBSCRIPTION_PLANS_CACHE_KEY,
    () => getCurrentSubscription()
  );
  const [userPlan, setUserPlan] = useState<UserSubscriptionPlan | null>(null);

  useEffect(() => {
    // find current user plan
    if (data) {
      console.log('User Subscription:', data);
      const currentUserPlan = plans.find(plan => plan.id === data.subscription.price_id);
      if (currentUserPlan && paymentHistory) {
        console.log('Pyament History:', paymentHistory);
        setUserPlan({
          userSubscription: data.subscription,
          plan: currentUserPlan,
          paymentHistory,
        });
      }
    }
  }, [data, plans, paymentHistory.length]);

  /**
   * Subscribes to a specific tier
   *
   * @param planId - ID of the subscription plan
   * @returns Promise resolving to the subscription response
   */
  const cancelSubscription = async (): Promise<void> => {

    try {
      const response = await cancelSubscription();

      // Show success toast
      toast({
        title: "Subscription Cancelled",
        description: "You have successfully cancelled your subscription",
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
    }

  };

  // Return all the state and functions needed by components
  return {
    userPlan,      // User's current subscription plan
    plans,
    cancelSubscription,      // Function to cancel the subscription
    error,                   // Error from SWR if plan fetching failed
    isLoading,               // Loading state from SWR
    refresh: mutate          // Function to manually refresh the data
  };
}
