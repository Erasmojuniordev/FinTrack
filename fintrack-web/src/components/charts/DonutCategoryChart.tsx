import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import type { ExpenseByCategory } from '@/types/dashboard';
import { formatCurrency } from '@/utils/formatCurrency';

interface DonutCategoryChartProps {
  data: ExpenseByCategory[];
  isLoading: boolean;
}

/**
 * Gráfico de donut: gastos por categoria.
 * Legenda renderizada manualmente abaixo do gráfico para controle total do layout.
 * Máximo de 6 itens individualmente; os demais são agrupados como "Outros".
 */
const DonutCategoryChart = ({ data, isLoading }: DonutCategoryChartProps) => {
  if (isLoading) {
    return (
      <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '160px', height: '160px', borderRadius: '50%', backgroundColor: 'var(--color-border)', opacity: 0.5 }} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Nenhum gasto no período.</p>
      </div>
    );
  }

  // Agrupa itens além do 6º como "Outros"
  const MAX_ITEMS = 6;
  const top = data.slice(0, MAX_ITEMS);
  const rest = data.slice(MAX_ITEMS);
  const chartData = rest.length > 0
    ? [...top, {
        categoryId: null,
        categoryName: 'Outros',
        categoryColor: '#64748B',
        totalInCents: rest.reduce((acc, x) => acc + x.totalInCents, 0),
        percentage: rest.reduce((acc, x) => acc + x.percentage, 0),
      }]
    : top;

  return (
    <div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            dataKey="totalInCents"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.categoryColor} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, _name: string, props) => [
              formatCurrency(value),
              props.payload.categoryName,
            ]}
            contentStyle={{
              backgroundColor: '#1E293B',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              fontSize: 13,
            }}
            itemStyle={{ color: '#E2E8F0' }}
            labelFormatter={() => ''}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legenda manual */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
        {chartData.map((item) => (
          <div key={item.categoryName} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '3px',
              backgroundColor: item.categoryColor, flexShrink: 0,
            }} />
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.categoryName}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--color-text-primary)', fontWeight: 500, flexShrink: 0 }}>
              {item.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutCategoryChart;
