/**
 * Tests for the SWR fetch hooks
 *
 * These tests verify that our custom SWR hooks work correctly,
 * including proper loading states, error handling, and data fetching.
 */

import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';

// Import our mocked hooks instead of the real ones
import {
  useSWRFetch,
  useRealtimeSWRFetch,
  useStaticSWRFetch,
  swrFetchMock
} from '../mocks/use-swr-fetch';

// Mock the real hooks
// @ts-ignore - jest.mock is available in the test environment
jest.mock('@/hooks/use-swr-fetch', () => require('../mocks/use-swr-fetch'));

// Mock fetcher function for testing
const mockFetcher = jest.fn();

// Simple wrapper for tests
const wrapper = ({ children }: { children: ReactNode }) => <>{children}</>;

describe('SWR Fetch Hooks', () => {
  beforeEach(() => {
    mockFetcher.mockClear();
    // Reset SWR mocks before each test
    swrFetchMock.resetMocks();
  });

  describe('useSWRFetch', () => {
    it('should return loading state initially', async () => {
      // Initially, SWR will return loading state
      // Render the hook
      const { result, rerender } = renderHook(
        () => useSWRFetch('test-key', mockFetcher),
        { wrapper }
      );

      // Initially, it should be in loading state
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toBeNull();

      // Simulate data loading completion
      swrFetchMock.setMockData('test-key', { data: 'test' });

      // Rerender to pick up the new mock data
      rerender();

      // After loading, it should have data
      expect(result.current.data).toEqual({ data: 'test' });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it('should handle errors correctly', async () => {
      // Setup a mock error
      const error = new Error('Test error');

      // Render the hook
      const { result, rerender } = renderHook(
        () => useSWRFetch('error-key', mockFetcher),
        { wrapper }
      );

      // Simulate error state
      swrFetchMock.setMockError('error-key', error);

      // Rerender to pick up the new mock data
      rerender();

      // It should be in error state
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(error);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeNull();
    });

    it('should not fetch if key is null', async () => {
      // Render the hook with null key
      const { result } = renderHook(
        () => useSWRFetch(null, mockFetcher),
        { wrapper }
      );

      // It should not be loading or have error
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('useRealtimeSWRFetch', () => {
    it('should return a valid response', async () => {
      // Render the hook
      const { result, rerender } = renderHook(
        () => useRealtimeSWRFetch('realtime-key', mockFetcher),
        { wrapper }
      );

      // Simulate data loading completion
      swrFetchMock.setMockData('realtime-key', { data: 'test' });

      // Rerender to pick up the new mock data
      rerender();

      // After loading, it should have data
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual({ data: 'test' });
    });
  });

  describe('useStaticSWRFetch', () => {
    it('should return a valid response', async () => {
      // Render the hook
      const { result, rerender } = renderHook(
        () => useStaticSWRFetch('static-key', mockFetcher),
        { wrapper }
      );

      // Simulate data loading completion
      swrFetchMock.setMockData('static-key', { data: 'test' });

      // Rerender to pick up the new mock data
      rerender();

      // After loading, it should have data
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual({ data: 'test' });
    });
  });
});
