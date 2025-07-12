import type { CompetencyResponse } from "../types/CompetencyTypes";

const BASE_API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const COMPETENCY_API = `${BASE_API}/api/competency/search`;

// Enhanced error class for better error handling
export class APIError extends Error {
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

// Interface for competency item
interface CompetencyItem {
  name: string;
  id: string;
}

// Enhanced fetch function with better error handling
async function fetchFromSource(
  dbType: "sfia" | "tpqi",
  searchTerm: string
): Promise<CompetencyResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const res = await fetch(`${COMPETENCY_API}/${dbType}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ searchTerm }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new APIError(
        `HTTP ${res.status}: ${res.statusText}`,
        res.status,
        res,
        dbType
      );
    }

    const data = await res.json();

    // Server returns { results: array } for POST requests
    const Competencies: Array<{ name: string; id: string }> = Array.isArray(
      data.results
    )
      ? data.results.map((item: CompetencyItem) => ({
          name: item.name,
          id: item.id,
        }))
      : [];

    return { source: dbType, Competencies };
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle different error types
    if (error instanceof APIError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new APIError(`Request timeout for ${dbType}`, 0, undefined, dbType);
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new APIError(
        `Network error when fetching from ${dbType}`,
        0,
        undefined,
        dbType
      );
    }

    throw new APIError(
      `Failed to fetch from ${dbType}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      undefined,
      dbType
    );
  }
}

export async function fetchCompetenciesBySearchTerm(
  searchTerm: string
): Promise<CompetencyResponse[]> {
  if (!searchTerm.trim()) {
    throw new APIError("Search term cannot be empty");
  }

  const dbTypes: ("sfia" | "tpqi")[] = ["sfia", "tpqi"];
  const results: CompetencyResponse[] = [];
  const errors: APIError[] = [];

  const promises = dbTypes.map(async (dbType) => {
    try {
      const result = await fetchFromSource(dbType, searchTerm);
      return { success: true, data: result, error: null };
    } catch (error) {
      // FIX: Ensure console.error is called with the correct parameters
      console.error(`[${dbType}]`, error);
      return {
        success: false,
        data: { source: dbType, Competencies: [] },
        error:
          error instanceof APIError
            ? error
            : new APIError(`Unknown error from ${dbType}`),
      };
    }
  });

  const responses = await Promise.all(promises);

  // Process responses
  responses.forEach((response) => {
    if (response.success) {
      results.push(response.data);
    } else {
      results.push(response.data);
      if (response.error) {
        errors.push(response.error);
      }
    }
  });

  // If all sources failed, log error but return empty results instead of throwing
  if (errors.length === dbTypes.length) {
    console.error(
      `All sources failed:`,
      errors.map((e) => e.message)
    );
    // Return empty results for all sources instead of throwing
    return results;
  }

  // If some sources failed but we have results, log warnings but continue
  if (errors.length > 0) {
    console.warn(
      `Some sources failed:`,
      errors.map((e) => e.message)
    );
  }

  return results;
}

// Alternative version that throws on any error (stricter)
export async function fetchCompetenciesBySearchTermStrict(
  searchTerm: string
): Promise<CompetencyResponse[]> {
  if (!searchTerm.trim()) {
    throw new APIError("Search term cannot be empty");
  }

  const dbTypes: ("sfia" | "tpqi")[] = ["sfia", "tpqi"];
  const promises = dbTypes.map((dbType) =>
    fetchFromSource(dbType, searchTerm)
  );
  return await Promise.all(promises);
}

// Function to get all competencies from a specific database
export async function getAllCompetencies(
  dbType: "sfia" | "tpqi"
): Promise<CompetencyResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const res = await fetch(`${COMPETENCY_API}/${dbType}`, {
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
        dbType
      );
    }

    const data = await res.json();

    // Server returns { Competencies: array } for GET requests
    const Competencies: Array<{ name: string; id: string }> = Array.isArray(
      data.Competencies
    )
      ? data.Competencies.map((item: CompetencyItem) => ({
          name: item.name,
          id: item.id,
        }))
      : [];

    return { source: dbType, Competencies };
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle different error types
    if (error instanceof APIError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new APIError(`Request timeout for ${dbType}`, 0, undefined, dbType);
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new APIError(
        `Network error when fetching from ${dbType}`,
        0,
        undefined,
        dbType
      );
    }

    throw new APIError(
      `Failed to fetch from ${dbType}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      undefined,
      dbType
    );
  }
}

// Function to get all competencies from all databases
export async function getAllCompetenciesFromAllSources(): Promise<CompetencyResponse[]> {
  const dbTypes: ("sfia" | "tpqi")[] = ["sfia", "tpqi"];
  const results: CompetencyResponse[] = [];
  const errors: APIError[] = [];

  const promises = dbTypes.map(async (dbType) => {
    try {
      const result = await getAllCompetencies(dbType);
      return { success: true, data: result, error: null };
    } catch (error) {
      console.error(`[${dbType}]`, error);
      return {
        success: false,
        data: { source: dbType, Competencies: [] },
        error:
          error instanceof APIError
            ? error
            : new APIError(`Unknown error from ${dbType}`),
      };
    }
  });

  const responses = await Promise.all(promises);

  // Process responses
  responses.forEach((response) => {
    if (response.success) {
      results.push(response.data);
    } else {
      results.push(response.data);
      if (response.error) {
        errors.push(response.error);
      }
    }
  });

  // If all sources failed, throw the first error
  if (errors.length === dbTypes.length) {
    throw errors[0];
  }

  // If some sources failed but we have results, log warnings but continue
  if (errors.length > 0) {
    console.warn(
      `Some sources failed:`,
      errors.map((e) => e.message)
    );
  }

  return results;
}

// Utility function to check if error is network-related
export function isNetworkError(error: unknown): boolean {
  // Add a guard clause to handle null/undefined inputs
  if (!error || typeof error !== "object") {
    return false;
  }
  
  const err = error as Record<string, unknown>;
  return (
    (error instanceof TypeError && error.message.includes("fetch")) ||
    err.name === "NetworkError" ||
    err.code === "NETWORK_ERROR" ||
    !!(err.message as string)?.toLowerCase().includes("network") ||
    !!(err.message as string)?.toLowerCase().includes("connection")
  );
}

// Utility function to check if error is timeout-related
export function isTimeoutError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }
  
  const err = error as Record<string, unknown>;
  const message = (err.message as string)?.toLowerCase() || "";
  
  return (
    err.name === "AbortError" ||
    err.name === "TimeoutError" ||
    message.includes("timed out") ||
    (message.includes("timeout") && !message.includes("not a timeout"))
  );
}
