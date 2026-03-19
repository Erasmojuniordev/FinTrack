import api from './api';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth';

/**
 * Serviço de autenticação: encapsula as chamadas à API de auth.
 * Os hooks (useAuth) consomem este serviço e gerenciam o estado do store.
 */
export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
  },

  refresh: async (): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/refresh');
    return response.data;
  },
};
