import { create } from 'zustand';
import { User, LoginCredentials } from '@/types';
import { authService } from '@/services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  updateProfile: (data: Partial<User>) => Promise<User>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false, // Must be false initially so login button is not stuck in spinning state
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  updateProfile: async (data: Partial<User>) => {
    set({ isLoading: true });
    try {
      const response: any = await authService.updateProfile(data);
      const updatedUser = response?.user || response?.data?.user || response;
      set({ user: updatedUser, isLoading: false });
      return updatedUser;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  register: async (data) => {
    set({ isLoading: true });
    try {
      const response: any = await authService.register(data);
      const user = response?.user || response?.data?.user;
      const token = response?.accessToken || response?.data?.accessToken;
      if (token) {
        localStorage.setItem('accessToken', token);
      }
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      localStorage.removeItem('accessToken');
      set({ user: null, isAuthenticated: false, isLoading: false });
      throw error;
    }
  },
  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response: any = await authService.login(credentials);
      const user = response?.user || response?.data?.user;
      const token = response?.accessToken || response?.data?.accessToken;
      if (token) {
        localStorage.setItem('accessToken', token);
      }
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      localStorage.removeItem('accessToken');
      set({ user: null, isAuthenticated: false, isLoading: false });
      throw error;
    }
  },
  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem('accessToken');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const response: any = await authService.getMe();
      const user = response?.user || response?.data?.user;
      set({ user, isAuthenticated: !!user, isLoading: false });
    } catch {
      localStorage.removeItem('accessToken');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
