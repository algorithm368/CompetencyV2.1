export interface Skill {
  code: string;               // ACIN, DESN, etc.
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

export type CreateSkillDto = Omit<Skill, "subSkills"> & {
  // For create: no id on subskills
  subSkills?: Omit<SubSkill, "id">[];
};

export type UpdateSkillDto = Partial<Omit<Skill, "subSkills">> & {
  subSkills?: (Omit<SubSkill, "id"> | SubSkill)[];
};
