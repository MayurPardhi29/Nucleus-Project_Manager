// api/authApi.ts
import axiosClient from './axiosClient';
import { LoginRequest, RegisterRequest, ApiResponse, AuthResponseData } from '../types/Auth';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<AuthResponseData>> => {
    const response = await axiosClient.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (payload: RegisterRequest): Promise<ApiResponse<AuthResponseData>> => {
    const response = await axiosClient.post('/auth/register', payload);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};