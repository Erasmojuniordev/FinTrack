import { create } from 'zustand';
import type {
  DashboardPeriod,
  DashboardSummary,
  ExpenseByCategory,
  MonthlyTrendItem,
} from '@/types/dashboard';
import { dashboardService } from '@/services/dashboardService';
import { getPeriodFilters, getTrendMonths } from '@/utils/dashboardPeriod';

/**
 * Store do dashboard usando Zustand.
 *
 * Os três fetches (summary, categories, trend) rodam em paralelo via Promise.all
 * para minimizar latência — cada seção exibe seu próprio estado de loading
 * independentemente das outras.
 */
interface DashboardState {
  period: DashboardPeriod;
  summary: DashboardSummary | null;
  expensesByCategory: ExpenseByCategory[];
  trend: MonthlyTrendItem[];

  isLoadingSummary: boolean;
  isLoadingCategories: boolean;
  isLoadingTrend: boolean;
  error: string | null;

  setPeriod: (period: DashboardPeriod) => void;
  fetchAll: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  period: 'current-month',
  summary: null,
  expensesByCategory: [],
  trend: [],
  isLoadingSummary: false,
  isLoadingCategories: false,
  isLoadingTrend: false,
  error: null,

  // Troca o período e recarrega todos os dados automaticamente
  setPeriod: (period) => {
    set({ period });
    get().fetchAll();
  },

  fetchAll: async () => {
    const { period } = get();
    const filters = getPeriodFilters(period);
    const months = getTrendMonths(period);

    set({ isLoadingSummary: true, isLoadingCategories: true, isLoadingTrend: true, error: null });

    // Promise.all: as três requisições partem simultaneamente
    await Promise.all([
      dashboardService.getSummary(filters)
        .then((summary) => set({ summary, isLoadingSummary: false }))
        .catch(() => set({ isLoadingSummary: false, error: 'Erro ao carregar resumo.' })),

      dashboardService.getExpensesByCategory(filters)
        .then((expensesByCategory) => set({ expensesByCategory, isLoadingCategories: false }))
        .catch(() => set({ isLoadingCategories: false, error: 'Erro ao carregar categorias.' })),

      dashboardService.getTrend(months)
        .then((trend) => set({ trend: trend.items, isLoadingTrend: false }))
        .catch(() => set({ isLoadingTrend: false, error: 'Erro ao carregar tendência.' })),
    ]);
  },
}));
