import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';

interface SummaryCardProps {
  label: string;
  valueInCents: number;
  icon: LucideIcon;
  color: string;
  backgroundColor: string;
  isLoading: boolean;
  /** Quando true, exibe o valor como número simples (ex: taxa de poupança %) em vez de moeda */
  rawValue?: boolean;
  suffix?: string;
}

/**
 * Card de resumo com animação CountUp.
 *
 * CountUp implementado via requestAnimationFrame (sem biblioteca externa):
 * - useRef guarda o valor anterior para interpolar
 * - useEffect roda o efeito após o render e cancela no cleanup para evitar memory leak
 * - Função de easing easeOut torna a animação mais natural (desacelera no final)
 */
const SummaryCard = ({ label, valueInCents, icon: Icon, color, backgroundColor, isLoading, rawValue, suffix }: SummaryCardProps) => {
  const displayRef = useRef<HTMLParagraphElement>(null);
  const prevValueRef = useRef(0);

  useEffect(() => {
    if (isLoading || !displayRef.current) return;

    const from = prevValueRef.current;
    const to = valueInCents;
    prevValueRef.current = to;

    const duration = 600;
    const startTime = performance.now();

    let rafId: number;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOut cubic: desacelera no final
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (to - from) * eased);

      if (displayRef.current) {
        const formatted = rawValue
          ? current.toFixed(1) + (suffix ?? '')
          : formatCurrency(current) + (suffix ?? '');
        displayRef.current.textContent = formatted;
      }

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [valueInCents, isLoading, suffix]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: '20px 24px',
        borderRadius: '14px',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px',
        backgroundColor, display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={20} color={color} strokeWidth={2} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
          {label}
        </p>
        {isLoading ? (
          <div style={{
            height: '24px', borderRadius: '6px',
            backgroundColor: 'var(--color-border)',
            width: '120px',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
        ) : (
          <p
            ref={displayRef}
            style={{ fontSize: '18px', fontWeight: 700, color, letterSpacing: '-0.02em' }}
          >
            {rawValue ? valueInCents.toFixed(1) + (suffix ?? '') : formatCurrency(valueInCents) + (suffix ?? '')}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default SummaryCard;
