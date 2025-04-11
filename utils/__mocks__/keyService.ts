/**
 * Mock implementation of the keyService for testing
 */

import { ApiKey, CreateApiKeyResponse } from '@/lib/models/models';
import { v4 as uuidv4 } from 'uuid';

// Mock API keys data store
export const mockApiKeys: ApiKey[] = [
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
];

// Store for tracking function calls
export const keyServiceCalls = {
  getAllKeys: [] as any[],
  createKey: [] as Array<{ name: string }>,
  deleteKey: [] as Array<{ id: string }>
};

/**
 * Mock implementation of getAllKeys
 * 
 * @returns Promise resolving to mock API keys
 */
export async function getAllKeys(): Promise<ApiKey[]> {
  keyServiceCalls.getAllKeys.push({});
  return [...mockApiKeys]; // Return a copy to prevent mutation
}

/**
 * Mock implementation of createKey
 * 
 * @param name - Name for the new API key
 * @returns Promise resolving to mock create API key response
 */
export async function createKey(name: string): Promise<CreateApiKeyResponse> {
  keyServiceCalls.createKey.push({ name });
  
  // Create a new mock API key
  const newKey: CreateApiKeyResponse = {
    id: `mock-key-id-${mockApiKeys.length + 1}`,
    user_id: 'mock-user-id-123',
    key: `tk_test_${uuidv4().replace(/-/g, '')}`,
    name,
    status: 'active',
    created_at: new Date().toISOString(),
    permissions: {}
  };
  
  // Add to mock data store
  mockApiKeys.push({
    id: newKey.id,
    name: newKey.name,
    key: newKey.key,
    status: newKey.status,
    created_at: newKey.created_at
  });
  
  return newKey;
}

/**
 * Mock implementation of deleteKey
 * 
 * @param id - ID of the API key to delete
 * @returns Promise resolving to void
 */
export async function deleteKey(id: string): Promise<void> {
  keyServiceCalls.deleteKey.push({ id });
  
  // Find the index of the key to delete
  const keyIndex = mockApiKeys.findIndex(key => key.id === id);
  
  // If key exists, remove it from the mock data store
  if (keyIndex !== -1) {
    mockApiKeys.splice(keyIndex, 1);
  } else {
    // Simulate error for non-existent key
    const error = new Error('API key not found') as Error & {
      status?: number;
      data?: Record<string, unknown> | null;
    };
    error.status = 404;
    throw error;
  }
}

/**
 * Reset all mock data and call history
 */
export function resetMocks(): void {
  // Reset mock API keys to initial state
  mockApiKeys.length = 0;
  mockApiKeys.push(
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
  );
  
  // Reset call history
  keyServiceCalls.getAllKeys.length = 0;
  keyServiceCalls.createKey.length = 0;
  keyServiceCalls.deleteKey.length = 0;
}
