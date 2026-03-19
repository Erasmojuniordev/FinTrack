import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight, BarChart2, Bell, Zap } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const features = [
  { Icon: BarChart2, label: 'FinScore',   desc: 'Score de saúde financeira calculado em tempo real' },
  { Icon: Zap,       label: 'Projeções',  desc: 'Previsão de gastos baseada no seu histórico' },
  { Icon: Bell,      label: 'Alertas',    desc: 'Notificações preventivas de anomalias financeiras' },
];

/**
 * Layout de tela cheia dividido em duas colunas para autenticação.
 * Esquerda: formulário. Direita: painel de branding com mock financeiro.
 * Em mobile, apenas a coluna do formulário é exibida.
 *
 * Espaçamento via inline styles + gap para garantir consistência no Tailwind v4.
 */
const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => (
  <div style={{ minHeight: '100svh', display: 'flex', backgroundColor: 'var(--color-background)' }}>

    {/* ── Coluna do formulário ── */}
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 4.5rem',
        maxWidth: '50%',
        position: 'relative',
      }}
    >
      {/* Gradiente de fundo sutil */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, color-mix(in srgb, var(--color-primary) 8%, transparent), transparent)',
        }}
      />

      <motion.div
        style={{ width: '100%', maxWidth: '400px', position: 'relative', display: 'flex', flexDirection: 'column', gap: '2rem' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px color-mix(in srgb, var(--color-primary) 40%, transparent)',
              flexShrink: 0,
            }}
          >
            <TrendingUp size={18} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1 }}>
              FinTrack
            </p>
            <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px', lineHeight: 1 }}>
              Controle financeiro inteligente
            </p>
          </div>
        </div>

        {/* Título da página */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {title}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            {subtitle}
          </p>
        </div>

        {/* Card do formulário */}
        <div
          style={{
            borderRadius: '16px',
            padding: '28px',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)',
          }}
        >
          {children}
        </div>
      </motion.div>
    </div>

    {/* ── Coluna de branding — oculta em mobile ── */}
    <div
      className="hidden lg:flex"
      style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#060D1A',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Camadas de fundo */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 80% 20%, #0E2144, transparent)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 50% 50% at 20% 80%, #12094A33, transparent)' }} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.04,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Conteúdo centralizado */}
      <motion.div
        style={{ position: 'relative', zIndex: 10, padding: '4rem', width: '100%', maxWidth: '520px' }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

          {/* Card de mock financeiro */}
          <motion.div
            style={{
              borderRadius: '16px',
              padding: '28px',
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Saldo */}
            <div>
              <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', marginBottom: '10px' }}>
                Saldo do mês
              </p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                <span style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.03em', color: 'white', lineHeight: 1 }}>
                  R$ 12.450
                </span>
                <span style={{ fontSize: '20px', fontWeight: 300, color: 'rgba(255,255,255,0.25)', marginBottom: '1px' }}>,00</span>
                <span
                  style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#34D399',
                    backgroundColor: 'rgba(52,211,153,0.12)',
                    padding: '4px 10px',
                    borderRadius: '999px',
                  }}
                >
                  <ArrowUpRight size={11} strokeWidth={2.5} />
                  +15%
                </span>
              </div>
            </div>

            {/* Receitas / Despesas */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {[
                { label: 'Receitas', value: 'R$ 8.200', color: '#34D399', pct: 78 },
                { label: 'Despesas', value: 'R$ 2.100', color: '#F87171', pct: 25 },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#475569' }}>{item.label}</span>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>{item.value}</span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                      style={{ height: '100%', borderRadius: '999px', backgroundColor: item.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* FinScore */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#475569' }}>FinScore</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#60A5FA' }}>87 / 100</span>
              </div>
              <div style={{ height: '8px', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  style={{ height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)' }}
                  initial={{ width: 0 }}
                  animate={{ width: '87%' }}
                  transition={{ duration: 0.9, delay: 0.7, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>

          {/* Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.02em', color: 'white' }}>
              Inteligência financeira<br />ao seu alcance
            </h2>
            <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#64748B' }}>
              Acompanhe receitas, despesas e receba insights analíticos com o FinScore proprietário.
            </p>
          </div>

          {/* Lista de features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {features.map(({ Icon, label, desc }, i) => (
              <motion.div
                key={label}
                style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.4 + i * 0.1 }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={15} color="#60A5FA" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', paddingTop: '2px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'white', lineHeight: 1 }}>{label}</p>
                  <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </motion.div>
    </div>
  </div>
);

export default AuthLayout;
