/**
 * User Data Hook
 * 
 * Custom hook for fetching and managing user data using SWR
 * with standardized error handling, loading states, and caching.
 */

import { useState } from 'react';
import { User } from '@/lib/models/models';
import { getCurrentUser } from '@/utils/oAuthService';
import { useSWRFetch } from '@/hooks/use-swr-fetch';
import { toast } from '@/hooks/use-toast';

// Cache key for user data
const USER_DATA_CACHE_KEY = 'current-user';

/**
 * Hook for fetching and managing user data
 *
 * @returns Object containing user data state and loading/error states
 */
export function useUserData() {
  // Fetch user data using SWR
  const { 
    data: user, 
    error, 
    isLoading,
    isError,
    mutate 
  } = useSWRFetch<User | null>(
    USER_DATA_CACHE_KEY,
    async () => {
      try {
        return await getCurrentUser();
      } catch (error) {
        // Return null instead of throwing if user is not authenticated
        // This prevents SWR from retrying unnecessarily
        if (error instanceof Error && 'status' in error && error.status === 401) {
          return null;
        }
        throw error;
      }
    }
  );

  // Local state for tracking authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!user);

  // Update authentication state when user data changes
  if (!!user !== isAuthenticated) {
    setIsAuthenticated(!!user);
  }

  /**
   * Refreshes the user data
   * Useful after login/logout or profile updates
   */
  const refreshUser = async () => {
    try {
      await mutate();
    } catch (error) {
      toast({
        title: "Failed to refresh user data",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Return all the state needed by components
  return {
    user,                   // User data
    isAuthenticated,        // Whether the user is authenticated
    error,                  // Error from SWR if data fetching failed
    isLoading,              // Loading state from SWR
    isError,                // Error state from SWR
    refreshUser             // Function to manually refresh the user data
  };
}
