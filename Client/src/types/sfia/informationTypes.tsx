export enum InformationApprovalStatus {
  approved = "approved",
  not_approved = "not_approved",
}

export interface Information {
  id: number;
  info_text?: string | null;
  skill_id?: number | null;
  datacollection_id?: number | null;
  date: string; // ISO timestamp
  approval_status: InformationApprovalStatus;
}
