export interface CareerLevel {
  id: number;
  careerId: number;
  levelId: number;
}

export interface CareerLevelDetail {
  id: number;
  description: string;
  careerLevelId: number;
}

export interface CareerLevelView {
  id: number;
  careerId: number;
  levelId: number;
  career: { 
    id: number; 
    name: string | null;
  } | null;
  level: { 
    id: number; 
    name: string | null;
  } | null;
  careerLevelDetails: CareerLevelDetail[];
}

export interface CareerLevelPageResult {
  data: CareerLevelView[];
  total?: number;
}

export type CreateCareerLevelDto = Omit<CareerLevel, "id">;
export type UpdateCareerLevelDto = Partial<CreateCareerLevelDto>;