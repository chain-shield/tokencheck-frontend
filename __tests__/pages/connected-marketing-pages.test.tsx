import React from 'react';

import { render, screen } from '../utils';
import AboutPage from '@/app/about/page';
import ContactPage from '@/app/contact/page';
import PrivacyPage from '@/app/(legal)/privacy/page';
import TermsPage from '@/app/(legal)/terms/page';

jest.mock('@/components/analytics/page-view-tracker', () => ({
  PageViewTracker: () => null,
}));

jest.mock('lucide-react', () => ({
  MessageCircle: () => <div data-testid="message-circle-icon" />,
}));

describe('Connected marketing pages', () => {
  it('renders the redesigned about page', () => {
    render(<AboutPage />);

    expect(screen.getByText(/Built for teams shipping under real adversarial pressure/i)).toBeInTheDocument();
    expect(screen.getByText(/Our mission/i)).toBeInTheDocument();
    expect(screen.getByText(/A process built for speed and signal/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Request Security Quote/i })).toBeInTheDocument();
  });

  it('renders the redesigned contact page', () => {
    render(<ContactPage />);

    expect(screen.getByText(/Talk to the ChainShield team/i)).toBeInTheDocument();
    expect(screen.getByText(/General Inquiries/i)).toBeInTheDocument();
    expect(screen.getByText(/Technical Support/i)).toBeInTheDocument();
    expect(screen.getByText(/Community channels/i)).toBeInTheDocument();
  });

  it('renders the redesigned privacy page', () => {
    render(<PrivacyPage />);

    expect(screen.getByRole('heading', { name: /Privacy policy/i })).toBeInTheDocument();
    expect(screen.getByText(/Last Updated: April 7, 2025/i)).toBeInTheDocument();
    expect(screen.getByText(/Introduction/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Contact Information/i })).toBeInTheDocument();
  });

  it('renders the redesigned terms page', () => {
    render(<TermsPage />);

    expect(screen.getByText(/ChainShield Platform Terms of Service/i)).toBeInTheDocument();
    expect(screen.getByText(/Last Updated:/i)).toBeInTheDocument();
    expect(screen.getByText(/1. Acceptance of Terms/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /16. Contact Information/i })).toBeInTheDocument();
  });
});
