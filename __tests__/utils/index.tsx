import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
// Mock ThemeProvider instead of importing the real one
const ThemeProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
import { AuthProvider } from '@/context/AuthContent';
import { mockUser } from '@/utils/__mocks__/authService';
// Create a mock SWRConfig component
const SWRConfig = ({ children, value }: { children: React.ReactNode, value: any }) => <>{children}</>;
import { mockTokenData } from '@/hooks/use-token-data';

// Mock API keys for testing
const mockApiKeys = [
  { id: '1', name: 'Test API Key 1', key: 'key1', created_at: '2023-01-01T00:00:00Z' },
  { id: '2', name: 'Test API Key 2', key: 'key2', created_at: '2023-01-02T00:00:00Z' },
];

// Import the module but not the specific variable
import * as oAuthServiceMocks from '@/utils/__mocks__/oAuthService';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      pathname: '/',
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock Next.js image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

// Mock Next.js link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));

// Interface for custom render options
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  isAuthenticated?: boolean;
}

/**
 * Custom render function that wraps components with necessary providers
 *
 * @param ui - The React component to render
 * @param options - Custom render options including authentication state
 * @returns The rendered component with testing utilities
 */
function customRender(
  ui: ReactElement,
  { isAuthenticated = false, ...renderOptions }: CustomRenderOptions = {}
) {
  // Set mock authentication state
  oAuthServiceMocks.setMockIsAuthenticated(isAuthenticated);

  // Create wrapper with all providers
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <SWRConfig value={{
        provider: () => new Map(), dedupingInterval: 0, fallback: {
          'token-data-0x1234567890abcdef1234567890abcdef12345678': mockTokenData,
          'api-keys': mockApiKeys
        }
      }}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
      </SWRConfig>
    );
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Export mock user for tests
export { mockUser };
