export interface SfiaSubSkill {
  id: number;
  subskill_text: string | null;
}

export interface SfiaDescription {
  id: number;
  description_text: string | null;
  subskills: SfiaSubSkill[];
}

export interface SfiaLevel {
id: number;
  level_name: string | null;
  descriptions: SfiaDescription[];
}

export interface SubmitEvidenceRequest {
  subSkillId: number;
  evidenceText: string;
  evidenceUrl?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface EvidenceState {
  urls: { [id: string]: string };
  submitted: { [id: string]: boolean };
  loading: { [id: string]: boolean };
  errors: { [id: string]: string };
}
