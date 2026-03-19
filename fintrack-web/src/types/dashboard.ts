export type DashboardPeriod = 'current-month' | 'last-3-months' | 'last-6-months' | 'current-year';

export interface DashboardSummary {
  totalIncomeInCents: number;
  totalExpenseInCents: number;
  balanceInCents: number;
  savingsRatePercent: number;
}

export interface ExpenseByCategory {
  categoryId: string | null;
  categoryName: string;
  categoryColor: string;
  totalInCents: number;
  percentage: number;
}

export interface MonthlyTrendItem {
  year: number;
  month: number;
  monthLabel: string;
  totalIncomeInCents: number;
  totalExpenseInCents: number;
  balanceInCents: number;
}

export interface RevenueVsExpenseTrend {
  items: MonthlyTrendItem[];
}

export interface DashboardFilters {
  startDate: string;
  endDate: string;
}
