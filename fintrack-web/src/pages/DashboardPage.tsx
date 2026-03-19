import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';

/**
 * Placeholder do Dashboard. Será implementado na Fase 3.
 */
const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <motion.div
      className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center gap-6 p-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Bem-vindo, {user?.name}
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Dashboard em construção — Fase 3
        </p>
      </div>

      <Button variant="secondary" onClick={logout}>
        Sair
      </Button>
    </motion.div>
  );
};

export default DashboardPage;
