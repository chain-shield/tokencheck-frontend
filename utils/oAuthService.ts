/**
 * Google Authentication Service
 * 
 * This module provides utilities for handling OAuth authentication with various providers,
 * with a focus on Google authentication. It manages user data and authentication tokens
 * in the browser's localStorage.
 */

import { SessionResponse, User } from "@/lib/models/models";
import { apiRequest } from "./apiRequest";

/**
 * Interface representing OAuth data returned after authentication
 */
interface OAuthData {
  token: string;
  user: string;
}

/**
 * Interface representing an OAuth token with its provider
 */
export interface OAuthToken {
  provider: OAuthProvider;
  token: string;
}

/**
 * Enum of supported OAuth providers
 */
export enum OAuthProvider {
  GOOGLE = 'google',
  APPLE = 'apple',
  X = 'x',
  FACEBOOK = 'facebook',
  GITHUB = 'github',
  EMAIL = 'email',
}

/**
 * Array of all OAuth providers for easy iteration, dynamically generated from the enum
 */
export const ALL_OAUTH_PROVIDERS: OAuthProvider[] = Object.values(OAuthProvider) as OAuthProvider[];

/**
 * Retrieves the current authenticated user
 * First checks localStorage, then falls back to server request if needed
 * 
 * @returns Promise resolving to User object or null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  // Only log in development environment
  if (process.env.NODE_ENV === 'development') {
    console.log('getting current user from local storage');
  }

  const userJson = findUserFromLocalStorage();

  if (process.env.NODE_ENV === 'development') {
    console.log('userJson found:', !!userJson);
  }

  if (userJson) {
    const user = JSON.parse(userJson);
    return user;
  }

  // if no user found in local storage, get from server
  if (process.env.NODE_ENV === 'development') {
    console.log('getting user from server');
  }

  try {
    const user = await apiRequest<User>('/secured/me', 'GET');

    if (process.env.NODE_ENV === 'development') {
      console.log('user retrieved from server:', !!user);
    }
    return user;
  } catch (error) {
    if (error instanceof Error && 'status' in error && error.status === 401) {
      return null;
    }
    throw error;
  }
}

/**
 * Removes all authentication tokens and user data from localStorage
 * Effectively logs the user out of all providers
 * Also removes the auth-session cookie
 */
export function removeAuthTokenAndUser(): void {
  // Only log in development environment
  if (process.env.NODE_ENV === 'development') {
    console.log('removing auth token from local storage');
  }

  ALL_OAUTH_PROVIDERS.forEach(provider => {
    removeUserFromLocalStorage(provider);
    removeTokenFromLocalStorage(provider);
  });

  // Remove auth-session cookie
  document.cookie = "auth-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

/**
 * Checks if the user is currently authenticated with any provider
 * 
 * @returns Boolean indicating authentication status
 */
export function isAuthenticated(): boolean {
  return !!getAuthTokenFromLocalStorage();
}

/**
 * Retrieves the first valid authentication token found in localStorage
 * Checks all providers in sequence
 * 
 * @returns OAuthToken object or null if no valid token found
 */
export function getAuthTokenFromLocalStorage(): OAuthToken | null {
  if (typeof window !== 'undefined') {
    for (const provider of ALL_OAUTH_PROVIDERS) {
      if (isTokenSetFromLocalStorage(provider)) {
        const token = getTokenFromLocalStorage(provider);
        if (token) {
          return {
            provider: provider,
            token: token
          };
        }
      }
    }
  }
  return null;
}

/**
 * Finds the first valid user data in localStorage from any provider
 * 
 * @returns User data as string or null if not found
 */
export function findUserFromLocalStorage(): string | null {
  if (typeof window !== 'undefined') {
    for (const provider of ALL_OAUTH_PROVIDERS) {
      if (isUserSetFromLocalStorage(provider)) {
        return getUserFromLocalStorage(provider);
      }
    }
  }
  return null;
}

/**
 * Retrieves user data and authentication token for the specified provider
 * Fetches from the server
 * 
 * @param provider - The OAuth provider to use
 * @returns Promise resolving to OAuthData or null if unavailable
 */
export async function getUserAndToken(provider: OAuthProvider): Promise<OAuthData | null> {
  try {
    const response = await fetchUserAndToken();
    if (response) {
      setTokenInLocalStorage(provider, response.token);
      setUserInLocalStorage(provider, response.user);
      const user = JSON.stringify(response.user);
      return { token: response.token, user: user };
    }
  } catch (error) {
    console.error('Error fetching user and token', error);
    return null;
  }
  const token = getTokenFromLocalStorage(provider);
  const user = getUserFromLocalStorage(provider);
  return token && user ? { token, user } : null;
}

/**
 * Fetches user and token data from the server
 * 
 * @returns Promise resolving to SessionResponse or null if request fails
 */
export async function fetchUserAndToken(): Promise<SessionResponse | null> {
  return apiRequest<SessionResponse>('/session', 'GET', null, false);
}

/**
 * Retrieves the authentication token from localStorage
 * 
 * @param provider - The OAuth provider
 * @returns The token string or null if not found
 */
export function getTokenFromLocalStorage(provider: OAuthProvider): string | null {
  if (typeof window !== 'undefined') {
    if (provider === OAuthProvider.EMAIL) {
      return localStorage.getItem('authToken');
    } else {
      return localStorage.getItem(`${provider}Token`);
    }
  }
  return null;
}

/**
 * Stores the authentication token in localStorage
 * 
 * @param provider - The OAuth provider
 * @param token - The token to store
 */
export function setTokenInLocalStorage(provider: OAuthProvider, token: string): void {
  if (provider === OAuthProvider.EMAIL) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.setItem(`${provider}Token`, token);
  }
}

/**
 * Removes the authentication token from localStorage
 * 
 * @param provider - The OAuth provider
 */
export function removeTokenFromLocalStorage(provider: OAuthProvider): void {
  if (provider === OAuthProvider.EMAIL) {
    localStorage.removeItem('authToken');
  } else {
    localStorage.removeItem(`${provider}Token`);
  }
}

/**
 * Checks if a token exists in localStorage for the specified provider
 * 
 * @param provider - The OAuth provider
 * @returns Boolean indicating if token exists
 */
export function isTokenSetFromLocalStorage(provider: OAuthProvider): boolean {
  let key = '';
  if (provider === OAuthProvider.EMAIL) {
    key = 'authToken';
  } else {
    key = `${provider}Token`;
  }

  const token = localStorage.getItem(key);
  return token !== null;
}

/**
 * Retrieves the user data from localStorage
 * 
 * @param provider - The OAuth provider
 * @returns The user data string or null if not found
 */
export function getUserFromLocalStorage(provider: OAuthProvider): string | null {
  if (typeof window !== 'undefined') {
    if (provider === OAuthProvider.EMAIL) {
      return localStorage.getItem('user');
    } else {
      return localStorage.getItem(`${provider}User`);
    }
  }
  return null;
}

/**
 * Stores the user data in localStorage as a JSON string
 * 
 * @param provider - The OAuth provider
 * @param user - The user object to store
 */
export function setUserInLocalStorage(provider: OAuthProvider, user: User | string): void {
  // Convert user to string first
  const userString = typeof user === 'string' ? user : JSON.stringify(user);

  // Then apply provider-specific logic
  if (provider === OAuthProvider.EMAIL) {
    localStorage.setItem('user', userString);
  } else {
    localStorage.setItem(`${provider}User`, userString);
  }
}

/**
 * Removes the user data from localStorage
 * 
 * @param provider - The OAuth provider
 */
export function removeUserFromLocalStorage(provider: OAuthProvider): void {
  if (provider === OAuthProvider.EMAIL) {
    localStorage.removeItem('user');
  } else {
    localStorage.removeItem(`${provider}User`);
  }
}

/**
 * Checks if user data exists in localStorage for the specified provider
 * 
 * @param provider - The OAuth provider
 * @returns Boolean indicating if user data exists
 */
export function isUserSetFromLocalStorage(provider: OAuthProvider): boolean {
  // Only log in development environment
  if (process.env.NODE_ENV === 'development') {
    console.log('checking if user is set from local storage for provider', provider);
  }
  if (provider === OAuthProvider.EMAIL) {
    const user = localStorage.getItem('user')
    return user !== null;
  } else {
    const key = `${provider}User`;
    const user = localStorage.getItem(`${provider}User`);
    return user !== null;
  }
}
