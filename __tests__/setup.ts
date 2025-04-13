// Add necessary test setup here
import '@testing-library/jest-dom';

// Mock the Spinner component to have a role="status" for easier testing
jest.mock('@/components/ui/spinner', () => ({
  Spinner: ({ size, className, centered }: { size?: string, className?: string, centered?: boolean }) => (
    <div role="status" className={`spinner ${className || ''} ${size || ''} ${centered ? 'centered' : ''}`}>
      Loading spinner
    </div>
  ),
}));

// Mock the next/link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode, href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock the lucide-react icons
jest.mock('lucide-react', () => ({
  Github: () => <span data-testid="github-icon">GitHub Icon</span>,
  Shield: () => <span data-testid="shield-icon">Shield Icon</span>,
  // Add other icons as needed
}));

// Mock the SWR hooks
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    data: null,
    error: null,
    isLoading: false,
    isValidating: false,
    mutate: jest.fn(),
  })),
}));

// Set up global mocks for window.location
Object.defineProperty(window, 'location', {
  writable: true,
  value: { href: 'http://localhost:3000' },
});

// Suppress console errors during tests
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render') ||
      args[0].includes('Warning: React.createElement') ||
      args[0].includes('Warning: An update to'))
  ) {
    return;
  }
  originalConsoleError(...args);
};
