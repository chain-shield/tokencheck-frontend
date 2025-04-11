/**
 * Mock implementation of the oAuthService for testing
 */

import { SessionResponse, User } from '@/lib/models/models';

// Re-export the OAuthProvider enum for consistency
export enum OAuthProvider {
  GOOGLE = 'google',
  APPLE = 'apple',
  X = 'x',
  FACEBOOK = 'facebook',
  GITHUB = 'github',
  EMAIL = 'email',
}

// Re-export ALL_OAUTH_PROVIDERS
export const ALL_OAUTH_PROVIDERS: OAuthProvider[] = Object.values(OAuthProvider) as OAuthProvider[];

// Mock user data
export const mockUser: User = {
  id: 'mock-user-id-123',
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  company_name: 'Test Company',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  verification_origin: 'email',
  verified: true
};

// Mock token data
export const mockToken = 'mock-jwt-token-1234567890';

// Mock session response
export const mockSessionResponse: SessionResponse = {
  token: mockToken,
  user: mockUser
};

// Mock storage for tokens and users
export const mockStorage: Record<string, string> = {};

// Store for tracking function calls
export const oAuthServiceCalls = {
  getCurrentUser: [] as any[],
  removeAuthTokenAndUser: [] as any[],
  isAuthenticated: [] as any[],
  getAuthTokenFromLocalStorage: [] as any[],
  findUserFromLocalStorage: [] as any[],
  getUserAndToken: [] as Array<{ provider: OAuthProvider }>,
  fetchUserAndToken: [] as any[],
  getTokenFromLocalStorage: [] as Array<{ provider: OAuthProvider }>,
  setTokenInLocalStorage: [] as Array<{ provider: OAuthProvider; token: string }>,
  removeTokenFromLocalStorage: [] as Array<{ provider: OAuthProvider }>,
  isTokenSetFromLocalStorage: [] as Array<{ provider: OAuthProvider }>,
  getUserFromLocalStorage: [] as Array<{ provider: OAuthProvider }>,
  setUserInLocalStorage: [] as Array<{ provider: OAuthProvider; user: User | string }>,
  removeUserFromLocalStorage: [] as Array<{ provider: OAuthProvider }>,
  isUserSetFromLocalStorage: [] as Array<{ provider: OAuthProvider }>
};

// Mock authentication state
let mockIsAuthenticated = true;

/**
 * Set the mock authentication state
 *
 * @param isAuth - Whether the user should be authenticated
 */
export function setMockIsAuthenticated(isAuth: boolean): void {
  mockIsAuthenticated = isAuth;
}

/**
 * Mock implementation of getCurrentUser
 *
 * @returns Promise resolving to mock user or null
 */
export async function getCurrentUser(): Promise<User | null> {
  oAuthServiceCalls.getCurrentUser.push({});

  if (mockIsAuthenticated) {
    return { ...mockUser }; // Return a copy to prevent mutation
  }

  return null;
}

/**
 * Mock implementation of removeAuthTokenAndUser
 */
export function removeAuthTokenAndUser(): void {
  oAuthServiceCalls.removeAuthTokenAndUser.push({});
  mockIsAuthenticated = false;

  // Clear mock storage
  Object.keys(mockStorage).forEach(key => {
    delete mockStorage[key];
  });
}

/**
 * Mock implementation of isAuthenticated
 *
 * @returns Boolean indicating mock authentication status
 */
export function isAuthenticated(): boolean {
  oAuthServiceCalls.isAuthenticated.push({});
  return mockIsAuthenticated;
}

/**
 * Mock implementation of getAuthTokenFromLocalStorage
 *
 * @returns Mock OAuth token or null
 */
export function getAuthTokenFromLocalStorage(): { provider: OAuthProvider; token: string } | null {
  oAuthServiceCalls.getAuthTokenFromLocalStorage.push({});

  if (mockIsAuthenticated) {
    return {
      provider: OAuthProvider.EMAIL,
      token: mockToken
    };
  }

  return null;
}

/**
 * Mock implementation of findUserFromLocalStorage
 *
 * @returns Mock user JSON string or null
 */
export function findUserFromLocalStorage(): string | null {
  oAuthServiceCalls.findUserFromLocalStorage.push({});

  if (mockIsAuthenticated) {
    return JSON.stringify(mockUser);
  }

  return null;
}

/**
 * Mock implementation of getUserAndToken
 *
 * @param provider - OAuth provider
 * @returns Promise resolving to mock OAuth data or null
 */
export async function getUserAndToken(provider: OAuthProvider): Promise<{ token: string; user: string } | null> {
  oAuthServiceCalls.getUserAndToken.push({ provider });

  if (mockIsAuthenticated) {
    return {
      token: mockToken,
      user: JSON.stringify(mockUser)
    };
  }

  return null;
}

/**
 * Mock implementation of fetchUserAndToken
 *
 * @returns Promise resolving to mock session response or null
 */
export async function fetchUserAndToken(): Promise<SessionResponse | null> {
  oAuthServiceCalls.fetchUserAndToken.push({});

  if (mockIsAuthenticated) {
    return { ...mockSessionResponse }; // Return a copy to prevent mutation
  }

  return null;
}

/**
 * Mock implementation of getTokenFromLocalStorage
 *
 * @param provider - OAuth provider
 * @returns Mock token or null
 */
export function getTokenFromLocalStorage(provider: OAuthProvider): string | null {
  oAuthServiceCalls.getTokenFromLocalStorage.push({ provider });

  const key = provider === OAuthProvider.EMAIL ? 'authToken' : `${provider}Token`;
  return mockStorage[key] || null;
}

/**
 * Mock implementation of setTokenInLocalStorage
 *
 * @param provider - OAuth provider
 * @param token - Token to store
 */
export function setTokenInLocalStorage(provider: OAuthProvider, token: string): void {
  oAuthServiceCalls.setTokenInLocalStorage.push({ provider, token });

  const key = provider === OAuthProvider.EMAIL ? 'authToken' : `${provider}Token`;
  mockStorage[key] = token;
  mockIsAuthenticated = true;
}

/**
 * Mock implementation of removeTokenFromLocalStorage
 *
 * @param provider - OAuth provider
 */
export function removeTokenFromLocalStorage(provider: OAuthProvider): void {
  oAuthServiceCalls.removeTokenFromLocalStorage.push({ provider });

  const key = provider === OAuthProvider.EMAIL ? 'authToken' : `${provider}Token`;
  delete mockStorage[key];
}

/**
 * Mock implementation of isTokenSetFromLocalStorage
 *
 * @param provider - OAuth provider
 * @returns Boolean indicating if token exists
 */
export function isTokenSetFromLocalStorage(provider: OAuthProvider): boolean {
  oAuthServiceCalls.isTokenSetFromLocalStorage.push({ provider });

  const key = provider === OAuthProvider.EMAIL ? 'authToken' : `${provider}Token`;
  return !!mockStorage[key];
}

/**
 * Mock implementation of getUserFromLocalStorage
 *
 * @param provider - OAuth provider
 * @returns Mock user JSON string or null
 */
export function getUserFromLocalStorage(provider: OAuthProvider): string | null {
  oAuthServiceCalls.getUserFromLocalStorage.push({ provider });

  const key = provider === OAuthProvider.EMAIL ? 'user' : `${provider}User`;
  return mockStorage[key] || null;
}

/**
 * Mock implementation of setUserInLocalStorage
 *
 * @param provider - OAuth provider
 * @param user - User object or JSON string
 */
export function setUserInLocalStorage(provider: OAuthProvider, user: User | string): void {
  oAuthServiceCalls.setUserInLocalStorage.push({ provider, user });

  const userString = typeof user === 'string' ? user : JSON.stringify(user);
  const key = provider === OAuthProvider.EMAIL ? 'user' : `${provider}User`;
  mockStorage[key] = userString;
}

/**
 * Mock implementation of removeUserFromLocalStorage
 *
 * @param provider - OAuth provider
 */
export function removeUserFromLocalStorage(provider: OAuthProvider): void {
  oAuthServiceCalls.removeUserFromLocalStorage.push({ provider });

  const key = provider === OAuthProvider.EMAIL ? 'user' : `${provider}User`;
  delete mockStorage[key];
}

/**
 * Mock implementation of isUserSetFromLocalStorage
 *
 * @param provider - OAuth provider
 * @returns Boolean indicating if user exists
 */
export function isUserSetFromLocalStorage(provider: OAuthProvider): boolean {
  oAuthServiceCalls.isUserSetFromLocalStorage.push({ provider });

  const key = provider === OAuthProvider.EMAIL ? 'user' : `${provider}User`;
  return !!mockStorage[key];
}

/**
 * Reset all mock data and call history
 */
export function resetMocks(): void {
  // Reset authentication state
  mockIsAuthenticated = true;

  // Clear mock storage
  Object.keys(mockStorage).forEach(key => {
    delete mockStorage[key];
  });

  // Reset call history
  Object.keys(oAuthServiceCalls).forEach(key => {
    (oAuthServiceCalls as any)[key].length = 0;
  });
}
