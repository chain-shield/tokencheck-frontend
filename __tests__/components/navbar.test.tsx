import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Navbar } from '@/components/navbar';
import { AuthContext } from '@/context/AuthContent';

// Mock the next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => '/',
}));

// Mock the Spinner component
jest.mock('@/components/ui/spinner', () => ({
  Spinner: ({ size, className }: { size?: string, className?: string }) => (
    <div role="status" className={`spinner ${className || ''} ${size || ''}`}>
      Loading...
    </div>
  ),
}));

// Mock the ModeToggle component
jest.mock('@/components/mode-toggle', () => ({
  ModeToggle: () => <div data-testid="mode-toggle">Mode Toggle</div>,
}));

// Mock the lucide-react icons
jest.mock('lucide-react', () => ({
  Activity: () => <div data-testid="activity-icon">Activity Icon</div>,
}));

describe('Navbar Component', () => {
  it('shows loading spinner when loading and user is undefined', () => {
    render(
      <AuthContext.Provider value={{
        user: undefined,
        loading: true,
        error: null,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        refreshUser: jest.fn(),
      }}>
        <Navbar />
      </AuthContext.Provider>
    );

    // Loading spinner should be visible
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Navigation links should not be visible
    expect(screen.queryByText('ChainShield.ai')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
  });

  it('shows unauthenticated navbar when user is null', () => {
    render(
      <AuthContext.Provider value={{
        user: null,
        loading: false,
        error: null,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        refreshUser: jest.fn(),
      }}>
        <Navbar />
      </AuthContext.Provider>
    );

    // Brand should be visible
    expect(screen.getByText('TokenCheck.ai')).toBeInTheDocument();

    // Unauthenticated links should be visible
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();

    // Authenticated links should not be visible
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('shows authenticated navbar when user is defined', () => {
    render(
      <AuthContext.Provider value={{
        user: { id: '1', email: 'test@example.com', username: 'testuser' },
        loading: false,
        error: null,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        refreshUser: jest.fn(),
      }}>
        <Navbar />
      </AuthContext.Provider>
    );

    // Brand should be visible
    expect(screen.getByText('TokenCheck.ai')).toBeInTheDocument();

    // Authenticated links should be visible
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();

    // Unauthenticated links should not be visible
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
  });

  it('does not show loading spinner when loading but user is authenticated', () => {
    render(
      <AuthContext.Provider value={{
        user: { id: '1', email: 'test@example.com', username: 'testuser' },
        loading: true,
        error: null,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        refreshUser: jest.fn(),
      }}>
        <Navbar />
      </AuthContext.Provider>
    );

    // Loading spinner should not be visible
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();

    // Authenticated navbar should be visible
    expect(screen.getByText('TokenCheck.ai')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('does not show loading spinner when loading but user is known to be unauthenticated', () => {
    render(
      <AuthContext.Provider value={{
        user: null,
        loading: true,
        error: null,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        refreshUser: jest.fn(),
      }}>
        <Navbar />
      </AuthContext.Provider>
    );

    // Loading spinner should not be visible
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();

    // Unauthenticated navbar should be visible
    expect(screen.getByText('TokenCheck.ai')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });
});
