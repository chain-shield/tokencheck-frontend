export interface User {
  id?: string;
  username?: string;
  created_at?: string; // ISO date string
}

export interface RegisterRequest {
  username: string,
  password: string,
}

export interface LoginRequest {
  username: string,
  password: string,
}

export interface LoginResponse {
  token: string,
  user: User,
}


export interface SubscriptionTier {
  id: number,
  name: String,
  daily_limit: number,
  monthly_limit: number,
  rate_limit_per_second: number,
  features: String,
  price_monthly: number,
}

export interface SubscribeToTierResponse {
  subscription: UserSubscription,
  token: string,
}

export interface UserSubscription {
  user_id: string,
  tier_id: number,
  start_date: string,
  subscription_status: string,
}

export interface CreateSubscriptionRequest {
  tier_id: number,
}
