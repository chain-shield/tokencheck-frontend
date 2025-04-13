/**
 * Tests for the useApiKeys hook
 *
 * These tests verify that our API keys hook works correctly,
 * including proper loading states, error handling, and data fetching.
 */

import { renderHook, waitFor, act } from '@testing-library/react';
import { useApiKeys } from '@/hooks/use-api-keys';
import { ReactNode } from 'react';
import * as keyService from '@/utils/keyService';
import * as toastHook from '@/hooks/use-toast';

// Create a mock SWRConfig component
const SWRConfig = ({ children }: { children: ReactNode }) => <>{children}</>;

// Mock the keyService module
jest.mock('@/utils/keyService', () => ({
  getAllKeys: jest.fn(),
  createKey: jest.fn(),
  deleteKey: jest.fn(),
}));

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn(),
}));

// Sample API keys for testing
const mockApiKeys = [
  { id: '1', name: 'Test Key 1', key: 'key1', created_at: '2023-01-01T00:00:00Z' },
  { id: '2', name: 'Test Key 2', key: 'key2', created_at: '2023-01-02T00:00:00Z' },
];

// Wrapper component for testing
const wrapper = ({ children }: { children: ReactNode }) => <>{children}</>;

describe.skip('useApiKeys Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return loading state initially', async () => {
    // Setup a mock service response that resolves after a delay
    (keyService.getAllKeys as jest.Mock).mockImplementation(() => new Promise(resolve => {
      setTimeout(() => resolve(mockApiKeys), 100);
    }));

    // Render the hook
    const { result } = renderHook(() => useApiKeys(), { wrapper });

    // Initially, it should be in loading state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.apiKeys).toEqual([]);

    // Wait for the data to load
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // After loading, it should have data
    expect(result.current.apiKeys).toEqual(mockApiKeys);
  });

  it('should handle errors correctly', async () => {
    // Setup a mock service response that rejects
    const error = new Error('Test error');
    (keyService.getAllKeys as jest.Mock).mockRejectedValue(error);

    // Render the hook
    const { result } = renderHook(() => useApiKeys(), { wrapper });

    // Wait for the error to be caught
    await waitFor(() => expect(result.current.error).toBe(error));

    // It should not be loading
    expect(result.current.isLoading).toBe(false);
    expect(result.current.apiKeys).toEqual([]);
  });

  it('should create a new API key', async () => {
    // Setup mock service responses
    (keyService.getAllKeys as jest.Mock).mockResolvedValue(mockApiKeys);
    const newKey = { id: '3', name: 'New Key', key: 'newkey', created_at: '2023-01-03T00:00:00Z' };
    (keyService.createKey as jest.Mock).mockResolvedValue(newKey);

    // Render the hook
    const { result } = renderHook(() => useApiKeys(), { wrapper });

    // Wait for the initial data to load
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Create a new key
    let createdKey;
    await act(async () => {
      createdKey = await result.current.makeNewKey('New Key');
    });

    // The createKey service should have been called
    expect(keyService.createKey).toHaveBeenCalledWith('New Key');
    expect(createdKey).toEqual(newKey);

    // A success toast should have been shown
    expect(toastHook.toast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'API Key Created',
    }));
  });

  it('should handle errors when creating a key', async () => {
    // Setup mock service responses
    (keyService.getAllKeys as jest.Mock).mockResolvedValue(mockApiKeys);
    const error = new Error('Creation error');
    (keyService.createKey as jest.Mock).mockRejectedValue(error);

    // Render the hook
    const { result } = renderHook(() => useApiKeys(), { wrapper });

    // Wait for the initial data to load
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Try to create a new key
    await act(async () => {
      try {
        await result.current.makeNewKey('New Key');
      } catch (e) {
        // Expected error
      }
    });

    // An error toast should have been shown
    expect(toastHook.toast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Failed to create API key',
      variant: 'destructive',
    }));
  });

  it('should delete an API key', async () => {
    // Setup mock service responses
    (keyService.getAllKeys as jest.Mock).mockResolvedValue(mockApiKeys);
    (keyService.deleteKey as jest.Mock).mockResolvedValue(undefined);

    // Render the hook
    const { result } = renderHook(() => useApiKeys(), { wrapper });

    // Wait for the initial data to load
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Delete a key
    await act(async () => {
      await result.current.removeKey('1');
    });

    // The deleteKey service should have been called
    expect(keyService.deleteKey).toHaveBeenCalledWith('1');

    // A success toast should have been shown
    expect(toastHook.toast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'API Key Deleted',
    }));
  });

  it('should handle errors when deleting a key', async () => {
    // Setup mock service responses
    (keyService.getAllKeys as jest.Mock).mockResolvedValue(mockApiKeys);
    const error = new Error('Deletion error');
    (keyService.deleteKey as jest.Mock).mockRejectedValue(error);

    // Render the hook
    const { result } = renderHook(() => useApiKeys(), { wrapper });

    // Wait for the initial data to load
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Try to delete a key
    await act(async () => {
      try {
        await result.current.removeKey('1');
      } catch (e) {
        // Expected error
      }
    });

    // An error toast should have been shown
    expect(toastHook.toast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Failed to delete API key',
      variant: 'destructive',
    }));
  });
});
