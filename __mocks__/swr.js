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
const setMockData = (key, data, options = {}) => {
  swrStore.set(key, {
    data,
    error: null,
    isLoading: false,
    isValidating: false,
    mutate: jest.fn().mockImplementation(async (newData) => {
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
const setMockError = (key, error) => {
  swrStore.set(key, {
    data: null,
    error,
    isLoading: false,
    isValidating: false,
    mutate: jest.fn(),
  });
};

// Mock useSWR hook
const useSWR = jest.fn((key, fetcher, options) => {
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
const SWRConfig = ({ children }) => children;

// Mock useSWRConfig hook
const useSWRConfig = jest.fn(() => ({
  refreshInterval: 0,
  provider: () => new Map(),
}));

// Export the mocks
module.exports = {
  __esModule: true,
  default: useSWR,
  useSWR,
  SWRConfig,
  useSWRConfig,
  // Export test helpers
  __swr__: {
    resetMocks,
    setMockData,
    setMockError,
    swrStore,
  },
};
