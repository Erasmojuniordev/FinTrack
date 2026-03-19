import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthUser } from '@/types/auth';

/**
 * Store global de autenticação com Zustand.
 * persist middleware mantém o estado no sessionStorage — limpa ao fechar o navegador.
 * O refresh token nunca é armazenado aqui: fica no httpOnly cookie gerenciado pelo backend.
 */
interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  setAuth: (user: AuthUser, accessToken: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,

      setAuth: (user, accessToken) => set({ user, accessToken }),

      clearAuth: () => set({ user: null, accessToken: null }),

      isAuthenticated: () => {
        const { accessToken } = get();
        return accessToken !== null;
      },
    }),
    {
      name: 'fintrack-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
    }
  )
);
