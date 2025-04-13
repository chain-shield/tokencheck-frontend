/**
 * Mock implementation of the SWR fetch hooks for testing
 */

import { ExtendedSWRResponse } from '@/hooks/use-swr-fetch';

// Store for mock data
const mockStore = new Map<string, any>();

// Reset all mocks
export const resetMocks = () => {
  mockStore.clear();
};

// Set mock data for a specific key
export const setMockData = (key: string, data: any) => {
  mockStore.set(key, {
    data,
    error: null,
    isLoading: false,
    isError: false,
  });
};

// Set mock error for a specific key
export const setMockError = (key: string, error: Error) => {
  mockStore.set(key, {
    data: null,
    error,
    isLoading: false,
    isError: true,
  });
};

// Base mock hook
export function useSWRFetch<Data = any, Error = any>(
  key: string | null,
  fetcher: (key: string) => Promise<Data>
): ExtendedSWRResponse<Data, Error> {
  // If key is null, return default state with loading false
  if (key === null) {
    return {
      data: undefined as any,
      error: undefined as any,
      isLoading: false,
      isError: false,
      isValidating: false,
      mutate: jest.fn(),
    };
  }

  // Return mock data if it exists
  if (mockStore.has(key)) {
    const mockData = mockStore.get(key);
    return {
      data: mockData.data,
      error: mockData.error,
      isLoading: mockData.isLoading,
      isError: mockData.isError,
      isValidating: false,
      mutate: jest.fn(),
    };
  }

  // Default to loading state
  return {
    data: null as any,
    error: null as any,
    isLoading: true,
    isError: false,
    isValidating: true,
    mutate: jest.fn(),
  };
}

// Real-time mock hook
export function useRealtimeSWRFetch<Data = any, Error = any>(
  key: string | null,
  fetcher: (key: string) => Promise<Data>
): ExtendedSWRResponse<Data, Error> {
  return useSWRFetch(key, fetcher);
}

// Static mock hook
export function useStaticSWRFetch<Data = any, Error = any>(
  key: string | null,
  fetcher: (key: string) => Promise<Data>
): ExtendedSWRResponse<Data, Error> {
  return useSWRFetch(key, fetcher);
}

// Export mock utilities
export const swrFetchMock = {
  resetMocks,
  setMockData,
  setMockError,
  mockStore,
};
