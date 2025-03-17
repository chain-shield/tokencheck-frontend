"use client";

import { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser, getAuthToken, setAuthToken, removeAuthToken } from '../utils/authService';
import { User } from '@/lib/models/models';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<User>;
  register: (username: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  updateAuthToken: (newToken: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => ({ id: '' }),
  register: async () => ({ id: '' }),
  logout: async () => { },
  updateAuthToken: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = getAuthToken();
        if (token) {
          setLoading(true);
        }

        const userData = await getCurrentUser();
        if (userData) {
          setUser(userData);
        } else {
          removeAuthToken();
          setUser(null);
        }
      } catch (error) {
        console.error('Not authenticated', error);
        removeAuthToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (username: string, password: string) => {
    setError(null);
    try {
      const userData = await loginUser(username, password);
      setUser(userData);
      return userData;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage || 'Login failed');
      throw err;
    }
  };

  const register = async (username: string, password: string) => {
    setError(null);
    try {
      const userData = await registerUser(username, password);
      setUser(userData);
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

  const updateAuthToken = (newToken: string) => {
    if (newToken) {
      setAuthToken(newToken);
      if (user) {
        setUser({
          ...user,
          // token: newToken
        });
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};
