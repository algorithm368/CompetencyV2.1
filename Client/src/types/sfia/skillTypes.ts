export interface Skill {
  code: string;
  name: string | null;
  overview: string | null;
  note: string | null;
  levelId?: number;
  categoryId?: number;
}

export interface SubSkill {
  id: number;
  text: string;
  skillCode?: string | null;
  descriptionId?: number;
}

export interface LevelRef {
  id: number;
  name: string;
}

export interface SkillPageResult {
  data: Array<Skill & { subSkills?: SubSkill[]; levels?: LevelRef[] }>;
  total?: number;
}

export type CreateSkillDto = Omit<Skill, "code">;

export type UpdateSkillDto = Partial<Skill>;
