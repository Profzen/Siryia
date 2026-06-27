import { create } from 'zustand';
import api from '@/lib/api';

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  setUser: (user: any) => void;
  fetchProfile: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  fetchProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      set({ user: response.data, isAuthenticated: true });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      set({ user: null, isAuthenticated: false });
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
