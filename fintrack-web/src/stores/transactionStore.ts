import { create } from 'zustand';
import type { PagedTransactions, Transaction, TransactionFilters, TransactionSummary } from '@/types/transaction';
import type { Category } from '@/types/category';
import { transactionService } from '@/services/transactionService';
import { categoryService } from '@/services/categoryService';

/**
 * Store de transações usando Zustand.
 *
 * Centraliza:
 * - Lista paginada de transações com filtros
 * - Categorias disponíveis (carregadas uma vez)
 * - Resumo financeiro do período (calculado pela API)
 * - Estados de loading e erro para cada operação
 */
interface TransactionState {
  // Dados
  transactions: Transaction[];
  categories: Category[];
  summary: TransactionSummary | null;
  filters: TransactionFilters;
  page: number;
  totalPages: number;
  totalCount: number;

  // Estados de UI
  isLoadingTransactions: boolean;
  isLoadingCategories: boolean;
  isSaving: boolean;
  error: string | null;

  // Ações
  fetchTransactions: (filters?: TransactionFilters) => Promise<void>;
  fetchCategories: () => Promise<void>;
  createTransaction: (data: import('@/types/transaction').CreateTransactionRequest) => Promise<boolean>;
  updateTransaction: (id: string, data: import('@/types/transaction').UpdateTransactionRequest) => Promise<boolean>;
  deleteTransaction: (id: string) => Promise<boolean>;
  setFilters: (filters: TransactionFilters) => void;
  setPage: (page: number) => void;
  clearError: () => void;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  categories: [],
  summary: null,
  filters: {},
  page: 1,
  totalPages: 1,
  totalCount: 0,
  isLoadingTransactions: false,
  isLoadingCategories: false,
  isSaving: false,
  error: null,

  fetchTransactions: async (filters) => {
    const activeFilters = filters ?? get().filters;
    set({ isLoadingTransactions: true, error: null, filters: activeFilters });
    try {
      const result = await transactionService.getAll({ ...activeFilters, page: get().page });
      set({
        transactions: result.items,
        summary: result.summary,
        page: result.page,
        totalPages: result.totalPages,
        totalCount: result.totalCount,
        isLoadingTransactions: false,
      });
    } catch {
      set({ isLoadingTransactions: false, error: 'Erro ao carregar transações.' });
    }
  },

  fetchCategories: async () => {
    // Evita recarregar se já tem categorias
    if (get().categories.length > 0) return;
    set({ isLoadingCategories: true });
    try {
      const categories = await categoryService.getAll();
      set({ categories, isLoadingCategories: false });
    } catch {
      set({ isLoadingCategories: false });
    }
  },

  createTransaction: async (data) => {
    set({ isSaving: true, error: null });
    try {
      await transactionService.create(data);
      await get().fetchTransactions();
      set({ isSaving: false });
      return true;
    } catch {
      set({ isSaving: false, error: 'Erro ao criar transação.' });
      return false;
    }
  },

  updateTransaction: async (id, data) => {
    set({ isSaving: true, error: null });
    try {
      await transactionService.update(id, data);
      await get().fetchTransactions();
      set({ isSaving: false });
      return true;
    } catch {
      set({ isSaving: false, error: 'Erro ao atualizar transação.' });
      return false;
    }
  },

  deleteTransaction: async (id) => {
    set({ isSaving: true, error: null });
    try {
      await transactionService.delete(id);
      await get().fetchTransactions();
      set({ isSaving: false });
      return true;
    } catch {
      set({ isSaving: false, error: 'Erro ao excluir transação.' });
      return false;
    }
  },

  setFilters: (filters) => {
    set({ filters, page: 1 });
    get().fetchTransactions(filters);
  },

  setPage: (page) => {
    set({ page });
    get().fetchTransactions();
  },

  clearError: () => set({ error: null }),
}));
