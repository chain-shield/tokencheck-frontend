/**
 * Tests for the SWR fetch hooks
 *
 * These tests verify that our custom SWR hooks work correctly,
 * including proper loading states, error handling, and data fetching.
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useSWRFetch, useRealtimeSWRFetch, useStaticSWRFetch } from '@/hooks/use-swr-fetch';
import { SWRConfig } from 'swr';
import { ReactNode } from 'react';

// Mock fetcher function for testing
const mockFetcher = jest.fn();

// Wrapper component with SWR config for testing
const wrapper = ({ children }: { children: ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
    {children}
  </SWRConfig>
);

describe('SWR Fetch Hooks', () => {
  beforeEach(() => {
    mockFetcher.mockClear();
  });

  describe('useSWRFetch', () => {
    it('should return loading state initially', async () => {
      // Setup a mock fetcher that resolves after a delay
      mockFetcher.mockImplementation(() => new Promise(resolve => {
        setTimeout(() => resolve({ data: 'test' }), 100);
      }));

      // Render the hook
      const { result } = renderHook(
        () => useSWRFetch('test-key', mockFetcher),
        { wrapper }
      );

      // Initially, it should be in loading state
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toBeUndefined();

      // Wait for the data to load
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // After loading, it should have data
      expect(result.current.data).toEqual({ data: 'test' });
      expect(result.current.isError).toBe(false);
    });

    it('should handle errors correctly', async () => {
      // Setup a mock fetcher that rejects
      const error = new Error('Test error');
      mockFetcher.mockRejectedValue(error);

      // Render the hook
      const { result } = renderHook(
        () => useSWRFetch('test-key', mockFetcher),
        { wrapper }
      );

      // Wait for the error to be caught
      await waitFor(() => expect(result.current.isError).toBe(true));

      // It should be in error state
      expect(result.current.error).toBe(error);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
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

      // The fetcher should not have been called
      expect(mockFetcher).not.toHaveBeenCalled();
    });
  });

  describe('useRealtimeSWRFetch', () => {
    it('should return a valid response', async () => {
      // Setup a mock fetcher that resolves after a delay
      mockFetcher.mockImplementation(() => new Promise(resolve => {
        setTimeout(() => resolve({ data: 'test' }), 100);
      }));

      // Render the hook
      const { result } = renderHook(
        () => useRealtimeSWRFetch('test-key', mockFetcher),
        { wrapper }
      );

      // Wait for the data to load
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // After loading, it should have data
      expect(result.current.data).toEqual({ data: 'test' });
    });
  });

  describe('useStaticSWRFetch', () => {
    it('should return a valid response', async () => {
      // Setup a mock fetcher that resolves after a delay
      mockFetcher.mockImplementation(() => new Promise(resolve => {
        setTimeout(() => resolve({ data: 'test' }), 100);
      }));

      // Render the hook
      const { result } = renderHook(
        () => useStaticSWRFetch('test-key', mockFetcher),
        { wrapper }
      );

      // Wait for the data to load
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // After loading, it should have data
      expect(result.current.data).toEqual({ data: 'test' });
    });
  });
});
