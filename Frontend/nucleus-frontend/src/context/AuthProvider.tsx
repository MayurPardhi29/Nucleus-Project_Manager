import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authApi } from '../api/authApi';
import {
  User,
  AuthResponseData,
} from '../types/Auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthContextValue {
  auth: AuthState;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true
  });

  // Check for existing token on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setAuth({
          user,
          isAuthenticated: true,
          loading: false
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuth({
          user: null,
          isAuthenticated: false,
          loading: false
        });
      }
    } else {
      setAuth(prev => ({ ...prev, loading: false }));
    }
  }, []);
  const login = async (username: string, password: string) => {
    try {
      console.log('Attempting login...');
  
      const response = await authApi.login({
        username,
        password
      });
  
      console.log('Login successful:', response);
  
      const authData = response.data;
  
      if (!authData.token) {
        throw new Error('Invalid response from server');
      }
  
      const user: User = {
        username: authData.username,
        email: authData.email,
        role: authData.role
      };
  
      localStorage.setItem(
        'token',
        authData.token
      );
  
      localStorage.setItem(
        'user',
        JSON.stringify(user)
      );
  
      setAuth({
        user,
        isAuthenticated: true,
        loading: false
      });
  
    } catch (error) {
      console.error('Login failed:', error);
  
      localStorage.removeItem('token');
      localStorage.removeItem('user');
  
      setAuth({
        user: null,
        isAuthenticated: false,
        loading: false
      });
  
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({
      user: null,
      isAuthenticated: false,
      loading: false
    });
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};