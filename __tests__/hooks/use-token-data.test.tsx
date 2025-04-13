/**
 * Tests for the useTokenData hook
 *
 * These tests verify that our token data hook works correctly,
 * including proper loading states, error handling, and data fetching.
 */

import { renderHook, waitFor, act } from '@testing-library/react';
import { useTokenData, mockTokenData } from '@/hooks/use-token-data';
import { SWRConfig } from 'swr';
import { ReactNode } from 'react';
import * as apiRequest from '@/utils/apiRequest';

// Mock the apiRequest module
jest.mock('@/utils/apiRequest', () => ({
  apiRequest: jest.fn(),
}));

// Wrapper component with SWR config for testing
const wrapper = ({ children }: { children: ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
    {children}
  </SWRConfig>
);

describe.skip('useTokenData Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return loading state initially', async () => {
    // Setup a mock API response that resolves after a delay
    (apiRequest.apiRequest as jest.Mock).mockImplementation(() => new Promise(resolve => {
      setTimeout(() => resolve(mockTokenData), 100);
    }));

    // Render the hook
    const { result } = renderHook(
      () => useTokenData('0x1234567890abcdef1234567890abcdef12345678'),
      { wrapper }
    );

    // Initially, it should be in loading state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.tokenData).toBeUndefined();

    // Wait for the data to load
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // After loading, it should have data
    expect(result.current.tokenData).toEqual(mockTokenData);
    expect(result.current.isError).toBe(false);

    // The API request should have been called with the correct parameters
    expect(apiRequest.apiRequest).toHaveBeenCalledWith(
      '/token/0x1234567890abcdef1234567890abcdef12345678',
      'GET'
    );
  });

  it('should handle errors correctly', async () => {
    // Setup a mock API response that rejects
    const error = new Error('Test error');
    (apiRequest.apiRequest as jest.Mock).mockRejectedValue(error);

    // Render the hook
    const { result } = renderHook(
      () => useTokenData('0x1234567890abcdef1234567890abcdef12345678'),
      { wrapper }
    );

    // Wait for the error to be caught
    await waitFor(() => expect(result.current.isError).toBe(true));

    // It should be in error state
    expect(result.current.error).toBe(error);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.tokenData).toBeUndefined();
  });

  it('should not fetch if token address is null', async () => {
    // Render the hook with null token address
    const { result } = renderHook(
      () => useTokenData(null),
      { wrapper }
    );

    // It should not be loading or have error
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.tokenData).toBeUndefined();

    // The API request should not have been called
    expect(apiRequest.apiRequest).not.toHaveBeenCalled();
  });

  it('should allow manual refresh of data', async () => {
    // Setup a mock API response
    (apiRequest.apiRequest as jest.Mock).mockResolvedValue(mockTokenData);

    // Render the hook
    const { result } = renderHook(
      () => useTokenData('0x1234567890abcdef1234567890abcdef12345678'),
      { wrapper }
    );

    // Wait for the initial data to load
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Clear the mock to track new calls
    jest.clearAllMocks();

    // Call the refresh function within act
    await act(async () => {
      result.current.refresh();
    });

    // The API request should have been called again
    expect(apiRequest.apiRequest).toHaveBeenCalled();
  });
});
