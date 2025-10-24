import axiosClient from './axiosClient';
import { LoginRequest, RegisterRequest, AuthResponseData } from '../types/Auth';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponseData> => {
    const res = await axiosClient.post('/auth/login', credentials);
    return res.data;
  },
  
  logout: async () => {
    try {
      await axiosClient.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },
  
  forgotPassword: async (data: { username: string; newPassword: string; confirmPassword: string }) => {
    const res = await axiosClient.post('/api/auth/forgot-password', data);
    return res.data;
  },

  register: async (payload: RegisterRequest): Promise<AuthResponseData> => {
    const res = await axiosClient.post('/auth/register', payload);
    return res.data;
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};