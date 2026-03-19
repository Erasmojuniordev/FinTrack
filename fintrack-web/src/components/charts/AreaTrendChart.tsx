import { useId } from 'react';
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import type { MonthlyTrendItem } from '@/types/dashboard';
import { formatCurrency } from '@/utils/formatCurrency';

interface AreaTrendChartProps {
  data: MonthlyTrendItem[];
  isLoading: boolean;
}

/**
 * Gráfico de área: receitas vs despesas ao longo dos meses.
 *
 * useId() gera IDs únicos por instância para os gradientes SVG — necessário
 * porque o Recharts usa <linearGradient id="..."> internamente e IDs duplicados
 * causariam bugs visuais quando há múltiplos gráficos na mesma página.
 *
 * Cores hardcodadas (não CSS variables) porque o SVG do Recharts não herda
 * o contexto CSS do DOM de forma confiável.
 */
const AreaTrendChart = ({ data, isLoading }: AreaTrendChartProps) => {
  const uid = useId();

  if (isLoading) {
    return (
      <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', height: '200px', borderRadius: '8px', backgroundColor: 'var(--color-border)', opacity: 0.5 }} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Nenhum dado no período.</p>
      </div>
    );
  }

  // Adapta o shape para o Recharts: valores em centavos divididos por 100 para exibição no eixo Y
  const chartData = data.map((item) => ({
    label: item.monthLabel,
    receitas: item.totalIncomeInCents,
    despesas: item.totalExpenseInCents,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id={`${uid}-income`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#34D399" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
          </linearGradient>
          <linearGradient id={`${uid}-expense`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F87171" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#F87171" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />

        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#64748B' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => formatCurrency(v).replace('R$\u00a0', '')}
          tick={{ fontSize: 11, fill: '#64748B' }}
          axisLine={false}
          tickLine={false}
          width={56}
        />

        <Tooltip
          formatter={(value: number, name: string) => [
            formatCurrency(value),
            name === 'receitas' ? 'Receitas' : 'Despesas',
          ]}
          labelStyle={{ color: '#94A3B8', fontSize: 12 }}
          contentStyle={{
            backgroundColor: '#1E293B',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            fontSize: 13,
          }}
        />

        <Area
          type="monotone"
          dataKey="receitas"
          stroke="#34D399"
          strokeWidth={2}
          fill={`url(#${uid}-income)`}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
        <Area
          type="monotone"
          dataKey="despesas"
          stroke="#F87171"
          strokeWidth={2}
          fill={`url(#${uid}-expense)`}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaTrendChart;
