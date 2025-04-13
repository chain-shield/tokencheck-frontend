/**
 * Mock implementation of the useUserData hook for testing
 */

// Mock user data
export const mockUserData = {
  id: '123',
  email: 'test@example.com',
  name: 'Test User',
  createdAt: '2023-01-01T00:00:00Z',
};

// Store for mock state
const mockState = {
  userData: null,
  error: null,
  isLoading: false,
  isError: false,
};

// Reset the mock state
export const resetMock = () => {
  mockState.userData = null;
  mockState.error = null;
  mockState.isLoading = false;
  mockState.isError = false;
};

// Set authenticated state
export const setAuthenticated = (userData = mockUserData) => {
  mockState.userData = userData;
  mockState.error = null;
  mockState.isLoading = false;
  mockState.isError = false;
};

// Set unauthenticated state
export const setUnauthenticated = () => {
  mockState.userData = null;
  mockState.error = null;
  mockState.isLoading = false;
  mockState.isError = false;
};

// Set loading state
export const setLoading = () => {
  mockState.userData = null;
  mockState.error = null;
  mockState.isLoading = true;
  mockState.isError = false;
};

// Set error state
export const setError = (error: Error) => {
  mockState.userData = null;
  mockState.error = error;
  mockState.isLoading = false;
  mockState.isError = true;
};

// Mock hook implementation
export function useUserData() {
  return {
    userData: mockState.userData,
    error: mockState.error,
    isLoading: mockState.isLoading,
    isError: mockState.isError,
    mutate: jest.fn(),
    refreshUser: jest.fn().mockResolvedValue(undefined),
    login: jest.fn().mockImplementation(() => {
      setAuthenticated();
      return Promise.resolve(mockUserData);
    }),
    logout: jest.fn().mockImplementation(() => {
      setUnauthenticated();
      return Promise.resolve();
    }),
    register: jest.fn().mockImplementation(() => {
      setAuthenticated();
      return Promise.resolve(mockUserData);
    }),
  };
}

// Export mock utilities
export const userDataMock = {
  resetMock,
  setAuthenticated,
  setUnauthenticated,
  setLoading,
  setError,
  mockState,
};
