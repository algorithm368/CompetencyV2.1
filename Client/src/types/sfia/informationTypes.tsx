export enum InformationApprovalStatus {
  APPROVED = "APPROVED",
  NOT_APPROVED = "NOT_APPROVED",
}

export interface Information {
  id: number;
  text?: string | null;
  subSkillId?: number | null;
  dataCollectionId?: number | null;
  createdAt: string; // ISO timestamp
  approvalStatus: InformationApprovalStatus;
}
