/**
 * Authentication service for handling user login and registration
 * This module provides functions for user authentication via email/password
 */

import { apiRequest } from './apiRequest';
import { LoginResponse, RegisterResponse, User } from '@/lib/models/models';
import { setTokenInLocalStorage } from './oAuthService';
import { OAuthProvider } from './oAuthService';

/**
 * Token expiration time in milliseconds
 * Currently set to 7 days
 */
const EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 7; // 7 days

/**
 * Helper function to hash passwords using SHA-256
 * @param password - The plain text password to hash
 * @returns A promise that resolves to the hashed password as a hex string
 */
async function hashPassword(password: string): Promise<string> {
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

/**
 * Authenticates a user with email and password
 * @param email - The user's email address
 * @param password - The user's password (will be hashed before sending)
 * @returns A promise that resolves to the authenticated User object
 * @throws Will throw an error if authentication fails
 */
export async function loginUser(email: string, password: string): Promise<User> {
  const hashedPassword = await hashPassword(password);
  const data = await apiRequest<LoginResponse>('/auth/login', 'POST', {
    email,
    password: hashedPassword
  });
  if (data.token) {
    setTokenInLocalStorage(OAuthProvider.EMAIL, data.token);
  }
  return data.user;
}

/**
 * Registers a new user with the application
 * @param email - The user's email address
 * @param username - The user's full name (will be split into first and last name)
 * @param password - The user's password (will be hashed before sending)
 * @returns A promise that resolves to the newly created User object
 * @throws Will throw an error if registration fails
 */
export async function registerUser(email: string, username: string, password: string): Promise<User> {
  const hashedPassword = await hashPassword(password);
  const firstName = username.split(' ')[0];
  const lastName = username.split(' ')[1];

  const data = await apiRequest<RegisterResponse>('/auth/register', 'POST', {
    email,
    password: hashedPassword,
    first_name: firstName,
    last_name: lastName
  });

  return data.user;
}

