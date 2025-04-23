/**
 * Mock implementation of the subscriptionService for testing
 */

import { SubscribeToTierResponse, SubscriptionPlan, UserSubscription } from '@/lib/models/models';

// Mock subscription plans
export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: '1',
    name: 'Free',
    description: 'Basic plan for testing',
    price: 0,
    currency: 'USD',
    interval: 'month',
    active: true,
    features: ['Basic token analysis', 'Email support'],
    metadata: { daily_limit: 10 } as object
  },
  {
    id: '2',
    name: 'Basic',
    description: 'Standard plan for individuals',
    price: 9700, // $97.00
    currency: 'USD',
    interval: 'month',
    active: true,
    features: ['Advanced token analysis', 'Priority support', 'API key management'],
    metadata: { daily_limit: 300 } as object
  },
  {
    id: '3',
    name: 'Pro',
    description: 'Advanced plan for teams',
    price: 29700, // $297.00
    currency: 'USD',
    interval: 'month',
    active: true,
    features: ['Premium token analysis', '24/7 support', 'Multiple API keys', 'Advanced analytics'],
    metadata: { daily_limit: 3000 } as object
  }
];

// Mock current subscription
export let mockCurrentSubscription: SubscriptionPlan = mockSubscriptionPlans[0]; // Free plan by default

// Mock user subscription
export const mockUserSubscription: UserSubscription = {
  id: 'sub_123456789',
  customer_id: 'cus_mock123',
  price_id: 'price_free',
  status: 'active',
  current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
  cancel_at_period_end: false
};

// Store for tracking function calls
export const subscriptionServiceCalls = {
  getSubscriptionPlans: [] as Record<string, never>[],
  getCurrentSubscription: [] as Record<string, never>[],
  subscribeToTier: [] as Array<{ planId: string | number }>
};

/**
 * Mock implementation of getSubscriptionPlans
 *
 * @returns Promise resolving to mock subscription plans
 */
export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  subscriptionServiceCalls.getSubscriptionPlans.push({});
  return [...mockSubscriptionPlans]; // Return a copy to prevent mutation
}

/**
 * Mock implementation of getCurrentSubscription
 *
 * @returns Promise resolving to mock current subscription plan
 */
export async function getCurrentSubscription(): Promise<SubscriptionPlan> {
  subscriptionServiceCalls.getCurrentSubscription.push({});
  return { ...mockCurrentSubscription }; // Return a copy to prevent mutation
}

/**
 * Mock implementation of subscribeToTier
 *
 * @param planId - ID of the subscription plan to subscribe to
 * @returns Promise resolving to mock subscription response
 */
export async function subscribeToTier(planId: string | number): Promise<SubscribeToTierResponse> {
  subscriptionServiceCalls.subscribeToTier.push({ planId });

  // Validate plan ID
  const planIndex = mockSubscriptionPlans.findIndex(plan => plan.id === String(planId));

  if (planIndex === -1) {
    const error = new Error('Invalid subscription plan ID') as Error & {
      status?: number;
      data?: Record<string, unknown> | null;
    };
    error.status = 400;
    throw error;
  }

  // Update mock current subscription
  mockCurrentSubscription = mockSubscriptionPlans[planIndex];

  // Update mock user subscription
  mockUserSubscription.price_id = `price_${mockCurrentSubscription.id}`;
  mockUserSubscription.current_period_end = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days from now

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
  // Reset current subscription to Free plan
  mockCurrentSubscription = mockSubscriptionPlans[0];

  // Reset user subscription
  mockUserSubscription.price_id = 'price_free';
  mockUserSubscription.current_period_end = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
  mockUserSubscription.status = 'active';
  mockUserSubscription.cancel_at_period_end = false;

  // Reset call history
  subscriptionServiceCalls.getSubscriptionPlans.length = 0;
  subscriptionServiceCalls.getCurrentSubscription.length = 0;
  subscriptionServiceCalls.subscribeToTier.length = 0;
}
