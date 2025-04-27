
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

export interface ApiKey {
  /** Unique identifier for the API key */
  id: string,
  /** Name of the API key */
  name: string,
  /** Key of the API key */
  key: string,
  /** Status of the API key */
  status: string,
  /** ISO timestamp of when the API key was created */
  created_at: string,
}

export interface CreateApiKeyResponse {
  /** Newly created API key */
  id: string,
  user_id: string,
  key: string,
  name: string,
  status: string,
  created_at: string,
  permissions: Object,
}

/**
 * Represents a subscription plan with its features and pricing details.
 * Matches the backend SubscriptionPlan struct.
 */
export interface SubscriptionPlan {
  /** Unique identifier for the subscription plan */
  id: string,
  /** Name of the subscription plan */
  name: string,
  /** Description of the subscription plan */
  description: string,
  /** Price in the smallest currency unit (e.g., cents) */
  price: number,
  /** Currency code (e.g., 'USD') */
  currency: string,
  /** Billing interval (e.g., 'month', 'year') */
  interval: string,
  /** Whether the plan is currently active */
  active: boolean,
  /** List of features included in this plan */
  features?: string[],
  /** Additional metadata for the plan */
  metadata?: object,
}

export interface SubscriptionPlanResponse {
  /** List of available subscription plans */
  plans: SubscriptionPlan[]
}

/**
 * Response returned after subscribing to a plan.
 * Contains the subscription details and updated authentication token.
 */
export interface SubscribeToTierResponse {
  // URL to redirect user to payment page
  url: string,
}

/**
 * Represents a user's subscription to a specific plan.
 * Matches the backend UserSubscription struct.
 */
export interface UserSubscription {
  /** Unique identifier for the subscription */
  id: string,
  /** ID of the customer who owns this subscription */
  customer_id: string,
  /** ID of the price associated with this subscription */
  price_id: string,
  /** Current status of the subscription (e.g., "active", "canceled", "expired") */
  status: string,
  /** Unix timestamp of when the current billing period ends */
  current_period_end: number,
  /** Whether the subscription will be canceled at the end of the current period */
  cancel_at_period_end: boolean,
}

export interface SubscriptionUserResponse {
  subscription: UserSubscription,
}

/**
 * Request payload for creating a new subscription.
 */
export interface CreateSubscriptionRequest {
  /** ID of the subscription plan to subscribe to */
  price_id: string,
  success_url: string,
  cancel_url: string,
}

export interface PaymentInfo {
  id: string,
  amount: number,
  currency: string,
  status: string,
  created: number,
}

export interface PaymentInfoResponse {
  intents: PaymentInfo[]
}