import api from "@Services/api";

// Enhanced error class for better error handling
class APIError extends Error {
  constructor(message: string, public status?: number, public response?: unknown, public source?: string) {
    super(message);
    this.name = "APIError";
  }
}

// Type definitions based on server responses
export interface SfiaSkillDetail {
  competency_id: string;
  competency_name: string | null;
  overall: string | null;
  note: string | null;
  category: {
    id: number;
    category_text: string | null;
  } | null;
  levels: Array<{
    id: number;
    level_name: string | null;
    descriptions: Array<{
      id: number;
      description_text: string | null;
      subskills: Array<{
        id: number;
        subskill_text: string | null;
      }>;
    }>;
  }>;
}

export interface SfiaSkillResponse {
  competency: SfiaSkillDetail | null;
  totalLevels: number;
  totalSkills: number;
}

export interface TpqiUnitDetail {
  competency_id: string;
  competency_name: string | null;
  overall: string | null;
  note: string | null;
  occupational: Array<{
    id: number;
    name_occupational: string;
  }>;
  sector: Array<{
    id: number;
    name_sector: string;
  }>;
  skills: Array<{
    id: number;
    name_skill: string;
  }>;
  knowledge: Array<{
    id: number;
    name_knowledge: string;
  }>;
}

export interface TpqiUnitResponse {
  competency: TpqiUnitDetail | null;
  totalSkills: number;
  totalKnowledge: number;
  totalOccupational: number;
  totalSector: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * Get SFIA skill details
 */
async function fetchSfiaSkillDetail(skillCode: string): Promise<SfiaSkillResponse> {
  try {
    const res = await api.get<ApiResponse<SfiaSkillResponse>>(`/sfia/skills/${encodeURIComponent(skillCode)}`, { timeout: 30000 });

    if (!res.data.success || !res.data.data) {
      throw new APIError(res.data.message || "Failed to get skill details", res.status, res, "sfia");
    }

    return res.data.data;
  } catch (error: any) {
    if (error.code === "ECONNABORTED") {
      throw new APIError(`Request timeout for SFIA skill ${skillCode}`, 0, undefined, "sfia");
    }
    if (error.response) {
      throw new APIError(`HTTP ${error.response.status}: ${error.response.statusText}`, error.response.status, error.response, "sfia");
    }
    throw new APIError(`Failed to fetch SFIA skill ${skillCode}: ${error.message || "Unknown error"}`, 0, undefined, "sfia");
  }
}

/**
 * Get TPQI unit details
 */
async function fetchTpqiUnitDetail(unitCode: string): Promise<TpqiUnitResponse> {
  try {
    const res = await api.get<ApiResponse<TpqiUnitResponse>>(`/tpqi/unitcodes/${encodeURIComponent(unitCode)}`, { timeout: 30000 });

    if (!res.data.success || !res.data.data) {
      throw new APIError(res.data.message || "Failed to get unit code details", res.status, res, "tpqi");
    }

    return res.data.data;
  } catch (error: any) {
    if (error.code === "ECONNABORTED") {
      throw new APIError(`Request timeout for TPQI unit ${unitCode}`, 0, undefined, "tpqi");
    }
    if (error.response) {
      throw new APIError(`HTTP ${error.response.status}: ${error.response.statusText}`, error.response.status, error.response, "tpqi");
    }
    throw new APIError(`Failed to fetch TPQI unit ${unitCode}: ${error.message || "Unknown error"}`, 0, undefined, "tpqi");
  }
}

export async function fetchSfiaSkillDetailByCode(skillCode: string): Promise<SfiaSkillResponse> {
  if (!skillCode.trim()) {
    throw new APIError("Skill code cannot be empty");
  }
  return fetchSfiaSkillDetail(skillCode);
}

export async function fetchTpqiUnitDetailByCode(unitCode: string): Promise<TpqiUnitResponse> {
  if (!unitCode.trim()) {
    throw new APIError("Unit code cannot be empty");
  }
  return fetchTpqiUnitDetail(unitCode);
}

export async function fetchCompetencyDetailByCode(source: "sfia" | "tpqi", code: string): Promise<SfiaSkillResponse | TpqiUnitResponse> {
  if (!code.trim()) {
    throw new APIError("Competency code cannot be empty");
  }
  if (source === "sfia") {
    return fetchSfiaSkillDetailByCode(code);
  } else if (source === "tpqi") {
    return fetchTpqiUnitDetailByCode(code);
  }
  throw new APIError(`Invalid source: ${source}. Must be either 'sfia' or 'tpqi'`);
}

export async function fetchMultipleCompetencyDetails(requests: Array<{ source: "sfia" | "tpqi"; code: string }>): Promise<
  Array<{
    source: "sfia" | "tpqi";
    code: string;
    data?: SfiaSkillResponse | TpqiUnitResponse;
    error?: APIError;
  }>
> {
  return Promise.all(
    requests.map(async ({ source, code }) => {
      try {
        const data = await fetchCompetencyDetailByCode(source, code);
        return { source, code, data };
      } catch (error) {
        const apiError = error instanceof APIError ? error : new APIError(`Unknown error for ${source} ${code}`);
        console.error(`[${source.toUpperCase()}] Failed to fetch ${code}:`, error);
        return { source, code, error: apiError };
      }
    })
  );
}

export function isNetworkError(error: unknown): boolean {
  if (!error) return false;
  return (
    (error as any).code === "ERR_NETWORK" ||
    !!(error as { message?: string }).message?.toLowerCase().includes("network") ||
    !!(error as { message?: string }).message?.toLowerCase().includes("connection")
  );
}

export function isTimeoutError(error: unknown): boolean {
  if (!error) return false;
  return (error as any).code === "ECONNABORTED" || !!(error as { message?: string }).message?.toLowerCase().includes("timeout");
}

export function isNotFoundError(error: unknown): boolean {
  if (!error) return false;
  return error instanceof APIError && error.status === 404;
}

export { APIError };
