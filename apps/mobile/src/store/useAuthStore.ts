import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import api from '../api/client';

interface AuthState {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { user, token } = response.data;
      await SecureStore.setItemAsync('siryia_token', token);
      set({ user, token, isLoading: false });
    } catch (error) {
      console.error('Login error', error);
      throw error;
    }
  },
  logout: async () => {
    await SecureStore.deleteItemAsync('siryia_token');
    set({ user: null, token: null });
  },
  checkAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('siryia_token');
      if (token) {
        // Optionnel: valider le token avec un endpoint /auth/profile
        set({ token, isLoading: false });
      } else {
        set({ token: null, isLoading: false });
      }
    } catch (error) {
      set({ token: null, isLoading: false });
    }
  },
}));
