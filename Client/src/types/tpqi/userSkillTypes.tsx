export interface UserSkill {
    id: number;
    skillId: number;
    userId: number;
    evidenceUrl: string | null;
    approvalStatus: string | null
}

export interface UserSkillPageResult {
    data: UserSkill[];
    total?: number;
}

export type UpdateUserSkillDto = Omit<UserSkill, "id">