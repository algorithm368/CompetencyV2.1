export interface UserKnowledge {
    id: number;
    knowledgeId: number;
    userId: number;
    evidenceUrl: string | null;
    approvalStatus: string | null
}

export interface UserKnowledgePageResult {
    data: UserKnowledge[];
    total?: number;
}

export type UpdateUserKnowledgeDto = Omit<UserKnowledge, "id">