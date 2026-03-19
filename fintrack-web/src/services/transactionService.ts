import api from './api';
import type {
  CreateTransactionRequest,
  PagedTransactions,
  Transaction,
  TransactionFilters,
  UpdateTransactionRequest,
} from '@/types/transaction';

export const transactionService = {
  getAll: async (filters: TransactionFilters = {}): Promise<PagedTransactions> => {
    const { data } = await api.get<PagedTransactions>('/api/transactions', { params: filters });
    return data;
  },

  getById: async (id: string): Promise<Transaction> => {
    const { data } = await api.get<Transaction>(`/api/transactions/${id}`);
    return data;
  },

  create: async (request: CreateTransactionRequest): Promise<Transaction> => {
    const { data } = await api.post<Transaction>('/api/transactions', request);
    return data;
  },

  update: async (id: string, request: UpdateTransactionRequest): Promise<Transaction> => {
    const { data } = await api.put<Transaction>(`/api/transactions/${id}`, request);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/transactions/${id}`);
  },
};
