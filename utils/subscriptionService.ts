/**
 * Subscription Service
 *
 * This module provides functions for interacting with the subscription API endpoints.
 * It handles retrieving subscription plans, current subscription information,
 * and subscribing to new tiers.
 */

import { SubscribeToTierResponse, SubscriptionPlan } from '@/lib/models/models';
import { subscriptionApiRequest } from './subscriptionApiRequest';

export interface GetSubscriptionPlansResponse {
  plans: SubscriptionPlan[];
}

/**
 * Fetches all available subscription plans from the API
 *
 * @returns Promise resolving to an array of subscription tiers
 */
export async function getSubscriptionPlans(): Promise<GetSubscriptionPlansResponse> {
  return subscriptionApiRequest<GetSubscriptionPlansResponse>('/sub/plans', 'GET');
}

/**
 * Retrieves the user's current subscription information
 *
 * @returns Promise resolving to the user's current subscription tier
 */
export async function getCurrentSubscription(): Promise<SubscriptionPlan> {
  return subscriptionApiRequest<SubscriptionPlan>('/secured/sub/current', 'GET');
}

/**
 * Subscribes the user to a new subscription tier
 *
 * @param planId - The ID of the subscription plan to subscribe to
 * @returns Promise resolving to the subscription response containing status and details
 */
export async function subscribeToTier(planId: string | number): Promise<SubscribeToTierResponse> {
  // Log the plan ID for debugging purposes
  console.log(`Subscribing to plan: ${planId}`);
  // Convert planId to string to ensure consistency with API expectations
  const planIdString = String(planId);
  return subscriptionApiRequest<SubscribeToTierResponse>('/secured/sub/subscribe', 'POST', { plan_id: planIdString });
}
