// This file contains global mocks for Jest tests
// It should not be imported in the application code

// Mock functions
global.jest = {
  fn: () => ({
    mockImplementation: (fn) => fn,
    mockReturnValue: () => ({}),
  }),
};

// Mock window.matchMedia
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: global.jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: global.jest.fn(),
      removeListener: global.jest.fn(),
      addEventListener: global.jest.fn(),
      removeEventListener: global.jest.fn(),
      dispatchEvent: global.jest.fn(),
    })),
  });

  // Mock window.scrollTo
  Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: global.jest.fn(),
  });
}
