import axiosClient from './axiosClient';
import {
  ApiResponse,
  AuthResponseData,
  LoginRequest
} from '../types/Auth';

export const authApi = {
  login: (
    request: LoginRequest
  ): Promise<ApiResponse<AuthResponseData>> =>
    axiosClient.post(
      '/auth/login',
      request
    ),

  logout: async () => {
    try {
      await axiosClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};