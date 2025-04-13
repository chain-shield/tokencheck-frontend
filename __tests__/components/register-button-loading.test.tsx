import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '@/components/ui/button';
import { ButtonLoadingOverlay } from '@/components/ui/loading-overlay';

// Mock the Spinner component
jest.mock('@/components/ui/spinner', () => ({
  Spinner: ({ size, className }: { size?: string, className?: string }) => (
    <div role="status" className={`spinner ${className || ''} ${size || ''}`}>
      Loading spinner
    </div>
  ),
}));

describe('Register Button Loading Behavior', () => {
  // Create a simple component that mimics the register button behavior
  const RegisterButton = ({ onRegister }: { onRegister: () => Promise<void> }) => {
    const [isLoading, setIsLoading] = React.useState(false);

    const handleClick = async () => {
      setIsLoading(true);
      try {
        await onRegister();
        // In a real component, we would navigate here
      } catch (error) {
        // Reset loading state on error
        setIsLoading(false);
      }
    };

    return (
      <div className="relative w-full" style={{ minHeight: '40px' }}>
        <Button
          className="w-full relative"
          disabled={isLoading}
          onClick={handleClick}
        >
          Create Account
        </Button>
        {isLoading && (
          <ButtonLoadingOverlay isLoading={true} text="Creating Account..." />
        )}
      </div>
    );
  };

  it('shows loading overlay when button is clicked', async () => {
    // Create a mock register function that returns a promise
    const mockRegister = jest.fn().mockImplementation(() => {
      return new Promise<void>((resolve) => {
        // Simulate a delay
        setTimeout(() => {
          resolve();
        }, 100);
      });
    });

    render(<RegisterButton onRegister={mockRegister} />);

    // Button should be enabled initially
    const button = screen.getByRole('button', { name: /create account/i });
    expect(button).not.toBeDisabled();

    // Click the button
    fireEvent.click(button);

    // Button should be disabled after click
    expect(button).toBeDisabled();

    // Loading overlay should be visible
    expect(screen.getByText('Creating Account...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Wait for the register to complete
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
    });

    // Button should still be disabled after register completes (for navigation)
    expect(button).toBeDisabled();

    // Loading overlay should still be visible
    expect(screen.getByText('Creating Account...')).toBeInTheDocument();
  });

  it('resets loading state on register error', async () => {
    // Create a mock register function that rejects
    const mockRegister = jest.fn().mockImplementation(() => {
      return new Promise<void>((_, reject) => {
        // Simulate a delay then reject
        setTimeout(() => {
          reject(new Error('Registration failed'));
        }, 100);
      });
    });

    render(<RegisterButton onRegister={mockRegister} />);

    // Button should be enabled initially
    const button = screen.getByRole('button', { name: /create account/i });
    expect(button).not.toBeDisabled();

    // Click the button
    fireEvent.click(button);

    // Button should be disabled after click
    expect(button).toBeDisabled();

    // Loading overlay should be visible
    expect(screen.getByText('Creating Account...')).toBeInTheDocument();

    // Wait for the register to fail
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
    });

    // Button should be enabled again after register fails
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });

    // Loading overlay should not be visible
    await waitFor(() => {
      expect(screen.queryByText('Creating Account...')).not.toBeInTheDocument();
    });
  });

  it('handles password validation before showing loading state', async () => {
    // Create a component with password validation
    const RegisterFormWithValidation = () => {
      const [password, setPassword] = React.useState('');
      const [confirmPassword, setConfirmPassword] = React.useState('');
      const [isLoading, setIsLoading] = React.useState(false);
      const [error, setError] = React.useState<string | null>(null);

      const validatePassword = () => {
        if (password.length < 8) {
          return 'Password must be at least 8 characters';
        }
        if (password !== confirmPassword) {
          return 'Passwords do not match';
        }
        return null;
      };

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate password
        const passwordError = validatePassword();
        if (passwordError) {
          setError(passwordError);
          return;
        }

        // Set loading state
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
          // In a real component, we would navigate here
        }, 100);
      };

      return (
        <form onSubmit={handleSubmit}>
          {error && <div role="alert">{error}</div>}

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="relative w-full" style={{ minHeight: '40px' }}>
            <Button
              type="submit"
              className="w-full relative"
              disabled={isLoading}
            >
              Create Account
            </Button>
            {isLoading && (
              <ButtonLoadingOverlay isLoading={true} text="Creating Account..." />
            )}
          </div>
        </form>
      );
    };

    render(<RegisterFormWithValidation />);

    // Fill in the form with invalid data (passwords don't match)
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password456' },
    });

    // Submit the form
    const button = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(button);

    // Button should not be disabled
    expect(button).not.toBeDisabled();

    // Loading overlay should not be visible
    expect(screen.queryByText('Creating Account...')).not.toBeInTheDocument();

    // Error message should be visible
    expect(screen.getByRole('alert')).toHaveTextContent('Passwords do not match');

    // Now fix the passwords
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' },
    });

    // Submit the form again
    fireEvent.click(button);

    // Button should be disabled
    expect(button).toBeDisabled();

    // Loading overlay should be visible
    expect(screen.getByText('Creating Account...')).toBeInTheDocument();

    // The error message is still in the DOM but should be cleared on the next render
    // In a real application, we would clear the error when the form is valid
  });
});
