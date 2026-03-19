import { useEffect, type ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useUiStore } from '@/stores/uiStore';

/**
 * Aplica o tema (dark/light) no elemento raiz do HTML e envolve a app com providers necessários.
 */
const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const theme = useUiStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
};

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider>{children}</ThemeProvider>
  </BrowserRouter>
);
