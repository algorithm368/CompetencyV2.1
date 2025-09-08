export interface Career {
  id: number;
  careerId: number;
  levelId: number;
}

export interface CareerView {
  id: number;
  career: { id: number; name: string | null } | null;
  level:  { id: number; name: string | null } | null;
}

export interface CareerPageResult {
  data: CareerView[];
  total?: number;
}


export type CreateCareerDto = Omit<Career, "id">;
export type UpdateCareerDto = Partial<CreateCareerDto>;

