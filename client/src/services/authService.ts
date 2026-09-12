import api from './api';
import { User, LoginCredentials, ApiResponse } from '@/types';

export const authService = {
  register: async (data: { name: string; email: string; password: string; rememberMe?: boolean }): Promise<any> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials & { rememberMe?: boolean }): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getMe: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<any> => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  changePassword: async (data: { oldPassword: string; newPassword: string }): Promise<any> => {
    const response = await api.put('/auth/change-password', data);
    return response.data;
  },
};
