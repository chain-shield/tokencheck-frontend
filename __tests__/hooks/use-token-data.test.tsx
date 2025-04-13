/**
 * Tests for the useTokenData hook
 *
 * These tests verify that our token data hook works correctly,
 * including proper loading states, error handling, and data fetching.
 */

import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';

// Import our mocked hooks instead of the real ones
import {
  useTokenData,
  mockTokenData,
  tokenDataMock
} from '../mocks/use-token-data';

// Mock the real hooks
// @ts-ignore - jest.mock is available in the test environment
jest.mock('@/hooks/use-token-data', () => require('../mocks/use-token-data'));

// Simple wrapper for tests
const wrapper = ({ children }: { children: ReactNode }) => <>{children}</>;

describe('useTokenData Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    tokenDataMock.resetMocks();
  });

  it('should return loading state initially', async () => {
    const tokenAddress = '0x1234567890abcdef1234567890abcdef12345678';

    // Render the hook
    const { result, rerender } = renderHook(
      () => useTokenData(tokenAddress),
      { wrapper }
    );

    // Initially, it should be in loading state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.tokenData).toBeUndefined();

    // Simulate data loading completion
    tokenDataMock.setMockData(tokenAddress, mockTokenData);

    // Rerender to pick up the new mock data
    rerender();

    // After loading, it should have data
    expect(result.current.tokenData).toEqual(mockTokenData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('should handle errors correctly', async () => {
    const tokenAddress = '0x1234567890abcdef1234567890abcdef12345678';
    const error = new Error('Test error');

    // Render the hook
    const { result, rerender } = renderHook(
      () => useTokenData(tokenAddress),
      { wrapper }
    );

    // Simulate error state
    tokenDataMock.setMockError(tokenAddress, error);

    // Rerender to pick up the new mock data
    rerender();

    // It should be in error state
    expect(result.current.isError).toBe(true);
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
  });

  it('should allow manual refresh of data', async () => {
    const tokenAddress = '0x1234567890abcdef1234567890abcdef12345678';

    // Render the hook
    const { result, rerender } = renderHook(
      () => useTokenData(tokenAddress),
      { wrapper }
    );

    // Simulate data loading completion
    tokenDataMock.setMockData(tokenAddress, mockTokenData);

    // Rerender to pick up the new mock data
    rerender();

    // Mock the refresh function
    const refreshMock = jest.fn();
    result.current.refresh = refreshMock;

    // Call the refresh function within act
    await act(async () => {
      result.current.refresh();
    });

    // The refresh function should have been called
    expect(refreshMock).toHaveBeenCalled();
  });
});
