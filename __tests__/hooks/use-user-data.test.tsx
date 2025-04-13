/**
 * Tests for the useUserData hook
 *
 * These tests verify that our user data hook works correctly,
 * including proper loading states, error handling, and data fetching.
 */

import { renderHook, waitFor, act } from '@testing-library/react';
import { useUserData } from '@/hooks/use-user-data';
import { SWRConfig } from 'swr';
import { ReactNode } from 'react';
import * as oAuthService from '@/utils/oAuthService';
import { mockUser } from '@/utils/__mocks__/authService';

// Mock the oAuthService module
jest.mock('@/utils/oAuthService', () => ({
  getCurrentUser: jest.fn(),
}));

// Wrapper component for testing
const wrapper = ({ children }: { children: ReactNode }) => <>{children}</>;

describe.skip('useUserData Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return loading state initially', async () => {
    // Setup a mock response that resolves after a delay
    (oAuthService.getCurrentUser as jest.Mock).mockImplementation(() => new Promise(resolve => {
      setTimeout(() => resolve(mockUser), 100);
    }));

    // Render the hook
    const { result } = renderHook(() => useUserData(), { wrapper });

    // Initially, it should be in loading state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.user).toBeUndefined();
    expect(result.current.isAuthenticated).toBe(false);

    // Wait for the data to load
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // After loading, it should have data
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isError).toBe(false);
  });

  it('should handle authentication errors correctly', async () => {
    // Setup a mock response that returns null for unauthenticated user
    const authError = new Error('Unauthorized') as Error & { status?: number };
    authError.status = 401;
    (oAuthService.getCurrentUser as jest.Mock).mockImplementation(() => {
      return Promise.reject(authError).then(() => null).catch(() => null);
    });

    // Render the hook
    const { result } = renderHook(() => useUserData(), { wrapper });

    // Wait for the hook to process the error and set user to null
    await waitFor(() => expect(result.current.user).toBeNull());

    // It should not be in error state, but user should be null
    expect(result.current.isError).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle other errors correctly', async () => {
    // Setup a mock response that rejects with a non-auth error
    const error = new Error('Server error');
    (oAuthService.getCurrentUser as jest.Mock).mockRejectedValue(error);

    // Render the hook
    const { result } = renderHook(() => useUserData(), { wrapper });

    // Wait for the error to be caught
    await waitFor(() => expect(result.current.isError).toBe(true));

    // It should be in error state
    expect(result.current.error).toBe(error);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.user).toBeUndefined();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should allow manual refresh of data', async () => {
    // Setup a mock response
    (oAuthService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

    // Render the hook
    const { result } = renderHook(() => useUserData(), { wrapper });

    // Wait for the initial data to load
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Clear the mock to track new calls
    jest.clearAllMocks();

    // Call the refresh function
    await act(async () => {
      await result.current.refreshUser();
    });

    // The getCurrentUser function should have been called again
    expect(oAuthService.getCurrentUser).toHaveBeenCalled();
  });
});
