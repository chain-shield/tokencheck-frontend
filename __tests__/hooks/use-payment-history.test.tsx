/**
 * Tests for the usePaymentHistory hook
 *
 * These tests verify that our payment history hook works correctly,
 * including proper loading states, error handling, and data fetching.
 */

import { renderHook, act } from '@testing-library/react';
import { usePaymentHistory } from '@/hooks/use-payment-history';
import { PaymentInfoResponse } from '@/lib/models/models';

// Mock the SWR hook
jest.mock('@/hooks/use-swr-fetch', () => ({
  useStaticSWRFetch: jest.fn(),
}));

// Mock the subscription service
jest.mock('@/utils/subscriptionService', () => ({
  getPaymentHistory: jest.fn(),
}));

// Mock the toast notification
jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn(),
}));

describe('usePaymentHistory', () => {
  // Mock data for testing
  const mockPaymentHistory: PaymentInfoResponse = {
    intents: [
      {
        id: 'pi_123456789',
        amount: 9700,
        currency: 'usd',
        status: 'succeeded',
        created: 1625097600, // July 1, 2021
      },
      {
        id: 'pi_987654321',
        amount: 29700,
        currency: 'usd',
        status: 'succeeded',
        created: 1622505600, // June 1, 2021
      },
    ],
  };

  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return payment history data when loaded successfully', () => {
    // Mock the SWR hook to return successful data
    const { useStaticSWRFetch } = require('@/hooks/use-swr-fetch');
    useStaticSWRFetch.mockReturnValue({
      data: mockPaymentHistory,
      error: null,
      isLoading: false,
      isError: false,
      mutate: jest.fn(),
    });

    // Render the hook
    const { result } = renderHook(() => usePaymentHistory());

    // Verify the returned data
    expect(result.current.paymentHistory).toEqual(mockPaymentHistory.intents);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should use filters when provided', () => {
    // Mock getPaymentHistory function
    const { getPaymentHistory } = require('@/utils/subscriptionService');
    getPaymentHistory.mockResolvedValue(mockPaymentHistory);

    // Mock the SWR hook
    const { useStaticSWRFetch } = require('@/hooks/use-swr-fetch');
    useStaticSWRFetch.mockReturnValue({
      data: mockPaymentHistory,
      error: null,
      isLoading: false,
      isError: false,
      mutate: jest.fn(),
    });

    // Define filters
    const filters = {
      status: 'succeeded',
      start_date: 1625097600,
      end_date: 1627776000
    };

    // Render the hook with filters
    renderHook(() => usePaymentHistory(filters));

    // Verify that useStaticSWRFetch was called with a cache key that includes the filters
    expect(useStaticSWRFetch).toHaveBeenCalledWith(
      expect.stringContaining('payment-history-'),
      expect.any(Function)
    );
  });

  it('should return loading state when data is being fetched', () => {
    // Mock the SWR hook to return loading state
    const { useStaticSWRFetch } = require('@/hooks/use-swr-fetch');
    useStaticSWRFetch.mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
      isError: false,
      mutate: jest.fn(),
    });

    // Render the hook
    const { result } = renderHook(() => usePaymentHistory());

    // Verify the loading state
    expect(result.current.paymentHistory).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
  });

  it('should return error state when data fetching fails', () => {
    // Mock error
    const mockError = new Error('Failed to fetch payment history');

    // Mock the SWR hook to return error state
    const { useStaticSWRFetch } = require('@/hooks/use-swr-fetch');
    useStaticSWRFetch.mockReturnValue({
      data: null,
      error: mockError,
      isLoading: false,
      isError: true,
      mutate: jest.fn(),
    });

    // Render the hook
    const { result } = renderHook(() => usePaymentHistory());

    // Verify the error state
    expect(result.current.paymentHistory).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(mockError);
  });

  it('should refresh payment history when refreshPaymentHistory is called', async () => {
    // Mock mutate function
    const mockMutate = jest.fn().mockResolvedValue(mockPaymentHistory);

    // Mock the SWR hook
    const { useStaticSWRFetch } = require('@/hooks/use-swr-fetch');
    useStaticSWRFetch.mockReturnValue({
      data: mockPaymentHistory,
      error: null,
      isLoading: false,
      isError: false,
      mutate: mockMutate,
    });

    // Render the hook
    const { result } = renderHook(() => usePaymentHistory());

    // Call refreshPaymentHistory
    await act(async () => {
      await result.current.refreshPaymentHistory();
    });

    // Verify mutate was called
    expect(mockMutate).toHaveBeenCalledTimes(1);
  });

  it('should refresh payment history with new filters when provided', async () => {
    // Mock getPaymentHistory function
    const { getPaymentHistory } = require('@/utils/subscriptionService');
    getPaymentHistory.mockResolvedValue(mockPaymentHistory);

    // Mock mutate function
    const mockMutate = jest.fn().mockResolvedValue(mockPaymentHistory);

    // Mock the SWR hook
    const { useStaticSWRFetch } = require('@/hooks/use-swr-fetch');
    useStaticSWRFetch.mockReturnValue({
      data: mockPaymentHistory,
      error: null,
      isLoading: false,
      isError: false,
      mutate: mockMutate,
    });

    // Render the hook
    const { result } = renderHook(() => usePaymentHistory());

    // New filters to apply
    const newFilters = { status: 'succeeded' };

    // Call refreshPaymentHistory with new filters
    await act(async () => {
      await result.current.refreshPaymentHistory(newFilters);
    });

    // Verify mutate was called with the new filters
    expect(mockMutate).toHaveBeenCalledTimes(1);
    expect(getPaymentHistory).toHaveBeenCalledWith(newFilters);
  });

  it('should show toast notification when refresh fails', async () => {
    // Mock error for mutate
    const mockError = new Error('Failed to refresh payment history');
    const mockMutate = jest.fn().mockRejectedValue(mockError);

    // Mock the SWR hook
    const { useStaticSWRFetch } = require('@/hooks/use-swr-fetch');
    useStaticSWRFetch.mockReturnValue({
      data: mockPaymentHistory,
      error: null,
      isLoading: false,
      isError: false,
      mutate: mockMutate,
    });

    // Mock toast
    const { toast } = require('@/hooks/use-toast');

    // Render the hook
    const { result } = renderHook(() => usePaymentHistory());

    // Call refreshPaymentHistory
    await act(async () => {
      await result.current.refreshPaymentHistory().catch(() => { });
    });

    // Verify toast was called with error message
    expect(toast).toHaveBeenCalledWith({
      title: "Failed to refresh payment history",
      description: mockError.message,
      variant: "destructive",
    });
  });
});
