
import { apiRequest } from './apiRequest';
import { LoginResponse, RegisterResponse, User } from '@/lib/models/models';
import { findUserFromLocalStorage, getAuthTokenFromLocalStorage, isTokenSetFromLocalStorage, isUserSetFromLocalStorage, removeTokenFromLocalStorage, removeUserFromLocalStorage, setTokenInLocalStorage } from './oAuthService';
import { OAuthProvider } from './oAuthService';
import { useContext } from 'react';

const EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 7; // 7 days

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

