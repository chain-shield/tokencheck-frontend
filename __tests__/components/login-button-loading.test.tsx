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

describe('Login Button Loading Behavior', () => {
  // Create a simple component that mimics the login button behavior
  const LoginButton = ({ onLogin }: { onLogin: () => Promise<void> }) => {
    const [isLoading, setIsLoading] = React.useState(false);

    const handleClick = async () => {
      setIsLoading(true);
      try {
        await onLogin();
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
          Sign In
        </Button>
        {isLoading && (
          <ButtonLoadingOverlay isLoading={true} text="Signing In..." />
        )}
      </div>
    );
  };

  it('shows loading overlay when button is clicked', async () => {
    // Create a mock login function that returns a promise
    const mockLogin = jest.fn().mockImplementation(() => {
      return new Promise<void>((resolve) => {
        // Simulate a delay
        setTimeout(() => {
          resolve();
        }, 100);
      });
    });

    render(<LoginButton onLogin={mockLogin} />);
    
    // Button should be enabled initially
    const button = screen.getByRole('button', { name: /sign in/i });
    expect(button).not.toBeDisabled();
    
    // Click the button
    fireEvent.click(button);
    
    // Button should be disabled after click
    expect(button).toBeDisabled();
    
    // Loading overlay should be visible
    expect(screen.getByText('Signing In...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // Wait for the login to complete
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
    
    // Button should still be disabled after login completes (for navigation)
    expect(button).toBeDisabled();
    
    // Loading overlay should still be visible
    expect(screen.getByText('Signing In...')).toBeInTheDocument();
  });

  it('resets loading state on login error', async () => {
    // Create a mock login function that rejects
    const mockLogin = jest.fn().mockImplementation(() => {
      return new Promise<void>((_, reject) => {
        // Simulate a delay then reject
        setTimeout(() => {
          reject(new Error('Login failed'));
        }, 100);
      });
    });

    render(<LoginButton onLogin={mockLogin} />);
    
    // Button should be enabled initially
    const button = screen.getByRole('button', { name: /sign in/i });
    expect(button).not.toBeDisabled();
    
    // Click the button
    fireEvent.click(button);
    
    // Button should be disabled after click
    expect(button).toBeDisabled();
    
    // Loading overlay should be visible
    expect(screen.getByText('Signing In...')).toBeInTheDocument();
    
    // Wait for the login to fail
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
    
    // Button should be enabled again after login fails
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
    
    // Loading overlay should not be visible
    await waitFor(() => {
      expect(screen.queryByText('Signing In...')).not.toBeInTheDocument();
    });
  });
});
