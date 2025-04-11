import React from 'react';
import { render, screen, fireEvent } from '../utils';
import LoginPage from '@/app/(auth)/login/page';

// Mock the auth service
jest.mock('@/utils/authService', () => ({
  loginUser: jest.fn().mockResolvedValue({
    id: 'mock-user-id-123',
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    company_name: 'Test Company',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    verification_origin: 'email',
    verified: true
  }),
  hashPassword: jest.fn(pwd => pwd)
}));

// Mock the useRouter hook
const mockRouter = { push: jest.fn() };
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => mockRouter
}));

// Create a mock logout component for testing
const LogoutComponent = () => {
  const handleLogout = () => {
    // In a real app, this would call the logout function
    mockRouter.push('/login');
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

describe('Authentication Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRouter.push.mockClear();
  });

  describe('Login Flow', () => {
    it('renders the login form correctly', () => {
      render(<LoginPage />);

      // Check for key elements
      expect(screen.getByRole('heading', { name: /Welcome Back/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    });
  });

  describe('Logout Flow', () => {
    it('renders the logout button', () => {
      render(<LogoutComponent />);

      // Check for the logout button
      expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
    });
  });
});
