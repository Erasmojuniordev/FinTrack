import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import type { LoginRequest, RegisterRequest } from '@/types/auth';

/**
 * Hook que encapsula as ações de autenticação.
 * Gerencia estado de loading/erro e atualiza o authStore após cada operação.
 */
export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth, clearAuth, user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(data);
      setAuth(response.user, response.accessToken);
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = extractErrorMessage(err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(data);
      setAuth(response.user, response.accessToken);
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = extractErrorMessage(err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      // Limpa o estado mesmo se o backend falhar
      clearAuth();
      navigate('/login');
    }
  };

  return { login, register, logout, isLoading, error, user, isAuthenticated };
};

// Extrai a mensagem de erro da resposta da API ou retorna uma mensagem genérica
const extractErrorMessage = (err: unknown): string => {
  if (err && typeof err === 'object' && 'response' in err) {
    const axiosError = err as { response?: { data?: { error?: string } } };
    return axiosError.response?.data?.error ?? 'Ocorreu um erro inesperado.';
  }
  return 'Não foi possível conectar ao servidor.';
};
