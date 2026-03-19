import type { DashboardPeriod } from '@/types/dashboard';

interface PeriodSelectorProps {
  value: DashboardPeriod;
  onChange: (period: DashboardPeriod) => void;
}

const options: { value: DashboardPeriod; label: string }[] = [
  { value: 'current-month',  label: 'Este mês'  },
  { value: 'last-3-months',  label: '3 meses'   },
  { value: 'last-6-months',  label: '6 meses'   },
  { value: 'current-year',   label: 'Este ano'  },
];

/**
 * Seletor de período do dashboard.
 * Renderiza botões pill — o ativo segue o mesmo estilo dos nav items da sidebar.
 */
const PeriodSelector = ({ value, onChange }: PeriodSelectorProps) => (
  <div style={{ display: 'flex', gap: '6px' }}>
    {options.map((opt) => {
      const isActive = value === opt.value;
      return (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: isActive ? 600 : 400,
            color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            backgroundColor: isActive
              ? 'color-mix(in srgb, var(--color-primary) 12%, transparent)'
              : 'transparent',
            border: `1px solid ${isActive ? 'color-mix(in srgb, var(--color-primary) 30%, transparent)' : 'var(--color-border)'}`,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {opt.label}
        </button>
      );
    })}
  </div>
);

export default PeriodSelector;
