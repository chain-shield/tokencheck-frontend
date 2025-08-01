"use client";

import { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../utils/authService';
import { User } from '@/lib/models/models';
import { getAuthTokenFromLocalStorage, getCurrentUser, getUserFromLocalStorage, isAuthenticated, OAuthProvider, removeAuthTokenAndUser, setTokenInLocalStorage } from '@/utils/oAuthService';
import { mutate } from 'swr';
import { useUserData } from '@/hooks/use-user-data';

/**
 * AuthContextType defines the shape of the authentication context
 * that will be provided throughout the application.
 */
export interface AuthContextType {
  user: User | null;                                                      // Current authenticated user or null
  loading: boolean;                                                       // Loading state for auth operations
  error: string | null;                                                   // Error message if auth operation fails
  login: (email: string, password: string) => Promise<User>;           // Function to log in a user
  register: (email: string, username: string, password: string) => Promise<User>; // Function to register a new user
  logout: () => Promise<void>;                                            // Function to log out the current user
  updateAuthToken: (provider: OAuthProvider, newToken: string) => Promise<void>;   // Function to update auth token
}

/**
 * AuthContext provides authentication state and methods throughout the application.
 * Default values are provided for type safety but will be overridden by the provider.
 */
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => ({} as User),
  register: async () => ({} as User),
  logout: async () => { },
  updateAuthToken: async () => { },
});

/**
 * AuthProvider component that wraps the application and provides authentication context.
 * Handles user authentication state, login, registration, and logout functionality.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components that will have access to auth context
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Use the SWR hook for user data
  const {
    user: swrUser,
    refreshUser,
    isLoading: swrLoading,
    error: swrError
  } = useUserData();

  // Keep local state for compatibility and additional state
  const [user, setUser] = useState<User | null | undefined>(swrUser);
  const [loading, setLoading] = useState<boolean>(swrLoading);
  const [error, setError] = useState<string | null>(swrError ? String(swrError) : null);

  // Update local state when SWR data changes
  useEffect(() => {
    // Update user state when SWR data changes
    if (swrUser !== user) {
      setUser(swrUser);
    }

    // Update loading state when SWR loading changes
    // Make sure we don't get stuck in loading state
    if (swrLoading !== loading) {
      setLoading(swrLoading);
    } else if (!swrLoading && loading && swrUser === null) {
      // If SWR is done loading but we're still in loading state and user is null,
      // explicitly set loading to false
      setLoading(false);
    }

    // Update error state when SWR error changes
    if (swrError && String(swrError) !== error) {
      setError(String(swrError));
    }
  }, [swrUser, swrLoading, swrError, user, loading, error]);

  useEffect(() => {
    /**
     * Checks if a user is currently logged in by:
     * 1. Looking for OAuth tokens in localStorage
     * 2. Attempting to retrieve user data from localStorage
     * 3. Falling back to server verification if needed
     */
    const checkLoggedIn = async () => {
      try {
        // Only log in development environment
        if (process.env.NODE_ENV === 'development') {
          console.log('checking if user is logged in (auth guard)');
        }

        // Check for OAuth token in localStorage
        const oAuthToken = getAuthTokenFromLocalStorage();

        if (oAuthToken) {
          if (process.env.NODE_ENV === 'development') {
            console.log('oAuthToken found (auth guard)', oAuthToken.provider);
          }

          const { provider, token } = oAuthToken;
          setTokenInLocalStorage(provider, token);

          // Try to get user from localStorage
          const userStr = getUserFromLocalStorage(provider);
          if (userStr) {
            try {
              const userData = JSON.parse(userStr);

              if (process.env.NODE_ENV === 'development') {
                console.log('user found in localStorage (auth guard)', userData.email || 'user data');
              }
              setLoading(false);
              setUser(userData);
              return; // Exit early if we found user data
            } catch (e) {
              removeAuthTokenAndUser();
              if (process.env.NODE_ENV === 'development') {
                console.error('Error parsing user data from localStorage', e instanceof Error ? e.message : 'Unknown error');
              }
            }
            finally {
              setLoading(false);
            }
          }
        }

        // If no valid user in localStorage, try to get from server
        const userData = await getCurrentUser();
        if (userData) {
          if (process.env.NODE_ENV === 'development') {
            console.log('userData retrieved from server (auth guard)', userData.email || 'user data');
          }
          setUser(userData);
        } else {
          // No authenticated user found
          setUser(null);
        }

      } catch (error) {
        console.error('Auth check error', error);

        removeAuthTokenAndUser();
        setUser(null);
      } finally {
        // Always ensure loading is set to false when done
        setLoading(false);

        // Also refresh the SWR cache to ensure it's in sync
        refreshUser().catch(err => console.error('Failed to refresh user data', err));
      }
    };

    /**
     * Event handler for when authentication data is saved.
     * Triggers a re-check of the login state.
     */
    const handleAuthDataSaved = () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Auth data saved event received');
      }
      checkLoggedIn();
    };

    /**
     * Handles changes to localStorage across browser tabs.
     * Re-checks authentication when relevant auth keys change.
     */
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && (e.key.endsWith('Token') || e.key.endsWith('User') || e.key.endsWith('user'))) {
        checkLoggedIn();
      }
    };

    // Add event listeners for cross-tab auth and auth data updates
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authDataSaved', handleAuthDataSaved);

    // Check authentication on component mount if a token exists
    if (isAuthenticated()) {
      checkLoggedIn();
    }

    // Set loading to false after component mounted
    setLoading(false);

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authDataSaved', handleAuthDataSaved);
    };
  }, []);

  /**
   * Authenticates a user with email and password.
   * Updates the auth context with user data on success.
   *
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<User>} - Authenticated user data
   * @throws Will throw an error if authentication fails
   */
  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const userData = await loginUser(email, password);
      setUser(userData);

      // Refresh SWR cache for user data
      await refreshUser();

      // Invalidate API keys cache
      await mutate('api-keys');

      window.dispatchEvent(new Event('authDataSaved'));
      return userData;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Registers a new user with email, username, and password.
   * Updates the auth context with the new user data on success.
   *
   * @param {string} email - User's email
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise<User>} - Newly registered user data
   * @throws Will throw an error if registration fails
   */
  const register = async (email: string, username: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const userData = await registerUser(email, username, password);
      setUser(userData);

      // Refresh SWR cache for user data
      await refreshUser();

      // Invalidate API keys cache
      await mutate('api-keys');

      window.dispatchEvent(new Event('authDataSaved'));
      return userData;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logs out the current user by removing auth tokens and user data.
   */
  const logout = async () => {
    try {
      removeAuthTokenAndUser();
      setUser(null);

      // Refresh SWR cache for user data (will be null after logout)
      await refreshUser();

      // Clear API keys cache
      await mutate('api-keys', [], false);

      // Clear all other caches that might contain user-specific data
      await mutate('token-data-*');
      await mutate('user-*');
      await mutate('subscription-*');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage || 'Logout failed');
    }
  };

  /**
   * Updates the authentication token for a specific provider.
   * Refreshes the user state to reflect the new authentication.
   */
  const updateAuthToken = async (provider: OAuthProvider, newToken: string) => {
    if (newToken) {
      setTokenInLocalStorage(provider, newToken);

      // Refresh SWR cache for user data
      await refreshUser();

      if (user) {
        setUser({ ...user });
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user: user ?? null, // Ensure we never pass undefined
      loading,
      error,
      login,
      register,
      logout,
      updateAuthToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};
