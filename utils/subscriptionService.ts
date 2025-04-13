/**
 * Subscription Service
 *
 * This module provides functions for interacting with the subscription API endpoints.
 * It handles retrieving subscription plans, current subscription information,
 * and subscribing to new tiers.
 */

import { SubscribeToTierResponse, SubscriptionTier } from '@/lib/models/models';
import { apiRequest } from './apiRequest';

/**
 * Fetches all available subscription plans from the API
 *
 * @returns Promise resolving to an array of subscription tiers
 */
export async function getSubscriptionPlans(): Promise<SubscriptionTier[]> {
  return apiRequest<SubscriptionTier[]>('/secured/sub/plans', 'GET');
}

/**
 * Retrieves the user's current subscription information
 *
 * @returns Promise resolving to the user's current subscription tier
 */
export async function getCurrentSubscription(): Promise<SubscriptionTier> {
  return apiRequest<SubscriptionTier>('/secured/sub/current', 'GET');
}

/**
 * Subscribes the user to a new subscription tier
 *
 * @param tierId - The ID of the subscription tier to subscribe to
 * @returns Promise resolving to the subscription response containing status and details
 */
export async function subscribeToTier(tierId: string | number): Promise<SubscribeToTierResponse> {
  // Log the tier ID for debugging purposes
  console.log(`Subscribing to tier: ${tierId}`);
  // Convert tierId to string to ensure consistency with API expectations
  const tierIdString = String(tierId);
  return apiRequest<SubscribeToTierResponse>('/secured/sub/subscribe', 'POST', { tier_id: tierIdString });
}
