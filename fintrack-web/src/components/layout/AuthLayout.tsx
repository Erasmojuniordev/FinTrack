import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

/**
 * Layout dividido para telas de autenticação.
 * Esquerda: formulário. Direita: branding com gradiente.
 * Em mobile, apenas o formulário é exibido.
 */
const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => (
  <div className="min-h-screen flex bg-[var(--color-background)]">
    {/* Coluna do formulário */}
    <div className="flex-1 flex items-center justify-center p-8 lg:max-w-[50%]">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Logo / Marca */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
            FinTrack
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Controle financeiro inteligente
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">{title}</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">{subtitle}</p>
        </div>

        {children}
      </motion.div>
    </div>

    {/* Coluna de branding — oculta em mobile */}
    <div className="hidden lg:flex flex-1 relative overflow-hidden">
      {/* Gradiente de fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#0F172A]" />

      {/* Decoração geométrica */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[var(--color-primary)] opacity-10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-[#8B5CF6] opacity-10 rounded-full blur-3xl" />

      {/* Conteúdo do branding */}
      <motion.div
        className="relative z-10 flex flex-col justify-center p-16 text-white"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Inteligência financeira ao seu alcance
            </h2>
            <p className="mt-4 text-[#94A3B8] text-base leading-relaxed">
              Acompanhe receitas, despesas e receba insights analíticos com o FinScore proprietário.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { label: 'FinScore', desc: 'Score de saúde financeira em tempo real' },
              { label: 'Projeções', desc: 'Previsão de gastos baseada no seu histórico' },
              { label: 'Alertas', desc: 'Notificações preventivas de anomalias' },
            ].map((feature) => (
              <div key={feature.label} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">{feature.label}</p>
                  <p className="text-xs text-[#94A3B8]">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </div>
);

export default AuthLayout;
