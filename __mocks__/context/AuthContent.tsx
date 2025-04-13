import React from 'react';

// Create a mock AuthContext
export const AuthContext = React.createContext({
  user: null,
  loading: false,
  error: null,
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  refreshUser: jest.fn(),
});

// Export a mock provider for testing
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider
      value={{
        user: null,
        loading: false,
        error: null,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        refreshUser: jest.fn(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
