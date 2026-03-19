import api from './api';
import type {
  DashboardFilters,
  DashboardSummary,
  ExpenseByCategory,
  RevenueVsExpenseTrend,
} from '@/types/dashboard';

export const dashboardService = {
  getSummary: async (filters: DashboardFilters): Promise<DashboardSummary> => {
    const { data } = await api.get<DashboardSummary>('/api/dashboard/summary', { params: filters });
    return data;
  },

  getExpensesByCategory: async (filters: DashboardFilters): Promise<ExpenseByCategory[]> => {
    const { data } = await api.get<ExpenseByCategory[]>('/api/dashboard/expenses-by-category', { params: filters });
    return data;
  },

  getTrend: async (months: number): Promise<RevenueVsExpenseTrend> => {
    const { data } = await api.get<RevenueVsExpenseTrend>('/api/dashboard/trend', { params: { months } });
    return data;
  },
};
