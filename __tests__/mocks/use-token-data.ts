/**
 * Mock implementation of the useTokenData hook for testing
 */

// Mock token data
export const mockTokenData = {
  address: '0x1234567890abcdef1234567890abcdef12345678',
  name: 'Test Token',
  symbol: 'TEST',
  decimals: 18,
  totalSupply: '1000000000000000000000000',
  holders: 100,
  transactions: 500,
  price: {
    usd: 1.23,
    eth: 0.0005,
    btc: 0.00004,
    change24h: 5.67,
  },
  marketCap: {
    usd: 1230000,
    eth: 500,
    btc: 40,
  },
  volume24h: {
    usd: 50000,
    eth: 20,
    btc: 1.5,
  },
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-06-01T00:00:00Z',
};

// Store for mock data
const mockStore = new Map<string, any>();

// Reset all mocks
export const resetMocks = () => {
  mockStore.clear();
};

// Set mock data for a specific token address
export const setMockData = (tokenAddress: string, data: any) => {
  mockStore.set(tokenAddress, {
    tokenData: data,
    error: null,
    isLoading: false,
    isError: false,
  });
};

// Set mock error for a specific token address
export const setMockError = (tokenAddress: string, error: Error) => {
  mockStore.set(tokenAddress, {
    tokenData: undefined,
    error,
    isLoading: false,
    isError: true,
  });
};

// Mock hook implementation
export function useTokenData(tokenAddress: string | null) {
  // If tokenAddress is null, return default state with loading false
  if (tokenAddress === null) {
    return {
      tokenData: undefined,
      error: undefined,
      isLoading: false,
      isError: false,
      refresh: jest.fn(),
    };
  }

  // Return mock data if it exists
  if (mockStore.has(tokenAddress)) {
    const mockData = mockStore.get(tokenAddress);
    return {
      ...mockData,
      refresh: jest.fn(),
    };
  }

  // Default to loading state
  return {
    tokenData: undefined,
    error: null,
    isLoading: true,
    isError: false,
    refresh: jest.fn(),
  };
}

// Export mock utilities
export const tokenDataMock = {
  resetMocks,
  setMockData,
  setMockError,
  mockStore,
};
