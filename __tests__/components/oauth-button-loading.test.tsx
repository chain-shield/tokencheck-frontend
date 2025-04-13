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

// Mock window.location
const originalLocation = window.location;
delete window.location;
window.location = { href: '' } as Location;

describe('OAuth Button Loading Behavior', () => {
  // Create a simple component that mimics the OAuth button behavior
  const OAuthButton = ({ provider, onOAuth }: { provider: string, onOAuth: () => void }) => {
    const [isLoading, setIsLoading] = React.useState(false);

    const handleClick = () => {
      setIsLoading(true);
      
      // Add a small delay to ensure the loading state is visible
      setTimeout(() => {
        onOAuth();
      }, 100);
    };

    return (
      <div className="relative w-full" style={{ minHeight: '40px' }}>
        <Button 
          className="w-full relative" 
          disabled={isLoading}
          onClick={handleClick}
        >
          Continue with {provider}
        </Button>
        {isLoading && (
          <ButtonLoadingOverlay isLoading={true} text="Connecting..." />
        )}
      </div>
    );
  };

  afterAll(() => {
    window.location = originalLocation;
  });

  it('shows loading overlay when OAuth button is clicked', async () => {
    // Create a mock OAuth function
    const mockOAuth = jest.fn().mockImplementation(() => {
      window.location.href = 'https://example.com/oauth/github';
    });

    render(<OAuthButton provider="GitHub" onOAuth={mockOAuth} />);
    
    // Button should be enabled initially
    const button = screen.getByRole('button', { name: /continue with github/i });
    expect(button).not.toBeDisabled();
    
    // Click the button
    fireEvent.click(button);
    
    // Button should be disabled after click
    expect(button).toBeDisabled();
    
    // Loading overlay should be visible
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // Wait for the OAuth function to be called
    await waitFor(() => {
      expect(mockOAuth).toHaveBeenCalled();
    });
    
    // Check that window.location.href was set correctly
    expect(window.location.href).toBe('https://example.com/oauth/github');
    
    // Button should still be disabled
    expect(button).toBeDisabled();
    
    // Loading overlay should still be visible
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
  });

  it('disables all OAuth buttons when one is clicked', async () => {
    // Create a component with multiple OAuth buttons
    const MultipleOAuthButtons = () => {
      const [loadingProvider, setLoadingProvider] = React.useState<string | null>(null);
      
      const handleOAuth = (provider: string) => {
        setLoadingProvider(provider);
        
        // Add a small delay to ensure the loading state is visible
        setTimeout(() => {
          window.location.href = `https://example.com/oauth/${provider.toLowerCase()}`;
        }, 100);
      };
      
      return (
        <div>
          <div className="relative w-full" style={{ minHeight: '40px' }}>
            <Button 
              className="w-full relative" 
              disabled={loadingProvider !== null}
              onClick={() => handleOAuth('GitHub')}
            >
              Continue with GitHub
            </Button>
            {loadingProvider === 'GitHub' && (
              <ButtonLoadingOverlay isLoading={true} text="Connecting..." />
            )}
          </div>
          
          <div className="relative w-full" style={{ minHeight: '40px' }}>
            <Button 
              className="w-full relative" 
              disabled={loadingProvider !== null}
              onClick={() => handleOAuth('Google')}
            >
              Continue with Google
            </Button>
            {loadingProvider === 'Google' && (
              <ButtonLoadingOverlay isLoading={true} text="Connecting..." />
            )}
          </div>
        </div>
      );
    };
    
    render(<MultipleOAuthButtons />);
    
    // Both buttons should be enabled initially
    const githubButton = screen.getByRole('button', { name: /continue with github/i });
    const googleButton = screen.getByRole('button', { name: /continue with google/i });
    expect(githubButton).not.toBeDisabled();
    expect(googleButton).not.toBeDisabled();
    
    // Click the GitHub button
    fireEvent.click(githubButton);
    
    // Both buttons should be disabled
    expect(githubButton).toBeDisabled();
    expect(googleButton).toBeDisabled();
    
    // Only GitHub button should show loading overlay
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
    
    // Wait for the redirect
    await waitFor(() => {
      expect(window.location.href).toBe('https://example.com/oauth/github');
    });
  });
});
