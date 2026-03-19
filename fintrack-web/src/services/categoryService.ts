import api from './api';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/category';

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get<Category[]>('/api/categories');
    return data;
  },

  create: async (request: CreateCategoryRequest): Promise<Category> => {
    const { data } = await api.post<Category>('/api/categories', request);
    return data;
  },

  update: async (id: string, request: UpdateCategoryRequest): Promise<Category> => {
    const { data } = await api.put<Category>(`/api/categories/${id}`, request);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/categories/${id}`);
  },
};
