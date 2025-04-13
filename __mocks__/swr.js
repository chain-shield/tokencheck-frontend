// Mock SWR
const useSWR = jest.fn(() => ({
  data: null,
  error: null,
  isLoading: false,
  isValidating: false,
  mutate: jest.fn(),
}));

// Mock SWRConfig component
const SWRConfig = ({ children }) => children;

// Export the mocks
module.exports = {
  __esModule: true,
  default: useSWR,
  useSWR,
  SWRConfig,
};
