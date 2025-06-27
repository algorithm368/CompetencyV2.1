export interface Levels {
  id: number;
  level_name?: string | null;
  code_job?: string | null;
}
export interface LevelPageResult {
  data: Levels[];
  nextCursor?: number;
}

export type CreateLevelDto = Omit<Levels, "id">;
export type UpdateLevelDto = Partial<CreateLevelDto>;