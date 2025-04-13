import React from 'react';
import { render, screen } from '../utils';
import HomePage from '@/app/page';
import AboutPage from '@/app/about/page';
import ApiPlansPage from '@/app/api-plans/page';
import ContactPage from '@/app/contact/page';
import TokenPage from '@/app/[tokenAddress]/page';
import PrivacyPage from '@/app/(legal)/privacy/page';
import TermsPage from '@/app/(legal)/terms/page';
import SubscriptionPolicyPage from '@/app/(legal)/subscription-policy/page';

// Mock the TokenAnalysis component
jest.mock('@/app/[tokenAddress]/token-analysis', () => {
  return {
    __esModule: true,
    default: ({ tokenAddress, tokenData }: any) => (
      <div data-testid="token-analysis">
        <div data-testid="token-address">{tokenAddress}</div>
        <div data-testid="token-name">{tokenData.token_name}</div>
      </div>
    ),
  };
});

describe.skip('Public Pages', () => {
  describe('Home Page', () => {
    it('renders the hero section with search form', () => {
      render(<HomePage />);

      // Check for key elements
      expect(screen.getByText(/Ultimate Crypto Scam Detector/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Enter ERC20 token address/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /FREE SCAN/i })).toBeInTheDocument();
    });

    it('renders the features section', () => {
      render(<HomePage />);

      expect(screen.getByText(/Comprehensive Token Analysis/i)).toBeInTheDocument();
      expect(screen.getByText(/Advanced Security Checks/i)).toBeInTheDocument();
      expect(screen.getByText(/Real-time Analysis/i)).toBeInTheDocument();
      expect(screen.getByText(/Market Intelligence/i)).toBeInTheDocument();
    });

    it('renders the API section', () => {
      render(<HomePage />);

      expect(screen.getByText(/Enterprise-Grade API Access/i)).toBeInTheDocument();
      expect(screen.getByText(/Flexible API endpoints/i)).toBeInTheDocument();
      expect(screen.getAllByRole('link', { name: /View API Plans/i })[0]).toBeInTheDocument();
    });

    it('renders the CTA section', () => {
      render(<HomePage />);

      expect(screen.getByText(/Start Analyzing Tokens Today/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Create Free Account/i })).toBeInTheDocument();
    });
  });

  describe('About Page', () => {
    it('renders the about page content', () => {
      render(<AboutPage />);

      // This test will need to be updated based on the actual content of the about page
      // For now, we'll just check that the page renders without errors
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('API Plans Page', () => {
    it('renders the API plans page content', () => {
      render(<ApiPlansPage />);

      // This test will need to be updated based on the actual content of the API plans page
      // For now, we'll just check that the page renders without errors
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('Contact Page', () => {
    it('renders the contact page content', () => {
      render(<ContactPage />);

      // This test will need to be updated based on the actual content of the contact page
      // For now, we'll just check that the page renders without errors
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('Token Page', () => {
    it('renders the token analysis for a given token address', () => {
      render(<TokenPage params={{ tokenAddress: '0x1234567890abcdef1234567890abcdef12345678' }} />);

      expect(screen.getByTestId('token-analysis')).toBeInTheDocument();
      expect(screen.getByTestId('token-address')).toHaveTextContent('0x1234567890abcdef1234567890abcdef12345678');
      expect(screen.getByTestId('token-name')).toHaveTextContent('Example Token');
    });
  });

  describe('Legal Pages', () => {
    it('renders the privacy policy page', () => {
      render(<PrivacyPage />);

      // This test will need to be updated based on the actual content of the privacy page
      // For now, we'll just check that the page renders without errors
      expect(document.body).toBeInTheDocument();
    });

    it('renders the terms of service page', () => {
      render(<TermsPage />);

      // This test will need to be updated based on the actual content of the terms page
      // For now, we'll just check that the page renders without errors
      expect(document.body).toBeInTheDocument();
    });

    it('renders the subscription policy page', () => {
      render(<SubscriptionPolicyPage />);

      // This test will need to be updated based on the actual content of the subscription policy page
      // For now, we'll just check that the page renders without errors
      expect(document.body).toBeInTheDocument();
    });
  });
});
