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
jest.mock('@/utils/oAuthService');

// Mock SWR
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((key, fetcher, options) => {
    // This mock implementation will call the fetcher and return its result
    // along with loading and error states that can be controlled in tests
    const mockData = { data: undefined, error: undefined, isLoading: true, mutate: jest.fn() };

    if (typeof fetcher === 'function' && key) {
      try {
        // We'll let the test control when this resolves
        mockData.data = undefined;
        mockData.isLoading = true;
      } catch (error) {
        mockData.error = error;
        mockData.isLoading = false;
      }
    }

    return mockData;
  }),
}));

// Wrapper component for testing
const wrapper = ({ children }: { children: ReactNode }) => <>{children}</>;

describe.skip('useUserData Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return loading state initially', async () => {
    // Setup a mock response
    jest.spyOn(oAuthService, 'getCurrentUser').mockResolvedValue(mockUser);

    // Mock SWR to return loading state initially
    const swr = require('swr').default;
    swr.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: jest.fn()
    });

    // Render the hook
    const { result } = renderHook(() => useUserData(), { wrapper });

    // Initially, it should be in loading state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.user).toBeUndefined();
    expect(result.current.isAuthenticated).toBe(false);

    // Now mock SWR to return loaded data
    swr.mockReturnValue({
      data: mockUser,
      error: undefined,
      isLoading: false,
      mutate: jest.fn()
    });

    // Re-render the hook
    const { result: updatedResult } = renderHook(() => useUserData(), { wrapper });

    // After loading, it should have data
    expect(updatedResult.current.user).toEqual(mockUser);
    expect(updatedResult.current.isAuthenticated).toBe(true);
    expect(updatedResult.current.isError).toBe(false);
  });

  it('should handle authentication errors correctly', async () => {
    // Setup a mock response that returns null for unauthenticated user
    const authError = new Error('Unauthorized') as Error & { status?: number };
    authError.status = 401;
    jest.spyOn(oAuthService, 'getCurrentUser').mockRejectedValue(authError);

    // Mock SWR to return null data (unauthenticated)
    const swr = require('swr').default;
    swr.mockReturnValue({
      data: null,
      error: undefined,
      isLoading: false,
      mutate: jest.fn()
    });

    // Render the hook
    const { result } = renderHook(() => useUserData(), { wrapper });

    // It should not be in error state, but user should be null
    expect(result.current.user).toBeNull();
    expect(result.current.isError).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle other errors correctly', async () => {
    // Setup a mock response that rejects with a non-auth error
    const error = new Error('Server error');
    jest.spyOn(oAuthService, 'getCurrentUser').mockRejectedValue(error);

    // Mock SWR to return error state
    const swr = require('swr').default;
    swr.mockReturnValue({
      data: undefined,
      error: error,
      isLoading: false,
      mutate: jest.fn()
    });

    // Render the hook
    const { result } = renderHook(() => useUserData(), { wrapper });

    // It should be in error state
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(error);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.user).toBeUndefined();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should allow manual refresh of data', async () => {
    // Setup a mock response
    jest.spyOn(oAuthService, 'getCurrentUser').mockResolvedValue(mockUser);

    // Mock SWR to return loaded data
    const swr = require('swr').default;
    const mutate = jest.fn().mockResolvedValue(mockUser);
    swr.mockReturnValue({
      data: mockUser,
      error: undefined,
      isLoading: false,
      mutate: mutate
    });

    // Render the hook
    const { result } = renderHook(() => useUserData(), { wrapper });

    // Clear the mock to track new calls
    jest.clearAllMocks();

    // Call the refresh function
    await act(async () => {
      await result.current.refreshUser();
    });

    // The mutate function should have been called
    expect(mutate).toHaveBeenCalled();
  });
});
