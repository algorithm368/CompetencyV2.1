export interface ClKnowledge {
    id:number;
    careerLevelId:number;
    knowledgeId:number;
}

export interface ClKnowledgeView {
    id:number;
    careerLevelId:number;
    knowledgeId:number;
    careerLevel: {
        id:number;
        careerId:number;
        levelId:number;
    } | null;
    knowledge: {
        id:number;
        name:string | null;
    } | null;
}

export interface ClKnowledgePageResult {
    data:ClKnowledgeView[];
    total?:number;
}
export type CreateClKnowledgeDto = Omit<ClKnowledge, "id">;
export type UpdateClKnowledgeDto = Partial<CreateClKnowledgeDto>;