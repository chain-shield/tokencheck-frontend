
import { apiRequest } from './apiRequest';
import { LoginResponse, User } from '@/lib/models/models';

// Helper function to hash passwords using SHA-256
// 'window' is a global object in web browsers that represents the browser window
// It contains properties and methods for interacting with the browser/DOM
// It's undefined when code runs on Node.js/server-side
async function hashPassword(password: string) {
  // Check if we're running in a browser environment (window exists)
  // and if the Web Crypto API (crypto.subtle) is available
  if (typeof window === 'undefined' || !crypto.subtle) {
    console.warn('Secure hashing not available, using fallback method');
    // When running on server-side or crypto API not available,
    // we can't use browser crypto - would need server-side hashing
    return password;
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function loginUser(username: string, password: string): Promise<User> {
  const hashedPassword = await hashPassword(password);
  const data = await apiRequest<LoginResponse>('/auth/login', 'POST', {
    username,
    password: hashedPassword
  });
  if (data.token) {
    setAuthToken(data.token);
  }
  return data.user;
}

export async function registerUser(username: string, password: string): Promise<User> {
  const hashedPassword = await hashPassword(password);
  const data = await apiRequest<LoginResponse>('/auth/register', 'POST', {
    username,
    password: hashedPassword
  });
  if (data.token) {
    setAuthToken(data.token);
  }
  return data.user;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const user = await apiRequest<User>('/secured/me', 'GET');
    return user;
  } catch (error) {
    if (error instanceof Error && 'status' in error && error.status === 401) {
      return null;
    }
    throw error;
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
}

export function setAuthToken(token: string): void {
  localStorage.setItem('authToken', token);
}

export function removeAuthToken(): void {
  localStorage.removeItem('authToken');
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
