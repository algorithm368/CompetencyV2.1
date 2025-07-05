export interface Description {
  id: number;
  description_text?: string | null;
  level_id?: number | null;
}

export interface DescriptionPageResult {
  data: Description[];
  total?: number;
}

export type CreateDescriptionDto = Omit<Description, "id">;
export type UpdateDescriptionDto = Partial<Omit<Description, "id">>;
