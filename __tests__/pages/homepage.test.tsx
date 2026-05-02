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

    expect(screen.getByText(/Give Us Your Repo/i)).toBeInTheDocument();
    expect(screen.getByText(/48-Hour Discovery Runs Booking Now/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Book A 48-Hour Discovery Run/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /See How Pricing Works/i })).toBeInTheDocument();
  });

  it('renders the core marketing sections', () => {
    render(<HomePage />);

    expect(screen.getByText(/The Security Review Built For Teams That Ship Fast/i)).toBeInTheDocument();
    expect(screen.getByText(/Automated Does Not Mean Unverified/i)).toBeInTheDocument();
    expect(screen.getByText(/We do not sell AI guesses/i)).toBeInTheDocument();
    expect(screen.getByText(/Proof Beats Another Audit PDF/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Code4rena profile/i })).toHaveAttribute('href', 'https://code4rena.com/@saraswati');
    expect(screen.getByText(/From Repo To Runnable Proof/i)).toBeInTheDocument();
    expect(screen.getByText(/Fair & Transparent Pricing/i)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Submit Your Repo/i })).toHaveLength(2);
  });
});
