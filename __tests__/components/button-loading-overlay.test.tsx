import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ButtonLoadingOverlay } from '@/components/ui/loading-overlay';

// Mock the Spinner component
jest.mock('@/components/ui/spinner', () => ({
  Spinner: ({ size, className }: { size?: string, className?: string }) => (
    <div role="status" className={`spinner ${className || ''} ${size || ''}`}>
      Loading spinner
    </div>
  ),
}));

describe('ButtonLoadingOverlay', () => {
  it('renders nothing when isLoading is false', () => {
    render(<ButtonLoadingOverlay isLoading={false} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('renders a spinner when isLoading is true', () => {
    render(<ButtonLoadingOverlay isLoading={true} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders default text when no text is provided', () => {
    render(<ButtonLoadingOverlay isLoading={true} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders custom text when provided', () => {
    const text = 'Submitting...';
    render(<ButtonLoadingOverlay isLoading={true} text={text} />);
    expect(screen.getByText(text)).toBeInTheDocument();
  });
});
