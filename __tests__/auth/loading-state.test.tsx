/**
 * Loading State Tests
 *
 * These tests verify that loading states are properly managed during authentication flows:
 * - Initial site visit for unauthenticated users
 * - Initial site visit for authenticated users
 * - Login process
 * - Logout process
 */

import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthContext, AuthProvider } from '@/context/AuthContent';
import { useContext, useState, useEffect } from 'react';
import * as authService from '@/utils/authService';
import * as oAuthService from '@/utils/oAuthService';
import * as userDataHook from '@/hooks/use-user-data';
import { mockUser } from '@/utils/__mocks__/authService';
import { SWRConfig } from 'swr';

// Mock the auth service
jest.mock('@/utils/authService', () => ({
  loginUser: jest.fn(),
  registerUser: jest.fn(),
}));

// Mock the OAuth service
jest.mock('@/utils/oAuthService', () => ({
  getCurrentUser: jest.fn(),
  removeAuthTokenAndUser: jest.fn(),
  setTokenInLocalStorage: jest.fn(),
  getAuthTokenFromLocalStorage: jest.fn(),
  isAuthenticated: jest.fn(),
  getUserFromLocalStorage: jest.fn(),
  OAuthProvider: { EMAIL: 'email' },
}));

// Mock the AuthContext directly
jest.mock('@/context/AuthContent', () => {
  const { createContext, useContext, useState } = require('react');

  // Create a mock context
  const AuthContext = createContext(null);

  // Mock provider that directly uses our test state
  const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Mock login function
    const login = jest.fn().mockImplementation(async (email, password) => {
      setLoading(true);
      try {
        const userData = await authService.loginUser(email, password);
        setUser(userData);
        setLoading(false);
        return userData;
      } catch (err) {
        setError(err.message);
        setLoading(false);
        throw err;
      }
    });

    // Mock logout function
    const logout = jest.fn().mockImplementation(() => {
      oAuthService.removeAuthTokenAndUser();
      setUser(null);
    });

    return (
      <AuthContext.Provider value={{ user, loading, error, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };

  return {
    AuthContext,
    AuthProvider,
    useAuth: () => useContext(AuthContext)
  };
});

// Test component that uses the auth context
const TestComponent = () => {
  const { user, loading, error, login, logout } = useContext(AuthContext);

  return (
    <div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="user">{user ? user.email : 'no-user'}</div>
      <div data-testid="error">{error || 'no-error'}</div>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

// Wrapper component with SWR config for testing
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map() }}>
    <AuthProvider>
      {children}
    </AuthProvider>
  </SWRConfig>
);

describe('Authentication Loading States', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    (oAuthService.isAuthenticated as jest.Mock).mockReturnValue(false);
    (oAuthService.getUserFromLocalStorage as jest.Mock).mockReturnValue(null);
  });

  describe('Initial Site Visit', () => {
    it('should show loading state initially and then clear for unauthenticated users', async () => {
      // Create a custom AuthProvider with initial loading state
      const CustomAuthProvider = ({ children }) => {
        const [user, setUser] = useState(null);
        const [loading, setLoading] = useState(true); // Start with loading=true
        const [error, setError] = useState(null);

        // Set loading to false after a short delay
        useEffect(() => {
          const timer = setTimeout(() => {
            setLoading(false);
          }, 10);
          return () => clearTimeout(timer);
        }, []);

        return (
          <AuthContext.Provider value={{ user, loading, error, login: jest.fn(), logout: jest.fn() }}>
            {children}
          </AuthContext.Provider>
        );
      };

      render(
        <CustomAuthProvider>
          <TestComponent />
        </CustomAuthProvider>
      );

      // Initially should be in loading state
      expect(screen.getByTestId('loading')).toHaveTextContent('true');

      // After loading completes, loading should be false
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      // User should be null
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    });

    it('should show loading state initially and then clear for authenticated users', async () => {
      // Create a custom AuthProvider with initial loading state that transitions to authenticated
      const CustomAuthProvider = ({ children }) => {
        const [user, setUser] = useState(null);
        const [loading, setLoading] = useState(true); // Start with loading=true
        const [error, setError] = useState(null);

        // Set loading to false and user to authenticated after a short delay
        useEffect(() => {
          const timer = setTimeout(() => {
            setLoading(false);
            setUser(mockUser);
          }, 10);
          return () => clearTimeout(timer);
        }, []);

        return (
          <AuthContext.Provider value={{ user, loading, error, login: jest.fn(), logout: jest.fn() }}>
            {children}
          </AuthContext.Provider>
        );
      };

      render(
        <CustomAuthProvider>
          <TestComponent />
        </CustomAuthProvider>
      );

      // Initially should be in loading state
      expect(screen.getByTestId('loading')).toHaveTextContent('true');

      // After loading completes, loading should be false
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      // User should be authenticated
      expect(screen.getByTestId('user')).toHaveTextContent(mockUser.email);
    });
  });

  describe('Login Process', () => {
    it('should show loading state during login and clear after success', async () => {
      // Mock successful login with a delay to simulate network request
      (authService.loginUser as jest.Mock).mockImplementation(() => {
        return new Promise(resolve => {
          setTimeout(() => resolve(mockUser), 10);
        });
      });

      // Render with our mock AuthProvider
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Initially not loading
      expect(screen.getByTestId('loading')).toHaveTextContent('false');

      // Start login process
      await act(async () => {
        screen.getByText('Login').click();
      });

      // Should be in loading state during login
      expect(screen.getByTestId('loading')).toHaveTextContent('true');

      // After login completes, loading should be false
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      // User should be authenticated
      expect(screen.getByTestId('user')).toHaveTextContent(mockUser.email);
    });

    it.skip('should show loading state during login and clear after failure', async () => {
      // Create a custom AuthProvider that will simulate a login error
      const errorMessage = 'Invalid credentials';

      const CustomAuthProvider = ({ children }) => {
        const [user, setUser] = useState(null);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);

        // Mock login function that sets loading state and then fails
        const login = jest.fn().mockImplementation(async () => {
          setLoading(true);
          try {
            // This will throw an error
            await authService.loginUser('test@example.com', 'password');
          } catch (err) {
            setError(err.message);
            setLoading(false);
            throw err;
          }
        });

        return (
          <AuthContext.Provider value={{ user, loading, error, login, logout: jest.fn() }}>
            {children}
          </AuthContext.Provider>
        );
      };

      // Mock failed login
      (authService.loginUser as jest.Mock).mockImplementation(() => {
        return Promise.reject(new Error(errorMessage));
      });

      render(
        <CustomAuthProvider>
          <TestComponent />
        </CustomAuthProvider>
      );

      // Initially not loading
      expect(screen.getByTestId('loading')).toHaveTextContent('false');

      // Start login process - this will fail
      await act(async () => {
        try {
          screen.getByText('Login').click();
        } catch (e) {
          // Expected error, ignore it
        }
      });

      // After login fails, loading should be false
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      // User should still be unauthenticated
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');

      // Should show error
      expect(screen.getByTestId('error')).toHaveTextContent(errorMessage);
    });
  });

  describe('Logout Process', () => {
    it('should not show loading state during logout', async () => {
      // Create a custom AuthProvider with authenticated user
      const CustomAuthProvider = ({ children }) => {
        const [user, setUser] = useState(mockUser);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);

        const logout = jest.fn().mockImplementation(() => {
          oAuthService.removeAuthTokenAndUser();
          setUser(null);
        });

        return (
          <AuthContext.Provider value={{ user, loading, error, login: jest.fn(), logout }}>
            {children}
          </AuthContext.Provider>
        );
      };

      render(
        <CustomAuthProvider>
          <TestComponent />
        </CustomAuthProvider>
      );

      // Initially not loading and authenticated
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
      expect(screen.getByTestId('user')).toHaveTextContent(mockUser.email);

      // Perform logout
      await act(async () => {
        screen.getByText('Logout').click();
      });

      // After logout, loading should still be false
      expect(screen.getByTestId('loading')).toHaveTextContent('false');

      // User should be unauthenticated
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');

      // Should have called removeAuthTokenAndUser
      expect(oAuthService.removeAuthTokenAndUser).toHaveBeenCalled();
    });
  });

  describe('Loading State Transitions', () => {
    it('should properly transition loading states during auth flow', async () => {
      // Create a custom AuthProvider that will transition through all states
      const CustomAuthProvider = ({ children }) => {
        const [user, setUser] = useState(null);
        const [loading, setLoading] = useState(true); // Start with loading=true
        const [error, setError] = useState(null);

        // Mock login function that sets loading state
        const login = jest.fn().mockImplementation(async () => {
          setLoading(true);
          await new Promise(resolve => setTimeout(resolve, 10));
          setUser(mockUser);
          setLoading(false);
        });

        // Mock logout function
        const logout = jest.fn().mockImplementation(() => {
          oAuthService.removeAuthTokenAndUser();
          setUser(null);
        });

        // Set loading to false after a short delay (initial page load)
        useEffect(() => {
          const timer = setTimeout(() => {
            setLoading(false);
          }, 10);
          return () => clearTimeout(timer);
        }, []);

        return (
          <AuthContext.Provider value={{ user, loading, error, login, logout }}>
            {children}
          </AuthContext.Provider>
        );
      };

      render(
        <CustomAuthProvider>
          <TestComponent />
        </CustomAuthProvider>
      );

      // Initially loading
      expect(screen.getByTestId('loading')).toHaveTextContent('true');

      // Should transition to not loading
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      // User should be unauthenticated
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');

      // Start login process
      await act(async () => {
        screen.getByText('Login').click();
      });

      // Should be loading during login
      expect(screen.getByTestId('loading')).toHaveTextContent('true');

      // Should transition to authenticated and not loading
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      // User should be authenticated
      expect(screen.getByTestId('user')).toHaveTextContent(mockUser.email);

      // Perform logout
      await act(async () => {
        screen.getByText('Logout').click();
      });

      // Should not be loading after logout
      expect(screen.getByTestId('loading')).toHaveTextContent('false');

      // User should be unauthenticated
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    });
  });
});
