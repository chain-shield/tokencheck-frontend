import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/(auth)/login/page';
import { AuthContext } from '@/context/AuthContent';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

// Mock the dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn().mockReturnValue({
    get: jest.fn().mockImplementation((param) => null)
  }),
}));

jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn(),
}));

// Mock the subscription plans hook
const mockSubscribe = jest.fn().mockResolvedValue({ url: null });
jest.mock('@/hooks/use-subscription-plans', () => ({
  useSubscriptionPlans: () => ({
    subscribe: mockSubscribe,
    plans: [],
    isLoading: false,
    isError: false,
    isSubscribing: false,
    selectedPlan: null,
    refresh: jest.fn(),
  }),
}));

// Mock the AuthContext
const mockLogin = jest.fn();
const mockAuthContext = {
  user: null,
  loading: false,
  error: null,
  login: mockLogin,
  logout: jest.fn(),
  register: jest.fn(),
  refreshUser: jest.fn(),
};

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  const renderLoginPage = () => {
    return render(
      <AuthContext.Provider value={mockAuthContext}>
        <LoginPage />
      </AuthContext.Provider>
    );
  };

  it('renders the login form', () => {
    renderLoginPage();
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('disables the login button and shows loading overlay when form is submitted', async () => {
    renderLoginPage();

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    // Check that the button is disabled
    expect(submitButton).toBeDisabled();

    // Check that the loading overlay is shown
    expect(screen.getByText('Signing In...')).toBeInTheDocument();

    // Verify login was called with correct credentials
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('keeps loading state active during successful login and navigation', async () => {
    // Mock the router
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Mock successful login
    mockLogin.mockResolvedValue({ id: '1', email: 'test@example.com' });

    // Mock the search params to return null
    const mockGet = jest.fn().mockReturnValue(null);
    (useSearchParams as jest.Mock).mockReturnValue({
      get: mockGet
    });

    renderLoginPage();

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    const form = screen.getByRole('form');
    fireEvent.submit(form);

    // Wait for login to complete
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });

    // Check that toast was called with success message
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Login successful',
    }));

    // Wait for router.push to be called
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    }, { timeout: 3000 });

    // Button should still be disabled after successful login
    expect(submitButton).toBeDisabled();

    // Loading overlay should still be visible
    expect(screen.getByText('Signing In...')).toBeInTheDocument();
  });

  it('resets loading state and shows error toast on login failure', async () => {
    // Mock failed login
    const errorMessage = 'Invalid credentials';
    mockLogin.mockRejectedValueOnce(new Error(errorMessage));

    renderLoginPage();

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrong-password' },
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    // Wait for login to fail
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });

    // Check that toast was called with error message
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Login failed',
      variant: 'destructive',
    }));

    // Button should be enabled again after failed login
    expect(submitButton).not.toBeDisabled();

    // Loading overlay should not be visible
    expect(screen.queryByText('Signing In...')).not.toBeInTheDocument();
  });

  it('shows loading overlay when OAuth login is initiated', () => {
    // Mock window.location
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' } as Location;

    renderLoginPage();

    // Click the GitHub OAuth button
    const githubButton = screen.getByRole('button', { name: /continue with github/i });
    fireEvent.click(githubButton);

    // Check that all OAuth buttons are disabled
    expect(githubButton).toBeDisabled();
    expect(screen.getByRole('button', { name: /continue with google/i })).toBeDisabled();

    // Check that the loading overlay is shown for GitHub
    expect(screen.getByText('Connecting...')).toBeInTheDocument();

    // Restore window.location
    window.location = originalLocation;
  });
});
