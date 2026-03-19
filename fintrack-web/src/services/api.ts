import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

/**
 * Instância Axios centralizada para todas as chamadas à FinTrack API.
 *
 * Interceptors configurados:
 * - Request: Adiciona o Authorization header com o access token do store.
 * - Response: Em 401, tenta renovar o token via /api/auth/refresh e faz retry automático.
 *   Se o refresh falhar, limpa o store e redireciona para /login.
 */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000',
  withCredentials: true, // necessário para enviar o httpOnly cookie do refresh token
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request: injeta o access token em todas as requisições
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Flag para evitar loop infinito de refresh
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Interceptor de response: em 401, renova o token e faz retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Evita retry infinito no próprio endpoint de refresh
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/api/auth/refresh') {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await api.post<{ accessToken: string; user: { name: string; email: string } }>('/api/auth/refresh');
          useAuthStore.getState().setAuth(data.user, data.accessToken);
          onRefreshed(data.accessToken);
          isRefreshing = false;
        } catch {
          // Refresh falhou: limpa o estado e redireciona para login
          isRefreshing = false;
          refreshSubscribers = [];
          useAuthStore.getState().clearAuth();
          window.location.href = '/login';
          return Promise.reject(error);
        }
      }

      // Aguarda o refresh completar antes de fazer o retry
      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken: string) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
