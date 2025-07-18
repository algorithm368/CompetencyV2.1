const BASE_API = import.meta.env.VITE_API_BASE_URL

// Enhanced error class for better error handling
class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response,
    public source?: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

// Type definitions based on server responses
export interface SfiaJobDetail {
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

export interface SfiaJobResponse {
  competency: SfiaJobDetail | null;
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
 * Enhanced fetch function with better error handling for SFIA job details
 */
async function fetchSfiaJobDetail(jobCode: string): Promise<SfiaJobResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const url = `${BASE_API}/api/sfia/skills/${encodeURIComponent(jobCode)}`;
    
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new APIError(
        `HTTP ${res.status}: ${res.statusText}`,
        res.status,
        res,
        "sfia"
      );
    }

    const apiResponse: ApiResponse<SfiaJobResponse> = await res.json();
    
    if (!apiResponse.success || !apiResponse.data) {
      throw new APIError(
        apiResponse.message || "Failed to get job details",
        res.status,
        res,
        "sfia"
      );
    }

    return apiResponse.data;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    // Handle different error types
    if (error instanceof APIError) {
      throw error;
    }

    if ((error as { name?: string }).name === "AbortError") {
      throw new APIError(`Request timeout for SFIA job ${jobCode}`, 0, undefined, "sfia");
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new APIError(
        `Network error when fetching SFIA job ${jobCode}`,
        0,
        undefined,
        "sfia"
      );
    }

    throw new APIError(
      `Failed to fetch SFIA job ${jobCode}: ${(error as { message?: string }).message || 'Unknown error'}`,
      0,
      undefined,
      "sfia"
    );
  }
}

/**
 * Enhanced fetch function with better error handling for TPQI unit details
 */
async function fetchTpqiUnitDetail(unitCode: string): Promise<TpqiUnitResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const url = `${BASE_API}/api/tpqi/unit-code-details/${encodeURIComponent(unitCode)}`;
    
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new APIError(
        `HTTP ${res.status}: ${res.statusText}`,
        res.status,
        res,
        "tpqi"
      );
    }

    const apiResponse: ApiResponse<TpqiUnitResponse> = await res.json();
    
    if (!apiResponse.success || !apiResponse.data) {
      throw new APIError(
        apiResponse.message || "Failed to get unit code details",
        res.status,
        res,
        "tpqi"
      );
    }

    return apiResponse.data;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    // Handle different error types
    if (error instanceof APIError) {
      throw error;
    }

    if ((error as { name?: string }).name === "AbortError") {
      throw new APIError(`Request timeout for TPQI unit ${unitCode}`, 0, undefined, "tpqi");
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new APIError(
        `Network error when fetching TPQI unit ${unitCode}`,
        0,
        undefined,
        "tpqi"
      );
    }

    throw new APIError(
      `Failed to fetch TPQI unit ${unitCode}: ${(error as { message?: string }).message || 'Unknown error'}`,
      0,
      undefined,
      "tpqi"
    );
  }
}

/**
 * Fetch SFIA job details by job code
 * @param jobCode - The SFIA job code (e.g., "PROG", "DBAD")
 * @returns Promise<SfiaJobResponse>
 */
export async function fetchSfiaJobDetailByCode(jobCode: string): Promise<SfiaJobResponse> {
  if (!jobCode.trim()) {
    throw new APIError("Job code cannot be empty");
  }

  try {
    return await fetchSfiaJobDetail(jobCode);
  } catch (error) {
    console.error(`[SFIA Job Detail] Failed to fetch job ${jobCode}:`, error);
    throw error;
  }
}

/**
 * Fetch TPQI unit code details by unit code
 * @param unitCode - The TPQI unit code (e.g., "ICT-LIGW-404B", "UNIT-123")
 * @returns Promise<TpqiUnitResponse>
 */
export async function fetchTpqiUnitDetailByCode(unitCode: string): Promise<TpqiUnitResponse> {
  if (!unitCode.trim()) {
    throw new APIError("Unit code cannot be empty");
  }

  try {
    return await fetchTpqiUnitDetail(unitCode);
  } catch (error) {
    console.error(`[TPQI Unit Detail] Failed to fetch unit ${unitCode}:`, error);
    throw error;
  }
}

/**
 * Generic function to fetch competency details based on source and code
 * @param source - Either "sfia" or "tpqi"
 * @param code - The competency code
 * @returns Promise<SfiaJobResponse | TpqiUnitResponse>
 */
export async function fetchCompetencyDetailByCode(
  source: "sfia" | "tpqi",
  code: string
): Promise<SfiaJobResponse | TpqiUnitResponse> {
  if (!code.trim()) {
    throw new APIError("Competency code cannot be empty");
  }

  if (source === "sfia") {
    return await fetchSfiaJobDetailByCode(code);
  } else if (source === "tpqi") {
    return await fetchTpqiUnitDetailByCode(code);
  } else {
    throw new APIError(`Invalid source: ${source}. Must be either 'sfia' or 'tpqi'`);
  }
}

/**
 * Fetch multiple competency details in parallel
 * @param requests - Array of { source, code } objects
 * @returns Promise<Array<{ source, code, data?, error? }>>
 */
export async function fetchMultipleCompetencyDetails(
  requests: Array<{ source: "sfia" | "tpqi"; code: string }>
): Promise<Array<{
  source: "sfia" | "tpqi";
  code: string;
  data?: SfiaJobResponse | TpqiUnitResponse;
  error?: APIError;
}>> {
  const promises = requests.map(async ({ source, code }) => {
    try {
      const data = await fetchCompetencyDetailByCode(source, code);
      return { source, code, data };
    } catch (error) {
      const apiError = error instanceof APIError 
        ? error 
        : new APIError(`Unknown error for ${source} ${code}`);
      console.error(`[${source.toUpperCase()}] Failed to fetch ${code}:`, error);
      return { source, code, error: apiError };
    }
  });

  return await Promise.all(promises);
}

// Utility function to check if error is network-related
export function isNetworkError(error: unknown): boolean {
  if (!error) {
    return false;
  }
  return (
    (error instanceof TypeError && error.message.includes("fetch")) ||
    (error as { name?: string }).name === "NetworkError" ||
    (error as { code?: string }).code === "NETWORK_ERROR" ||
    !!(error as { message?: string }).message?.toLowerCase().includes("network") ||
    !!(error as { message?: string }).message?.toLowerCase().includes("connection")
  );
}

// Utility function to check if error is timeout-related
export function isTimeoutError(error: unknown): boolean {
  if (!error) {
    return false;
  }
  return (
    (error as { name?: string }).name === "AbortError" ||
    (error as { name?: string }).name === "TimeoutError" ||
    !!(error as { message?: string }).message?.toLowerCase().includes("timeout")
  );
}

// Utility function to check if error is not found
export function isNotFoundError(error: unknown): boolean {
  if (!error) {
    return false;
  }
  return (
    error instanceof APIError && error.status === 404
  );
}

// Export the APIError class for use in other modules
export { APIError };
