// context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, User } from '@/types/user';
import { authApi } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: loginUser) => Promise<Boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // const {login} = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Sahifa yuklanganda token va user ma'lumotlarini tekshirish
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          // Token validligini tekshirish
          await authApi.verifyToken();
        } catch (error) {
          console.error('Authentication failed:', error);
          logout();
        }
      }
      setIsLoading(false);
    };
    
    initAuth();
  }, []);

  const login = async (data: loginUser) => {
    try {
      const response = await authApi.login(data);
      const { user, accessToken } = response;

      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      setToken(accessToken);
      setUser(user);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // localStorage.removeItem('refreshToken');
    
    setToken(null);
    setUser(null);
    
    window.location.href = '/login';
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};