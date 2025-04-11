/**
 * Mock implementation of the authService for testing
 */

import { User, LoginResponse, RegisterResponse } from '@/lib/models/models';
import { OAuthProvider } from '../oAuthService';

// Mock user data
export const mockUser: User = {
  id: 'mock-user-id-123',
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  company_name: 'Test Company',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  verification_origin: 'email',
  verified: true
};

// Store for tracking function calls
export const authServiceCalls = {
  loginUser: [] as Array<{ email: string; password: string }>,
  registerUser: [] as Array<{ email: string; username: string; password: string }>,
  hashPassword: [] as Array<{ password: string }>
};

// Mock implementation of hashPassword
export async function hashPassword(password: string): Promise<string> {
  authServiceCalls.hashPassword.push({ password });
  // Simple mock hash function - not secure, just for testing
  return `mock-hashed-${password}`;
}

/**
 * Mock implementation of loginUser
 * 
 * @param email - User email
 * @param password - User password
 * @returns Promise resolving to mock user
 */
export async function loginUser(email: string, password: string): Promise<User> {
  authServiceCalls.loginUser.push({ email, password });
  
  // Simulate authentication failure for specific test cases
  if (email === 'fail@example.com') {
    const error = new Error('Authentication failed') as Error & {
      status?: number;
      data?: Record<string, unknown> | null;
    };
    error.status = 401;
    throw error;
  }
  
  // Return mock login response
  return mockUser;
}

/**
 * Mock implementation of registerUser
 * 
 * @param email - User email
 * @param username - User name
 * @param password - User password
 * @returns Promise resolving to mock user
 */
export async function registerUser(email: string, username: string, password: string): Promise<User> {
  authServiceCalls.registerUser.push({ email, username, password });
  
  // Simulate registration failure for specific test cases
  if (email === 'exists@example.com') {
    const error = new Error('User already exists') as Error & {
      status?: number;
      data?: Record<string, unknown> | null;
    };
    error.status = 409;
    throw error;
  }
  
  // Return mock register response with custom name from the input
  const firstName = username.split(' ')[0];
  const lastName = username.split(' ')[1] || '';
  
  return {
    ...mockUser,
    email,
    first_name: firstName,
    last_name: lastName
  };
}

/**
 * Reset all mock call history
 */
export function resetMocks(): void {
  authServiceCalls.loginUser.length = 0;
  authServiceCalls.registerUser.length = 0;
  authServiceCalls.hashPassword.length = 0;
}
