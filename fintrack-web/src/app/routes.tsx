import { lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

// Lazy loading para reduzir o bundle inicial
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const TransactionsPage = lazy(() => import('@/pages/TransactionsPage'));

/**
 * Componente que protege rotas privadas.
 * Redireciona para /login se o usuário não estiver autenticado.
 */
const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

/**
 * Rota pública: redireciona usuários autenticados para o dashboard.
 */
const PublicRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
    <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
  </div>
);

export const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
      </Route>

      {/* Redireciona raiz para dashboard (ou login se não autenticado) */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </Suspense>
);
