/**
 * Represents a user in the system.
 */
export interface User {
  /** Unique identifier for the user */
  id: string;
  /** User's email address */
  email: string;
  /** User's first name */
  first_name: string;
  /** User's last name */
  last_name: string;
  /** Optional company name associated with the user */
  company_name?: string;
  /** ISO timestamp of when the user was created */
  created_at: string;
  /** ISO timestamp of when the user was last updated */
  updated_at: string;
  /** Source/platform where the user verification originated */
  verification_origin: string;
  /** Whether the user's account has been verified */
  verified: boolean;
}

/**
 * Request payload for user registration.
 */
export interface RegisterRequest {
  /** Username for registration */
  username: string,
  /** Password for the new account */
  password: string,
}

/**
 * Request payload for user login.
 */
export interface LoginRequest {
  /** Username for login */
  username: string,
  /** User's password */
  password: string,
}

/**
 * Response returned after successful login.
 */
export interface LoginResponse {
  /** Authentication token for the session */
  token: string,
  /** User information */
  user: User,
}

/**
 * Response returned when retrieving the current session.
 */
export interface SessionResponse {
  /** Authentication token for the session */
  token: string,
  /** User information */
  user: User,
}

/**
 * Response returned after successful registration.
 */
export interface RegisterResponse {
  /** Newly created user information */
  user: User,
}

/**
 * Represents a subscription tier with its features and limits.
 */
export interface SubscriptionTier {
  /** Unique identifier for the subscription tier */
  id: number,
  /** Name of the subscription tier */
  name: String,
  /** Maximum number of requests allowed per day */
  daily_limit: number,
  /** Maximum number of requests allowed per month */
  monthly_limit: number,
  /** Maximum number of requests allowed per second */
  rate_limit_per_second: number,
  /** Comma-separated list or JSON string of features included in this tier */
  features: String,
  /** Monthly price in the smallest currency unit (e.g., cents) */
  price_monthly: number,
}

/**
 * Response returned after subscribing to a tier.
 */
export interface SubscribeToTierResponse {
  /** Details of the created subscription */
  subscription: UserSubscription,
  /** Updated authentication token */
  token: string,
}

/**
 * Represents a user's subscription to a specific tier.
 */
export interface UserSubscription {
  /** ID of the user who owns this subscription */
  user_id: string,
  /** ID of the subscription tier */
  tier_id: number,
  /** ISO timestamp of when the subscription started */
  start_date: string,
  /** Current status of the subscription (e.g., "active", "canceled", "expired") */
  subscription_status: string,
}

/**
 * Request payload for creating a new subscription.
 */
export interface CreateSubscriptionRequest {
  /** ID of the subscription tier to subscribe to */
  tier_id: number,
}
