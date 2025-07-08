import type { JobResponse } from "../types/jobTypes";

const BASE_API = import.meta.env.VITE_SEARCH_API;

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

// Enhanced fetch function with better error handling
async function fetchFromSource(
  dbType: "sfia" | "tpqi",
  searchTerm: string
): Promise<JobResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const res = await fetch(`${BASE_API}/${dbType}/search`, {
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

    // *** CHANGE STARTS HERE ***
    // Assuming data.results is an array of { name: string, id: string }
    // Ensure that `jobs` directly holds the structured objects.
    const jobs: Array<{ name: string; id: string }> = Array.isArray(
      data.results
    )
      ? data.results.map((item: any) => ({
          name: item.name,
          id: item.id,
        }))
      : [];
    // *** CHANGE ENDS HERE ***

    return { source: dbType, jobs };
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle different error types
    if (error instanceof APIError) {
      throw error;
    }

    if (error.name === "AbortError") {
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
      `Failed to fetch from ${dbType}: ${error.message}`,
      0,
      undefined,
      dbType
    );
  }
}

export async function fetchJobsBySearchTerm(
  searchTerm: string
): Promise<JobResponse[]> {
  if (!searchTerm.trim()) {
    throw new APIError("Search term cannot be empty");
  }

  const dbTypes: ("sfia" | "tpqi")[] = ["sfia", "tpqi"];
  const results: JobResponse[] = [];
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
        data: { source: dbType, jobs: [] },
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

// Alternative version that throws on any error (stricter)
export async function fetchJobsBySearchTermStrict(
  searchTerm: string
): Promise<JobResponse[]> {
  if (!searchTerm.trim()) {
    throw new APIError("Search term cannot be empty");
  }

  const dbTypes: ("sfia" | "tpqi")[] = ["sfia", "tpqi"];

  try {
    const promises = dbTypes.map((dbType) =>
      fetchFromSource(dbType, searchTerm)
    );
    return await Promise.all(promises);
  } catch (error) {
    // Re-throw the error to be handled by the hook
    throw error;
  }
}

// Utility function to check if error is network-related
export function isNetworkError(error: any): boolean {
  // Add a guard clause to handle null/undefined inputs
  if (!error) {
    return false;
  }
  return (
    (error instanceof TypeError && error.message.includes("fetch")) ||
    error.name === "NetworkError" ||
    error.code === "NETWORK_ERROR" ||
    !!error.message?.toLowerCase().includes("network") ||
    !!error.message?.toLowerCase().includes("connection")
  );
}

// Utility function to check if error is timeout-related
export function isTimeoutError(error: any): boolean {
  if (!error) {
    return false;
  }
  return (
    error.name === "AbortError" ||
    error.name === "TimeoutError" ||
    // FIX: Ensure this line includes .toLowerCase() for a case-insensitive check.
    !!error.message?.toLowerCase().includes("timeout")
  );
}
