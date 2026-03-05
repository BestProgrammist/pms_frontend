// services/authService.ts
import apiClient from '@/lib/api/client';
import { loginUser, User, UserResponse } from '@/types/user';

export const authApi = {
  login: async (data: loginUser): Promise<UserResponse> => {
    const response = await apiClient.post<UserResponse>('/auth/login', data);
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
    const response = await apiClient.get(`/auth/verify`);
    return response.status === 200;
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await apiClient.post('/auth/refresh', { refreshToken: refreshToken });
    console.log("Refresh Token Response:", response);
    return response.data;
  },
};