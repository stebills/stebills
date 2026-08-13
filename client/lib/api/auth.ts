import apiClient, { AUTH_TOKEN_KEY } from './client';
import { storage } from '@/lib/utils';
import { ApiSuccess, AuthResult } from './types';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  number: string;
  password: string;
  confirmPassword: string;
  referrer?: string;
}

async function persistSession(result: AuthResult) {
  await storage.setItem(AUTH_TOKEN_KEY, result.token);
  await storage.setItem('current_user', result.user);
  return result;
}

export async function register(payload: RegisterPayload): Promise<AuthResult> {
  const { data } = await apiClient.post<ApiSuccess<AuthResult>>('/users', payload);
  return persistSession(data.data);
}

export async function login(email: string, password: string): Promise<AuthResult> {
  const { data } = await apiClient.post<ApiSuccess<AuthResult>>('/users/login', {
    email,
    password,
  });
  return persistSession(data.data);
}

export async function googleSignIn(idToken: string): Promise<AuthResult> {
  const { data } = await apiClient.post<ApiSuccess<AuthResult>>('/auth/google', { idToken });
  return persistSession(data.data);
}

export async function logout(): Promise<void> {
  await storage.removeItem(AUTH_TOKEN_KEY);
  await storage.removeItem('current_user');
}

export async function getCurrentUser() {
  return storage.getItem('current_user');
}

export async function getAuthToken(): Promise<string | null> {
  return storage.getItem(AUTH_TOKEN_KEY);
}

export async function setTransactionPin(newPin: string): Promise<void> {
  await apiClient.post('/auth/set-transaction-pin', { newPin });
}

export async function verifyTransactionPin(newPin: string): Promise<boolean> {
  try {
    await apiClient.post('/auth/verify-transaction-pin', { newPin });
    return true;
  } catch {
    return false;
  }
}
