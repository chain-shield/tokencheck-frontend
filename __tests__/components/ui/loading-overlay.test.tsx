import React from 'react';
import { render, screen } from '@testing-library/react';
import { ButtonLoadingOverlay, LoadingOverlay } from '@/components/ui/loading-overlay';

describe('LoadingOverlay', () => {
  it('renders nothing when isLoading is false', () => {
    render(<LoadingOverlay isLoading={false} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('renders a spinner when isLoading is true', () => {
    render(<LoadingOverlay isLoading={true} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders text when provided', () => {
    const text = 'Loading data...';
    render(<LoadingOverlay isLoading={true} text={text} />);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    render(<LoadingOverlay isLoading={true} className="custom-class" />);
    const overlay = screen.getByRole('status').parentElement;
    expect(overlay).toHaveClass('custom-class');
  });
});

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

  it('has pointer-events style set to all', () => {
    render(<ButtonLoadingOverlay isLoading={true} />);
    const overlay = screen.getByRole('status').parentElement?.parentElement;
    expect(overlay).toHaveStyle({ pointerEvents: 'all' });
  });
});
