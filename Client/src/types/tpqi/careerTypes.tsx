export interface Career {
  id: number;
  name?: string | null;
}

export interface CareerPageResult {
  data: Career[];
  total?: number;
}

export type CreateCareerDto = Omit<Career, "id_career">;
export type UpdateCareerDto = Partial<Omit<CreateCareerDto, "id_career">>;