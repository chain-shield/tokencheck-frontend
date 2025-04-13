// Create a store to hold SWR state for different keys
const swrStore = new Map();

// Default state for any SWR hook
const defaultState = {
  data: null,
  error: null,
  isLoading: true,
  isValidating: true,
  mutate: jest.fn(),
};

// Reset the store between tests
const resetMocks = () => {
  swrStore.clear();
};

// Set mock data for a specific key
const setMockData = (key: string, data: any, options = {}) => {
  swrStore.set(key, {
    data,
    error: null,
    isLoading: false,
    isValidating: false,
    mutate: jest.fn().mockImplementation(async (newData: any) => {
      if (typeof newData === 'function') {
        const updatedData = newData(swrStore.get(key)?.data);
        swrStore.set(key, { ...swrStore.get(key), data: updatedData });
        return updatedData;
      }
      swrStore.set(key, { ...swrStore.get(key), data: newData });
      return newData;
    }),
    ...options,
  });
};

// Set mock error for a specific key
const setMockError = (key: string, error: Error) => {
  swrStore.set(key, {
    data: null,
    error,
    isLoading: false,
    isValidating: false,
    mutate: jest.fn(),
  });
};

// Export the test helpers
export const swrMock = {
  resetMocks,
  setMockData,
  setMockError,
  swrStore,
};

// Mock useSWR hook
export const useSWR = jest.fn((key: string | null, fetcher: any, options: any) => {
  // If key is null or undefined, return default state with loading false
  if (key === null || key === undefined) {
    return {
      data: undefined,
      error: undefined,
      isLoading: false,
      isValidating: false,
      mutate: jest.fn(),
    };
  }

  // Return the stored state for this key, or default state if not set
  return swrStore.get(key) || { ...defaultState, key };
});

// Mock SWRConfig component
export const SWRConfig = ({ children }: { children: React.ReactNode }) => children;

// Mock useSWRConfig hook
export const useSWRConfig = jest.fn(() => ({
  refreshInterval: 0,
  provider: () => new Map(),
}));

// Global mutate function
export const mutate = jest.fn().mockImplementation(async (key, data, options) => {
  if (data) {
    if (typeof data === 'function') {
      const currentData = swrStore.get(key)?.data;
      const newData = data(currentData);
      setMockData(key, newData);
      return newData;
    }
    setMockData(key, data);
    return data;
  }
  return swrStore.get(key)?.data;
});

// Default export
export default useSWR;
