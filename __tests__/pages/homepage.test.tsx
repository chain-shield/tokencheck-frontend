import React from 'react';
import { render, screen } from '../utils';
import HomePage from '@/app/page';

jest.mock('lucide-react', () => ({
  Shield: () => <div data-testid="shield-icon" />,
  Zap: () => <div data-testid="zap-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  Bot: () => <div data-testid="bot-icon" />,
  FileSearch: () => <div data-testid="file-search-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  TriangleAlert: () => <div data-testid="triangle-alert-icon" />,
}));

describe('Homepage redesign', () => {
  it('renders the redesigned hero and primary actions', () => {
    render(<HomePage />);

    expect(screen.getByText(/Before You Drop Another/i)).toBeInTheDocument();
    expect(screen.getByText(/Discovery Runs Booking Now/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Start Your Audit/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /See Pricing/i })).toBeInTheDocument();
  });

  it('renders the core marketing sections', () => {
    render(<HomePage />);

    expect(screen.getByText(/Hardened Security Services/i)).toBeInTheDocument();
    expect(screen.getByText(/WE FIND BUGS\./i)).toBeInTheDocument();
    expect(screen.getByText(/Protocol Protection Lifecycle/i)).toBeInTheDocument();
    expect(screen.getByText(/Fair & Transparent Pricing/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Request Security Quote/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Schedule a Consultation/i })).toBeInTheDocument();
  });
});