import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Sur émulateur Android, localhost correspond à l'émulateur lui-même. 
// L'hôte (votre PC) est accessible via 10.0.2.2.
// Sur iOS ou Web, on peut utiliser localhost.
const API_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:3001/api' 
  : 'http://localhost:3001/api';

const client = axios.create({
  baseURL: API_URL,
});

client.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('siryia_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error fetching token from SecureStore', error);
  }
  return config;
});

export default client;
