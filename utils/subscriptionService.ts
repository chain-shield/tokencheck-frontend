/**
 * Subscription Service
 *
 * This module provides functions for interacting with the subscription API endpoints.
 * It handles retrieving subscription plans, current subscription information,
 * and subscribing to new tiers.
 */

import { CreateSubscriptionRequest, SubscribeToTierResponse, UserSubscription, SubscriptionPlanResponse, SubscriptionPlan, SubscriptionUserResponse, PaymentInfoResponse } from '@/lib/models/models';
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
export async function getCurrentSubscription(): Promise<SubscriptionUserResponse> {
  return subscriptionApiRequest<SubscriptionUserResponse>('/secured/sub/current', 'GET');
}

/**
 * Retrieves the user's payment history
 *
 * @param filters - Optional filters for payment history (e.g., date range, status)
 * @returns Promise resolving to the user's payment history
 */
export async function getPaymentHistory(filters?: Record<string, any>): Promise<PaymentInfoResponse> {
  return subscriptionApiRequest<PaymentInfoResponse>(
    '/secured/pay/payment-intents',
    'POST',
    filters || null
  )
}

/**
 * Cancels the user's current subscription adn removes the user from the database
 */
export async function cancelSubscription(): Promise<void> {
  return subscriptionApiRequest<void>('/secured/sub/cancel', 'DELETE');
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

  const createSubscriptionRequest = {
    price_id: planIdString,
    success_url: window.location.origin + '/payment/success',
    cancel_url: window.location.origin + '/payment/cancel',
  }
  return subscriptionApiRequest<SubscribeToTierResponse>('/secured/sub/subscribe', 'POST', createSubscriptionRequest);
}
