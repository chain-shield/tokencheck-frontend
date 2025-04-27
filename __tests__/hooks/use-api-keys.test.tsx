/**
 * Tests for the useApiKeys hook
 *
 * These tests verify that our API keys hook works correctly,
 * including proper loading states, error handling, and data fetching.
 */

import { renderHook, waitFor, act } from '@testing-library/react';
import { useApiKeys } from '@/hooks/use-api-keys';
import { ReactNode } from 'react';
import { mockApiKeys } from '@/utils/__mocks__/keyService';
import * as toastHook from '@/hooks/use-toast';

// Create mock functions
const mockGetAllKeys = jest.fn().mockResolvedValue(mockApiKeys);
const mockCreateKey = jest.fn();
const mockDeleteKey = jest.fn();

// Mock the keyService module
jest.mock('@/utils/keyService', () => ({
  getAllKeys: () => mockGetAllKeys(),
  createKey: (name: string) => mockCreateKey(name),
  deleteKey: (id: string) => mockDeleteKey(id)
}));

// Mock the toast hook
jest.mock('@/hooks/use-toast');

// Mock SWR
jest.mock('swr');

// Wrapper component for testing
const wrapper = ({ children }: { children: ReactNode }) => <>{children}</>;

// Import SWR mock helpers
const swr = require('swr');
console.log('SWR mock:', swr);
const swrMock = swr.swrMock;

describe('useApiKeys Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAllKeys.mockClear();
    mockCreateKey.mockClear();
    mockDeleteKey.mockClear();
  });

  it('should return loading state initially', async () => {
    // The mock implementation will return the mockApiKeys

    // Set SWR to loading state
    // Mock SWR to return loading state
    swr.default.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: jest.fn()
    });

    // Render the hook
    const { result } = renderHook(() => useApiKeys(), { wrapper });

    // Initially, it should be in loading state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.apiKeys).toEqual([]);

    // Now set SWR to return loaded data
    swr.default.mockReturnValue({
      data: mockApiKeys,
      error: undefined,
      isLoading: false,
      mutate: jest.fn()
    });

    // Re-render the hook
    const { result: updatedResult } = renderHook(() => useApiKeys(), { wrapper });

    // After loading, it should have data
    expect(updatedResult.current.isLoading).toBe(false);
    expect(updatedResult.current.apiKeys).toEqual(mockApiKeys);
  });

  it('should handle errors correctly', async () => {
    // Setup a mock service response that rejects
    const error = new Error('Test error');

    // Set SWR to error state
    swr.default.mockReturnValue({
      data: undefined,
      error: error,
      isLoading: false,
      mutate: jest.fn()
    });

    // Render the hook
    const { result } = renderHook(() => useApiKeys(), { wrapper });

    // It should have the error and not be loading
    expect(result.current.error).toBe(error);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.apiKeys).toEqual([]);
  });

  it('should create a new API key', async () => {
    // Setup mock service responses
    const newKey = { id: '3', name: 'New Key', key: 'newkey', created_at: '2023-01-03T00:00:00Z' };
    mockCreateKey.mockResolvedValue(newKey);
    toastHook.toast = jest.fn().mockImplementation(() => { });

    // Set up SWR mock with a mutate function
    const mutate = jest.fn().mockResolvedValue([...mockApiKeys, newKey]);
    swr.default.mockReturnValue({
      data: mockApiKeys,
      error: undefined,
      isLoading: false,
      mutate: mutate
    });

    // Render the hook
    const { result } = renderHook(() => useApiKeys(), { wrapper });

    // Create a new key
    let createdKey;
    await act(async () => {
      createdKey = await result.current.makeNewKey('New Key');
    });

    // The createKey service should have been called
    expect(mockCreateKey).toHaveBeenCalledWith('New Key');
    expect(createdKey).toEqual(newKey);

    // The mutate function should have been called to refresh the data
    expect(mutate).toHaveBeenCalled();

    // A success toast should have been shown
    expect(toastHook.toast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'API Key Created',
    }));
  });

  it('should handle errors when creating a key', async () => {
    // Setup mock service responses
    const error = new Error('Creation error');
    mockCreateKey.mockRejectedValue(error);
    toastHook.toast = jest.fn().mockImplementation(() => { });

    // Set up SWR mock with a mutate function
    const mutate = jest.fn().mockResolvedValue(mockApiKeys);
    swr.default.mockReturnValue({
      data: mockApiKeys,
      error: undefined,
      isLoading: false,
      mutate: mutate
    });

    // Render the hook
    const { result } = renderHook(() => useApiKeys(), { wrapper });

    // Try to create a new key
    await act(async () => {
      try {
        await result.current.makeNewKey('New Key');
      } catch (e) {
        // Expected error
      }
    });

    // The createKey service should have been called
    expect(mockCreateKey).toHaveBeenCalledWith('New Key');

    // An error toast should have been shown
    expect(toastHook.toast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Failed to create API key',
      variant: 'destructive',
    }));
  });

  it('should delete an API key', async () => {
    // Setup mock service responses
    mockDeleteKey.mockResolvedValue(undefined);
    toastHook.toast = jest.fn().mockImplementation(() => { });

    // Set up SWR mock with a mutate function
    const mutate = jest.fn().mockResolvedValue(mockApiKeys.filter(key => key.id !== '1'));
    swr.default.mockReturnValue({
      data: mockApiKeys,
      error: undefined,
      isLoading: false,
      mutate: mutate
    });

    // Render the hook
    const { result } = renderHook(() => useApiKeys(), { wrapper });

    // Delete a key
    await act(async () => {
      await result.current.removeKey('1');
    });

    // The deleteKey service should have been called
    expect(mockDeleteKey).toHaveBeenCalledWith('1');

    // The mutate function should have been called to refresh the data
    expect(mutate).toHaveBeenCalled();

    // A success toast should have been shown
    expect(toastHook.toast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'API Key Deleted',
    }));
  });

  it('should handle errors when deleting a key', async () => {
    // Setup mock service responses
    const error = new Error('Deletion error');
    mockDeleteKey.mockRejectedValue(error);
    toastHook.toast = jest.fn().mockImplementation(() => { });

    // Set up SWR mock with a mutate function
    const mutate = jest.fn().mockResolvedValue(mockApiKeys);
    swr.default.mockReturnValue({
      data: mockApiKeys,
      error: undefined,
      isLoading: false,
      mutate: mutate
    });

    // Render the hook
    const { result } = renderHook(() => useApiKeys(), { wrapper });

    // Try to delete a key
    await act(async () => {
      try {
        await result.current.removeKey('1');
      } catch (e) {
        // Expected error
      }
    });

    // The deleteKey service should have been called
    expect(mockDeleteKey).toHaveBeenCalledWith('1');

    // An error toast should have been shown
    expect(toastHook.toast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Failed to delete API key',
      variant: 'destructive',
    }));
  });
});
