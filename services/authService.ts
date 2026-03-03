// services/authService.ts
// import api from '@/lib/api';
import apiClient from '@/lib/api/client';
import { LoginRequest, LoginResponse, User } from '@/types/user';
// import { LoginRequest, LoginResponse, User } from '../types/auth';

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/profile');
    return response.data;
  },

  verifyToken: async (): Promise<boolean> => {
    const response = await apiClient.get('/auth/verify');
    return response.status === 200;
  },

  refreshToken: async (refreshToken: string): Promise<{ access_token: string }> => {
    const response = await apiClient.post('/auth/refresh', { refresh_token: refreshToken });
    return response.data;
  },
};