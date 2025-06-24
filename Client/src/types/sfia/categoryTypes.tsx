export interface Category {
  id: number;
  category_text?: string | null;
  subcategory_id?: number | null;
}

export interface CategoryPageResult {
  data: Category[];
  nextCursor?: number;
}

export type CreateCategoryDto = Omit<Category, "id">;
export type UpdateCategoryDto = Partial<CreateCategoryDto>;
