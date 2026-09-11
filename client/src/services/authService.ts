import api from './api';
import { User, LoginCredentials, ApiResponse } from '@/types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: User }>> => {
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
};
