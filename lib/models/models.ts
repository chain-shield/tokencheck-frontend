export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company_name?: string;
  created_at: string;
  updated_at: string;
  verification_origin: string;
  verified: boolean;
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
export  interface SessionResponse {
  token: string,
  user: User,
}
export interface RegisterResponse {
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
