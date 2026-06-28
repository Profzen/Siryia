import { create } from 'zustand';
import api from '@/lib/api';

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setUser: (user: any) => void;
  fetchProfile: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  setUser: (user) => set({ user, isAuthenticated: !!user, isInitialized: true }),
  fetchProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      set({ user: response.data, isAuthenticated: true, isInitialized: true });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      set({ user: null, isAuthenticated: false, isInitialized: true });
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false, isInitialized: true });
  },
}));
