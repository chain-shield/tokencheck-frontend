"use client";

import { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser     } from '../utils/authService';
import { User } from '@/lib/models/models';
import { getAuthTokenFromLocalStorage, getCurrentUser, getUserFromLocalStorage, OAuthProvider, removeAuthToken, setTokenInLocalStorage } from '@/utils/oAuthService';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<User>;
  register: (email: string, username: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  updateAuthToken: (provider: OAuthProvider, newToken: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => ({} as User),
  register: async () => ({} as User),
  logout: async () => {},
  updateAuthToken: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  // Function to check auth with a configurable retry mechanism
  const checkLoggedIn = async () => {
    try {
      console.log('checking if user is logged in (auth guard)');
      
      // Check for OAuth token in localStorage
      const oAuthToken = getAuthTokenFromLocalStorage();
      
      if (oAuthToken) {
        console.log('oAuthToken found (auth guard)', oAuthToken);
        const { provider, token } = oAuthToken;
        setTokenInLocalStorage(provider, token);
        
        // Try to get user from localStorage
        const userStr = await getUserFromLocalStorage(provider);
        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            console.log('user found in localStorage (auth guard)', userData);
            setUser(userData);
            setLoading(false);
            return; // Exit early if we found user data
          } catch (e) {
            console.error('Error parsing user data from localStorage', e);
          }
        }
      }

     // add 300ms delay to wait for new auth data to be saved to local storage
    //  await new Promise(resolve => setTimeout(resolve, 300));

      // If no valid user in localStorage, try to get from server
      const userData = await getCurrentUser();
      if (userData) {
        console.log('userData retrieved from server (auth guard)', userData);
        setUser(userData);
        setLoading(false);
      } else {
        // No authenticated user found
        setUser(null);
        setLoading(false);
      }
      
    } catch (error) {
      console.error('Auth check error', error);
      
      removeAuthToken();
      setUser(null);
      setLoading(false);
    }
  };

      // Listen for auth data saved events
    const handleAuthDataSaved = (event: Event) => {
      console.log('Auth data saved event received');
      checkLoggedIn();
    };

  // Listen for localStorage changes (for cross-tab authentication)
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key && (e.key.endsWith('Token') || e.key.endsWith('User'))) {
      checkLoggedIn();
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  window.addEventListener('authDataSaved', handleAuthDataSaved);


  // check if token exists, if so then try checklogin 
  if (getAuthTokenFromLocalStorage()) { 
    checkLoggedIn();
  }
  // set loading to false after on component mount 
  setLoading(false);
  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('authDataSaved', handleAuthDataSaved);
  };
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const userData = await loginUser(email, password);
      setUser(userData);
      setLoading(false);
      window.dispatchEvent(new Event('authDataSaved'));
      return userData;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage || 'Login failed');
      throw err;
    }
  };

  const register = async (email: string, username: string, password: string) => {
    setError(null);
    try {
      const userData = await registerUser(email, username, password);
      setUser(userData);
      setLoading(false);
      window.dispatchEvent(new Event('authDataSaved'));
      return userData;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage || 'Registration failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      removeAuthToken();
      setUser(null);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage || 'Logout failed');
    }
  };

  const updateAuthToken = (provider: OAuthProvider, newToken: string) => {
    if (newToken) {
      setTokenInLocalStorage(provider, newToken);
      if (user) {
        setUser({ ...user });
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};
