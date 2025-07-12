export interface Career {
  id_career: number;
  name_career?: string | null;
}

export interface CareerPageResult {
    data: Career[];
    total?: number;
}

export type CreateCareerDto = Omit<Career, "id_career">;
export type UpdateCareerDto = Partial<Omit<CreateCareerDto, "id_career">>;