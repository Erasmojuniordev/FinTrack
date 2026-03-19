import { useEffect } from 'react';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import { useDashboardStore } from '@/stores/dashboardStore';
import AppLayout from '@/components/layout/AppLayout';
import PeriodSelector from '@/components/features/dashboard/PeriodSelector';
import SummaryCard from '@/components/features/dashboard/SummaryCard';
import AreaTrendChart from '@/components/charts/AreaTrendChart';
import DonutCategoryChart from '@/components/charts/DonutCategoryChart';

/**
 * Dashboard — Fase 3.
 *
 * useEffect com [] dispara fetchAll uma vez após o primeiro render (equivalente
 * ao ngOnInit/OnInitializedAsync do mundo .NET). fetchAll é estável porque
 * o Zustand cria as funções fora do ciclo de render.
 */
const DashboardPage = () => {
  const {
    period, summary, expensesByCategory, trend,
    isLoadingSummary, isLoadingCategories, isLoadingTrend,
    setPeriod, fetchAll,
  } = useDashboardStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <AppLayout>
      <div style={{ backgroundColor: 'var(--color-background)', padding: '32px 40px' }}>

        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
              Dashboard
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Visão geral das suas finanças
            </p>
          </div>
          <PeriodSelector value={period} onChange={setPeriod} />
        </div>

        {/* Cards de resumo — grid 4 colunas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <SummaryCard
            label="Receitas"
            valueInCents={summary?.totalIncomeInCents ?? 0}
            icon={TrendingUp}
            color="#34D399"
            backgroundColor="rgba(52,211,153,0.1)"
            isLoading={isLoadingSummary}
          />
          <SummaryCard
            label="Despesas"
            valueInCents={summary?.totalExpenseInCents ?? 0}
            icon={TrendingDown}
            color="#F87171"
            backgroundColor="rgba(248,113,113,0.1)"
            isLoading={isLoadingSummary}
          />
          <SummaryCard
            label="Saldo"
            valueInCents={summary?.balanceInCents ?? 0}
            icon={Wallet}
            color={(summary?.balanceInCents ?? 0) >= 0 ? '#60A5FA' : '#F87171'}
            backgroundColor={(summary?.balanceInCents ?? 0) >= 0 ? 'rgba(96,165,250,0.1)' : 'rgba(248,113,113,0.1)'}
            isLoading={isLoadingSummary}
          />
          <SummaryCard
            label="Taxa de poupança"
            valueInCents={summary?.savingsRatePercent ?? 0}
            icon={PiggyBank}
            color="#A78BFA"
            backgroundColor="rgba(167,139,250,0.1)"
            isLoading={isLoadingSummary}
            rawValue
            suffix="%"
          />
        </div>

        {/* Gráficos — grid 2 colunas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px' }}>

          {/* Tendência mensal */}
          <div style={{
            padding: '24px',
            borderRadius: '14px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Receitas vs Despesas
                </h2>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  Evolução mensal
                </p>
              </div>
              {/* Legenda */}
              <div style={{ display: 'flex', gap: '16px' }}>
                {[{ color: '#34D399', label: 'Receitas' }, { color: '#F87171', label: 'Despesas' }].map(({ color, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '10px', height: '3px', borderRadius: '2px', backgroundColor: color }} />
                    <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <AreaTrendChart data={trend} isLoading={isLoadingTrend} />
          </div>

          {/* Gastos por categoria */}
          <div style={{
            padding: '24px',
            borderRadius: '14px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
          }}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Gastos por categoria
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                Distribuição das despesas
              </p>
            </div>
            <DonutCategoryChart data={expensesByCategory} isLoading={isLoadingCategories} />
          </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
