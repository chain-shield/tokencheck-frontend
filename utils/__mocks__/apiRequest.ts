/**
 * Mock implementation of the apiRequest utility for testing
 */

import { AxiosResponse } from 'axios';

// Type for mock response configuration
export interface MockResponseConfig<T = any> {
  data: T;
  status?: number;
  headers?: Record<string, string>;
}

// Store for mock responses by endpoint
const mockResponses: Record<string, MockResponseConfig> = {};

// Store for tracking API calls
export const apiCallHistory: Array<{
  endpoint: string;
  method: string;
  data: any;
  addAuthToken: boolean;
}> = [];

/**
 * Reset all mock responses and call history
 */
export function resetMocks(): void {
  Object.keys(mockResponses).forEach(key => {
    delete mockResponses[key];
  });
  apiCallHistory.length = 0;
}

/**
 * Configure a mock response for a specific endpoint
 * 
 * @param endpoint - The API endpoint to mock
 * @param response - The mock response configuration
 */
export function mockApiResponse<T>(endpoint: string, response: MockResponseConfig<T>): void {
  mockResponses[endpoint] = response;
}

/**
 * Configure a mock error response for a specific endpoint
 * 
 * @param endpoint - The API endpoint to mock
 * @param errorMessage - The error message
 * @param status - The HTTP status code (default: 400)
 */
export function mockApiError(endpoint: string, errorMessage: string, status = 400): void {
  const error = new Error(errorMessage) as Error & {
    status?: number;
    data?: Record<string, unknown> | null;
  };
  error.status = status;
  error.data = { error: errorMessage };
  
  mockResponses[endpoint] = {
    data: error,
    status,
    headers: { 'Content-Type': 'application/json' },
    isError: true
  } as any;
}

/**
 * Mock implementation of the apiRequest function
 * 
 * @param endpoint - API endpoint to call
 * @param method - HTTP method
 * @param data - Request data
 * @param addAuthToken - Whether to add auth token
 * @returns Promise resolving to the mock response data
 */
export async function apiRequest<T = unknown>(
  endpoint: string,
  method = 'GET',
  data: Record<string, unknown> | null = null,
  addAuthToken = true
): Promise<T> {
  // Record the API call
  apiCallHistory.push({
    endpoint,
    method,
    data,
    addAuthToken
  });

  // Find the mock response for this endpoint
  const mockResponse = mockResponses[endpoint];
  
  // If no mock is configured, return a default response
  if (!mockResponse) {
    console.warn(`No mock response configured for endpoint: ${endpoint}`);
    return {} as T;
  }
  
  // If this is a mocked error, throw it
  if ((mockResponse as any).isError) {
    throw mockResponse.data;
  }
  
  // Return the mock data
  return mockResponse.data as T;
}

// Default export for Jest auto-mocking
export default apiRequest;
