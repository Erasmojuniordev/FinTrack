export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  isDefault: boolean;
  isSystem: boolean; // true = categoria do sistema (não editável)
}

export interface CreateCategoryRequest {
  name: string;
  color: string;
  icon: string;
}

export interface UpdateCategoryRequest {
  name: string;
  color: string;
  icon: string;
}
