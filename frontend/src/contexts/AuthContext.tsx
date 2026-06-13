/**
 * VENUE VENDORS CLIENT APP - AUTHCONTEXT.TSX
 * 
 * Purpose: Source code for Venue Vendors Client App.
 * 
 * Command lines to execute/build/test this project:
 * - Start Vite Frontend Dev Server: npm run dev
 * - Build Frontend bundle: npm run build
 * - Run Frontend Unit Tests: npm test
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
  signup: (
    email: string,
    password: string,
    name: string,
    phone: string,
    role: UserRole
  ) => Promise<{ success: boolean; message: string; user?: User; errors?: any }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('vv_token');
    if (!token) {
      setCurrentUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      } else {
        // Token might have expired or be invalid
        localStorage.removeItem('vv_token');
        setCurrentUser(null);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || 'Signin failed.' };
      }

      localStorage.setItem('vv_token', data.token);
      setCurrentUser(data.user);
      return { success: true, message: data.message, user: data.user };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, message: 'Could not connect to the authentication server.' };
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    phone: string,
    role: UserRole
  ): Promise<{ success: boolean; message: string; user?: User; errors?: any }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, phone, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.message || 'Registration failed.',
          errors: data.errors,
        };
      }

      localStorage.setItem('vv_token', data.token);
      setCurrentUser(data.user);
      return { success: true, message: data.message, user: data.user };
    } catch (err) {
      console.error('Signup error:', err);
      return { success: false, message: 'Could not connect to the authentication server.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('vv_token');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
