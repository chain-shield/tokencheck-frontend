
import { apiRequest } from './apiRequest';

export async function getSubscriptionPlans() {
  return apiRequest('/secured/sub/plans', 'GET');
}

export async function getCurrentSubscription() {
  return apiRequest('/secured/sub/current', 'GET');
}

export async function subscribeToTier(tierId: string) {
  console.log(tierId);
  return apiRequest('/secured/sub/subscribe', 'POST', { tier_id: tierId });
}
