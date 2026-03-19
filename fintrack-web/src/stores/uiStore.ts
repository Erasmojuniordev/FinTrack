import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UiState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'dark',
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'fintrack-ui',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
