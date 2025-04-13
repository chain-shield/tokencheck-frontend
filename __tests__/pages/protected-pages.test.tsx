import React from 'react';
import { render, screen } from '../utils';
import DashboardPage from '@/app/(protected)/dashboard/page';
import ApiKeysPage from '@/app/(protected)/dashboard/@apiKeys/page';

// Mock the useRouter hook
const mockRouter = { push: jest.fn() };
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => mockRouter
}));

// Mock the useApiKeys hook
jest.mock('@/app/(protected)/dashboard/@apiKeys/use-api-keys', () => ({
  useApiKeys: () => ({
    apiKeys: [
      {
        id: 'mock-key-id-1',
        name: 'Test API Key 1',
        key: 'tk_test_1234567890abcdef1234567890abcdef',
        status: 'active',
        created_at: '2023-01-01T00:00:00Z'
      },
      {
        id: 'mock-key-id-2',
        name: 'Test API Key 2',
        key: 'tk_test_abcdef1234567890abcdef1234567890',
        status: 'active',
        created_at: '2023-01-02T00:00:00Z'
      }
    ],
    makeNewKey: jest.fn(),
    removeKey: jest.fn(),
    keyToDelete: null,
    setKeyToDelete: jest.fn(),
    error: null,
    isLoading: false
  })
}));

describe.skip('Protected Pages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRouter.push.mockClear();
  });

  describe('Dashboard Page', () => {
    it('renders the dashboard when authenticated', () => {
      render(<DashboardPage />, { isAuthenticated: true });

      // Check for the dashboard title
      expect(screen.getByRole('heading', { name: /API Dashboard/i })).toBeInTheDocument();

      // Check for the sign out button
      expect(screen.getByRole('button', { name: /Sign Out/i })).toBeInTheDocument();
    });
  });

  describe('API Keys Page', () => {
    it('renders the API keys page when authenticated', () => {
      render(<ApiKeysPage />, { isAuthenticated: true });

      // Check for the API keys heading
      expect(screen.getByRole('heading', { name: /API Keys/i })).toBeInTheDocument();

      // Check that the API keys are displayed
      expect(screen.getByText('Test API Key 1')).toBeInTheDocument();
      expect(screen.getByText('Test API Key 2')).toBeInTheDocument();
    });
  });
});
