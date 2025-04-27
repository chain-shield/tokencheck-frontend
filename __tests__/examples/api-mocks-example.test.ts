/**
 * Example test file demonstrating how to use the API service mocks
 */

import { mockApiResponse, apiRequest, resetMocks as resetApiMocks } from '@/utils/__mocks__/apiRequest';
import { loginUser, authServiceCalls, resetMocks as resetAuthMocks } from '@/utils/__mocks__/authService';
import { getAllKeys, createKey, deleteKey, resetMocks as resetKeyMocks } from '@/utils/__mocks__/keyService';
import { getCurrentUser, isAuthenticated, resetMocks as resetOAuthMocks } from '@/utils/__mocks__/oAuthService';
import { getSubscriptionPlans, subscribeToTier, resetMocks as resetSubscriptionMocks } from '@/utils/__mocks__/subscriptionService';

// Import the custom response type from the mock
// This is a workaround for testing purposes
interface MockSubscribeToTierResponse {
  subscription: {
    tier_id: number;
    [key: string]: any;
  };
  token: string;
  url: string;
}

// Using Jest's actual expect function
// No need to mock it anymore

/**
 * Example test suite for API request mocking
 */
describe('API Request Mocking Example', () => {
  beforeEach(() => {
    resetApiMocks();
  });

  it('should return mocked data for API requests', async () => {
    // Configure a mock response
    mockApiResponse('/api/users', {
      data: { id: '123', name: 'Test User' },
      status: 200
    });

    // Make the API request
    const result = await apiRequest('/api/users');

    // Assert the result
    expect(result).toEqual({ id: '123', name: 'Test User' });
  });
});

/**
 * Example test suite for authentication service mocking
 */
describe('Auth Service Mocking Example', () => {
  beforeEach(() => {
    resetAuthMocks();
  });

  it('should track login calls and return mock user', async () => {
    // Call the login function
    const user = await loginUser('test@example.com', 'password123');

    // Verify we got a user back
    expect(user).toBeTruthy();

    // Assert that the function was called with the correct arguments
    expect(authServiceCalls.loginUser).toHaveLength(1);
    expect(authServiceCalls.loginUser[0]).toEqual({
      email: 'test@example.com',
      password: 'password123'
    });
  });
});

/**
 * Example test suite for API key service mocking
 */
describe('Key Service Mocking Example', () => {
  beforeEach(() => {
    resetKeyMocks();
  });

  it('should create and delete API keys', async () => {
    // Get initial keys
    const initialKeys = await getAllKeys();
    expect(initialKeys).toHaveLength(2);

    // Create a new key
    const newKey = await createKey('Test API Key 3');
    expect(newKey.name).toBe('Test API Key 3');

    // Get updated keys
    const updatedKeys = await getAllKeys();
    expect(updatedKeys).toHaveLength(3);

    // Delete a key
    await deleteKey(initialKeys[0].id);

    // Get final keys
    const finalKeys = await getAllKeys();
    expect(finalKeys).toHaveLength(2);
  });
});

/**
 * Example test suite for OAuth service mocking
 */
describe('OAuth Service Mocking Example', () => {
  beforeEach(() => {
    resetOAuthMocks();
  });

  it('should check authentication status', async () => {
    // Check if authenticated
    const authenticated = isAuthenticated();
    expect(authenticated).toBe(true);

    // Get current user
    const user = await getCurrentUser();
    expect(user?.email).toBe('test@example.com');
  });
});

/**
 * Example test suite for subscription service mocking
 */
describe('Subscription Service Mocking Example', () => {
  beforeEach(() => {
    resetSubscriptionMocks();
  });

  it('should get subscription plans and subscribe to a tier', async () => {
    // Get subscription plans
    const plansResponse = await getSubscriptionPlans();
    expect(plansResponse.plans).toHaveLength(3);

    // Subscribe to a tier
    const subscription = await subscribeToTier('2') as MockSubscribeToTierResponse; // Pro tier
    expect(subscription.subscription.tier_id).toBe(2);
  });
});

// This is just an example file and won't actually run as a test
// It's meant to demonstrate how to use the mocks in real tests
