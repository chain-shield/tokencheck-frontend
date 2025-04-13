import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '@/app/(auth)/register/page';
import { AuthContext } from '@/context/AuthContent';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

// Mock the dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn(),
}));

// Mock the AuthContext
const mockRegister = jest.fn();
const mockAuthContext = {
  user: null,
  loading: false,
  error: null,
  login: jest.fn(),
  logout: jest.fn(),
  register: mockRegister,
  refreshUser: jest.fn(),
};

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  const renderRegisterPage = () => {
    return render(
      <AuthContext.Provider value={mockAuthContext}>
        <RegisterPage />
      </AuthContext.Provider>
    );
  };

  it('renders the registration form', () => {
    renderRegisterPage();
    expect(screen.getByText('Create Your Account')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('validates password requirements', async () => {
    renderRegisterPage();

    // Fill in the form with invalid password (too short)
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'short' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'short' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    // Check that toast was called with error message
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Invalid Password',
      variant: 'destructive',
    }));

    // Register should not have been called
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('validates password matching', async () => {
    renderRegisterPage();

    // Fill in the form with non-matching passwords
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'StrongPassword123!' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'DifferentPassword123!' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    // Check that toast was called with error message
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Password mismatch',
      variant: 'destructive',
    }));

    // Register should not have been called
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('disables the register button and shows loading overlay when form is submitted with valid data', async () => {
    renderRegisterPage();

    // Fill in the form with valid data
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'StrongPassword123!' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'StrongPassword123!' },
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);

    // Check that the button is disabled
    expect(submitButton).toBeDisabled();

    // Check that the loading overlay is shown
    expect(screen.getByText('Creating Account...')).toBeInTheDocument();

    // Verify register was called with correct credentials
    expect(mockRegister).toHaveBeenCalledWith('test@example.com', 'Test User', 'StrongPassword123!');
  });

  it('keeps loading state active during successful registration and navigation', async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Mock successful registration
    mockRegister.mockResolvedValueOnce({ id: '1', email: 'test@example.com' });

    renderRegisterPage();

    // Fill in the form with valid data
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'StrongPassword123!' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'StrongPassword123!' },
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);

    // Wait for registration to complete
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
    });

    // Check that toast was called with success message
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Account created',
    }));

    // Check that router.push was called to navigate to login
    expect(mockPush).toHaveBeenCalledWith('/login');

    // Button should still be disabled after successful registration
    expect(submitButton).toBeDisabled();

    // Loading overlay should still be visible
    expect(screen.getByText('Creating Account...')).toBeInTheDocument();
  });

  it('resets loading state and shows error toast on registration failure', async () => {
    // Mock failed registration
    const errorMessage = 'Email already in use';
    mockRegister.mockRejectedValueOnce(new Error(errorMessage));

    renderRegisterPage();

    // Fill in the form with valid data
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'StrongPassword123!' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'StrongPassword123!' },
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);

    // Wait for registration to fail
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
    });

    // Check that toast was called with error message
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Registration failed',
      variant: 'destructive',
    }));

    // Button should be enabled again after failed registration
    expect(submitButton).not.toBeDisabled();

    // Loading overlay should not be visible
    expect(screen.queryByText('Creating Account...')).not.toBeInTheDocument();
  });

  it('shows loading overlay when OAuth registration is initiated', () => {
    // Mock window.location
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' } as Location;

    renderRegisterPage();

    // Click the GitHub OAuth button
    const githubButton = screen.getByRole('button', { name: /sign up with github/i });
    fireEvent.click(githubButton);

    // Check that all OAuth buttons are disabled
    expect(githubButton).toBeDisabled();
    expect(screen.getByRole('button', { name: /sign up with google/i })).toBeDisabled();

    // Check that the loading overlay is shown for GitHub
    expect(screen.getByText('Connecting...')).toBeInTheDocument();

    // Restore window.location
    window.location = originalLocation;
  });
});
