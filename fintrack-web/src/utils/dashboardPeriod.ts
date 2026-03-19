import type { DashboardPeriod, DashboardFilters } from '@/types/dashboard';

/**
 * Converte um atalho de período em {startDate, endDate} prontos para enviar à API.
 * Função pura — não usa hooks, facilitando reuso e testes.
 */
export function getPeriodFilters(period: DashboardPeriod): DashboardFilters {
  const now = new Date();

  switch (period) {
    case 'current-month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      return { startDate: start.toISOString(), endDate: end.toISOString() };
    }
    case 'last-3-months': {
      const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      return { startDate: start.toISOString(), endDate: end.toISOString() };
    }
    case 'last-6-months': {
      const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      return { startDate: start.toISOString(), endDate: end.toISOString() };
    }
    case 'current-year': {
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      return { startDate: start.toISOString(), endDate: end.toISOString() };
    }
  }
}

export function getTrendMonths(period: DashboardPeriod): number {
  const map: Record<DashboardPeriod, number> = {
    'current-month': 6,
    'last-3-months': 6,
    'last-6-months': 6,
    'current-year': 12,
  };
  return map[period];
}
