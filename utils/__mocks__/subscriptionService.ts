/**
 * Mock implementation of the subscriptionService for testing
 */

import { SubscribeToTierResponse, SubscriptionTier, UserSubscription } from '@/lib/models/models';

// Mock subscription tiers
export const mockSubscriptionTiers: SubscriptionTier[] = [
  {
    id: 1,
    name: 'Free',
    daily_limit: 100,
    monthly_limit: 3000,
    rate_limit_per_second: 1,
    features: 'Basic token analysis,Email support',
    price_monthly: 0
  },
  {
    id: 2,
    name: 'Pro',
    daily_limit: 1000,
    monthly_limit: 30000,
    rate_limit_per_second: 5,
    features: 'Advanced token analysis,Priority email support,API access',
    price_monthly: 2999 // $29.99
  },
  {
    id: 3,
    name: 'Enterprise',
    daily_limit: 10000,
    monthly_limit: 300000,
    rate_limit_per_second: 20,
    features: 'Full token analysis suite,24/7 dedicated support,Unlimited API access,Custom integrations',
    price_monthly: 9999 // $99.99
  }
];

// Mock current subscription
export let mockCurrentSubscription: SubscriptionTier = mockSubscriptionTiers[0]; // Free tier by default

// Mock user subscription
export const mockUserSubscription: UserSubscription = {
  user_id: 'mock-user-id-123',
  tier_id: 1, // Free tier by default
  start_date: new Date().toISOString(),
  subscription_status: 'active'
};

// Store for tracking function calls
export const subscriptionServiceCalls = {
  getSubscriptionPlans: [] as any[],
  getCurrentSubscription: [] as any[],
  subscribeToTier: [] as Array<{ tierId: string }>
};

/**
 * Mock implementation of getSubscriptionPlans
 * 
 * @returns Promise resolving to mock subscription tiers
 */
export async function getSubscriptionPlans(): Promise<SubscriptionTier[]> {
  subscriptionServiceCalls.getSubscriptionPlans.push({});
  return [...mockSubscriptionTiers]; // Return a copy to prevent mutation
}

/**
 * Mock implementation of getCurrentSubscription
 * 
 * @returns Promise resolving to mock current subscription tier
 */
export async function getCurrentSubscription(): Promise<SubscriptionTier> {
  subscriptionServiceCalls.getCurrentSubscription.push({});
  return { ...mockCurrentSubscription }; // Return a copy to prevent mutation
}

/**
 * Mock implementation of subscribeToTier
 * 
 * @param tierId - ID of the subscription tier to subscribe to
 * @returns Promise resolving to mock subscription response
 */
export async function subscribeToTier(tierId: string): Promise<SubscribeToTierResponse> {
  subscriptionServiceCalls.subscribeToTier.push({ tierId });
  
  const tierIdNum = parseInt(tierId, 10);
  
  // Validate tier ID
  if (isNaN(tierIdNum) || tierIdNum < 1 || tierIdNum > mockSubscriptionTiers.length) {
    const error = new Error('Invalid subscription tier ID') as Error & {
      status?: number;
      data?: Record<string, unknown> | null;
    };
    error.status = 400;
    throw error;
  }
  
  // Update mock current subscription
  mockCurrentSubscription = mockSubscriptionTiers[tierIdNum - 1];
  
  // Update mock user subscription
  mockUserSubscription.tier_id = tierIdNum;
  mockUserSubscription.start_date = new Date().toISOString();
  
  // Return mock subscription response
  return {
    subscription: { ...mockUserSubscription },
    token: 'mock-updated-jwt-token-1234567890'
  };
}

/**
 * Reset all mock data and call history
 */
export function resetMocks(): void {
  // Reset current subscription to Free tier
  mockCurrentSubscription = mockSubscriptionTiers[0];
  
  // Reset user subscription
  mockUserSubscription.tier_id = 1;
  mockUserSubscription.start_date = new Date().toISOString();
  mockUserSubscription.subscription_status = 'active';
  
  // Reset call history
  subscriptionServiceCalls.getSubscriptionPlans.length = 0;
  subscriptionServiceCalls.getCurrentSubscription.length = 0;
  subscriptionServiceCalls.subscribeToTier.length = 0;
}
