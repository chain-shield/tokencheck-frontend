import React from 'react';
import { render, screen } from '../utils';
import LoginPage from '@/app/(auth)/login/page';
import RegisterPage from '@/app/(auth)/register/page';
import ForgotPasswordPage from '@/app/(auth)/forgot-password/page';

// Mock the useRouter hook
const mockRouter = { push: jest.fn() };
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => mockRouter
}));

describe('Authentication Pages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRouter.push.mockClear();
  });

  describe('Login Page', () => {
    it('renders the login form', () => {
      render(<LoginPage />);

      // Check for key elements
      expect(screen.getByRole('heading', { name: /Welcome Back/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();

      // Find the sign in button - there might be multiple buttons with "Sign In" text
      const signInButtons = screen.getAllByRole('button');
      const mainSignInButton = signInButtons.find(button =>
        button.textContent === 'Sign In' ||
        button.textContent?.includes('Sign In')
      );
      expect(mainSignInButton).toBeInTheDocument();

      // Check for the sign up link
      expect(screen.getByText(/Don't have an account/i)).toBeInTheDocument();
      const signUpLink = screen.getAllByRole('link').find(link =>
        link.textContent === 'Sign up' ||
        link.textContent?.includes('Sign up')
      );
      expect(signUpLink).toBeInTheDocument();
    });
  });

  describe('Register Page', () => {
    it('renders the registration form', () => {
      render(<RegisterPage />);

      // Check for key elements
      expect(screen.getByRole('heading', { name: /Create Your Account/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();

      // Check for the sign in link
      expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
      const signInLink = screen.getAllByRole('link').find(link =>
        link.textContent === 'Sign in' ||
        link.textContent?.includes('Sign in')
      );
      expect(signInLink).toBeInTheDocument();
    });
  });

  describe('Forgot Password Page', () => {
    it('renders the forgot password form', () => {
      render(<ForgotPasswordPage />);

      // Check for key elements
      expect(screen.getByRole('heading', { name: /Reset Your Password/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();

      // Find the reset button
      const resetButton = screen.getByRole('button', { name: /Send Reset Instructions/i });
      expect(resetButton).toBeInTheDocument();

      // Check for the back to sign in link
      const backToSignInLink = screen.getByRole('link', { name: /Back to Sign In/i });
      expect(backToSignInLink).toBeInTheDocument();
    });
  });
});
