"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  graduationYear?: number;
  department?: string;
  currentJobTitle?: string;
  currentCompany?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize auth state from localStorage only on client
  useEffect(() => {
    setIsHydrated(true);
    
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth-token');
      const storedUser = localStorage.getItem('auth-user');
      
      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          // Clear invalid data
          localStorage.removeItem('auth-token');
          localStorage.removeItem('auth-user');
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', data.token);
          localStorage.setItem('auth-user', JSON.stringify(data.user));
          
          // Set cookie for middleware
          document.cookie = `auth-token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=strict`;
        }
        
        return true;
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', data.token);
          localStorage.setItem('auth-user', JSON.stringify(data.user));
          
          // Set cookie for middleware
          document.cookie = `auth-token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=strict`;
        }
        
        return true;
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-user');
      
      // Clear cookie
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      // Redirect to login
      window.location.href = '/auth/login';
    }
  };

  const value = {
    user,
    token,
    isLoading: !isHydrated || isLoading,
    login,
    register,
    logout,
    isAuthenticated: isHydrated && !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isHydrated ? (
        <div suppressHydrationWarning>
          {children}
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
export type { User, AuthContextType };
