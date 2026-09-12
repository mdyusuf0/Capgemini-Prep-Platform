import { create } from 'zustand';
import { User, LoginCredentials } from '@/types';
import { authService } from '@/services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials & { rememberMe?: boolean }) => Promise<void>;
  register: (data: { name: string; email: string; password: string; rememberMe?: boolean }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  updateProfile: (data: Partial<User>) => Promise<User>;
}

// Restore persisted user on store creation for instant hydration
const getPersistedUser = (): User | null => {
  try {
    const stored = localStorage.getItem('persistedUser');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const persistUser = (user: User | null) => {
  try {
    if (user) {
      localStorage.setItem('persistedUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('persistedUser');
    }
  } catch {
    // Ignore storage errors
  }
};

const initialUser = getPersistedUser();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  isAuthenticated: !!initialUser,
  isLoading: false, // Must be false initially so login button is not stuck in spinning state
  setUser: (user) => {
    persistUser(user);
    set({ user, isAuthenticated: !!user, isLoading: false });
  },
  updateProfile: async (data: Partial<User>) => {
    set({ isLoading: true });
    try {
      const response: any = await authService.updateProfile(data);
      const updatedUser = response?.user || response?.data?.user || response;
      persistUser(updatedUser);
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
      if (data.rememberMe !== false) {
        localStorage.setItem('rememberMe', 'true');
      }
      persistUser(user);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      localStorage.removeItem('accessToken');
      persistUser(null);
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
      // Persist user data for session restoration across browser restarts
      if (credentials.rememberMe !== false) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      persistUser(user);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      localStorage.removeItem('accessToken');
      persistUser(null);
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
      localStorage.removeItem('persistedUser');
      localStorage.removeItem('rememberMe');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
  checkAuth: async () => {
    const token = localStorage.getItem('accessToken');
    const persisted = localStorage.getItem('persistedUser');
    if (!token && !persisted) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    // If we already have a persisted user, do a silent background check without flashing a full-page spinner
    if (!persisted) {
      set({ isLoading: true });
    }

    try {
      const response: any = await authService.getMe();
      const user = response?.user || response?.data?.user;
      persistUser(user);
      set({ user, isAuthenticated: !!user, isLoading: false });
    } catch {
      localStorage.removeItem('accessToken');
      persistUser(null);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
