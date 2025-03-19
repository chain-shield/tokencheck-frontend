
import { SubscribeToTierResponse, SubscriptionTier } from '@/lib/models/models';
import { apiRequest } from './apiRequest';

export async function getSubscriptionPlans(): Promise<SubscriptionTier[]> {
  return apiRequest<SubscriptionTier[]>('/secured/sub/plans', 'GET');
}

export async function getCurrentSubscription(): Promise<SubscriptionTier> {
  return apiRequest<SubscriptionTier>('/secured/sub/current', 'GET');
}

export async function subscribeToTier(tierId: string): Promise<SubscribeToTierResponse> {
  console.log(tierId);
  return apiRequest<SubscribeToTierResponse>('/secured/sub/subscribe', 'POST', { tier_id: tierId });
}
