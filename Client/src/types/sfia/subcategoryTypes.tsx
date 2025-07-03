export interface Subcategory {
  id: number;
  subcategory_text?: string | null;
}

export interface SubcategoryPageResult {
  data: Subcategory[];
  total?: number;
}

export type CreateSubcategoryDto = Omit<Subcategory, "id">;
export type UpdateSubcategoryDto = Partial<Omit<Subcategory, "id">>;
