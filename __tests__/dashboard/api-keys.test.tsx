import React from 'react';
import { render, screen } from '../utils';
import ApiKeysPage from '@/app/(protected)/dashboard/@apiKeys/page';

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

// Mock the toast component
jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn(),
}));

describe('API Key Management', () => {
  describe('API Keys Page', () => {
    it('displays the list of API keys when authenticated', () => {
      render(<ApiKeysPage />, { isAuthenticated: true });
      
      // Check for the heading
      expect(screen.getByRole('heading', { name: /API Keys/i })).toBeInTheDocument();
      
      // Check that the API keys are displayed
      expect(screen.getByText('Test API Key 1')).toBeInTheDocument();
      expect(screen.getByText('Test API Key 2')).toBeInTheDocument();
    });
  });
});
