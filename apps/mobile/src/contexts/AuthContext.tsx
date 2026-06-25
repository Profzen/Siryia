import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (token: string, userData: User) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si un token existe au démarrage
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('siryia_token');
        const storedUser = await SecureStore.getItemAsync('siryia_user');
        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, []);

  const signIn = async (token: string, userData: User) => {
    await SecureStore.setItemAsync('siryia_token', token);
    await SecureStore.setItemAsync('siryia_user', JSON.stringify(userData));
    setUser(userData);
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync('siryia_token');
    await SecureStore.deleteItemAsync('siryia_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
