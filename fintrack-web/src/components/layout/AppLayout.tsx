import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, LayoutDashboard, ArrowLeftRight, LogOut,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AppLayoutProps {
  children: ReactNode;
}

const navItems = [
  { to: '/dashboard',    label: 'Dashboard',   Icon: LayoutDashboard },
  { to: '/transactions', label: 'Transações',   Icon: ArrowLeftRight  },
];

/**
 * Layout padrão da área autenticada.
 * Sidebar com toggle de expansão/recolhimento (240px ↔ 64px).
 * useLocation determina o item ativo sem precisar de props.
 */
const AppLayout = ({ children }: AppLayoutProps) => {
  const { logout } = useAuth();
  const { pathname } = useLocation();
  const [expanded, setExpanded] = useState(true);

  const sidebarWidth = expanded ? 240 : 64;

  return (
    <div style={{ minHeight: '100svh', display: 'flex', backgroundColor: 'var(--color-background)' }}>

      {/* ── Sidebar ── */}
      <motion.nav
        animate={{ width: sidebarWidth }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          flexShrink: 0,
          borderRight: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 12px',
          gap: '4px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Cabeçalho: logo (expandido) ou botão de toggle (recolhido) */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', overflow: 'hidden' }}>
          {expanded ? (
            <>
              {/* Logo visível apenas quando expandido */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', flex: 1, minWidth: 0 }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '10px',
                  backgroundColor: 'var(--color-primary)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <TrendingUp size={16} color="white" strokeWidth={2.5} />
                </div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', whiteSpace: 'nowrap' }}
                >
                  FinTrack
                </motion.span>
              </div>
              {/* Botão recolher — alinhado à direita do logo */}
              <button
                onClick={() => setExpanded(false)}
                title="Recolher menu"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                  color: 'var(--color-text-secondary)', backgroundColor: 'transparent',
                  border: 'none', cursor: 'pointer', transition: 'background-color 0.15s',
                }}
              >
                <ChevronLeft size={16} />
              </button>
            </>
          ) : (
            /* Botão expandir — ocupa o lugar do logo quando recolhido */
            <button
              onClick={() => setExpanded(true)}
              title="Expandir menu"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                color: 'var(--color-text-secondary)', backgroundColor: 'transparent',
                border: 'none', cursor: 'pointer', transition: 'background-color 0.15s',
                margin: '0 auto',
              }}
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>

        {/* Nav items */}
        {navItems.map(({ to, label, Icon }) => {
          const isActive = pathname === to || pathname.startsWith(to + '/');
          return (
            <Link
              key={to}
              to={to}
              title={!expanded ? label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                backgroundColor: isActive
                  ? 'color-mix(in srgb, var(--color-primary) 12%, transparent)'
                  : 'transparent',
                textDecoration: 'none',
                transition: 'background-color 0.15s, color 0.15s',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} style={{ flexShrink: 0 }} />
              {expanded && label}
            </Link>
          );
        })}

        {/* Rodapé: logout */}
        <div style={{ marginTop: 'auto' }}>
          <button
            onClick={logout}
            title={!expanded ? 'Sair' : undefined}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px', borderRadius: '10px', fontSize: '14px',
              color: 'var(--color-text-secondary)', backgroundColor: 'transparent',
              border: 'none', cursor: 'pointer', width: '100%',
              transition: 'background-color 0.15s', whiteSpace: 'nowrap', overflow: 'hidden',
            }}
          >
            <LogOut size={18} strokeWidth={2} style={{ flexShrink: 0 }} />
            {expanded && 'Sair'}
          </button>
        </div>
      </motion.nav>

      {/* ── Conteúdo principal ── */}
      <main style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
