import axios from 'axios';
import Constants from 'expo-constants';
import { storage } from '@/lib/utils';

export const AUTH_TOKEN_KEY = 'auth_token';

const apiUrl =
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ?? 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: apiUrl,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await storage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
