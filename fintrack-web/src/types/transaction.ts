export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  amountInCents: number;
  type: TransactionType;
  date: string; // ISO 8601
  notes: string | null;
  isRecurring: boolean;
  categoryId: string | null;
  categoryName: string | null;
  categoryColor: string | null;
  categoryIcon: string | null;
  createdAt: string;
}

export interface TransactionSummary {
  totalIncomeInCents: number;
  totalExpenseInCents: number;
  balanceInCents: number;
}

export interface PagedTransactions {
  items: Transaction[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  summary: TransactionSummary;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  type?: 1 | 2; // 1 = Income, 2 = Expense (enums da API)
  page?: number;
  pageSize?: number;
}

export interface CreateTransactionRequest {
  description: string;
  amountInCents: number;
  type: 1 | 2;
  date: string;
  categoryId: string | null;
  notes: string | null;
  isRecurring: boolean;
}

export interface UpdateTransactionRequest extends CreateTransactionRequest {}
