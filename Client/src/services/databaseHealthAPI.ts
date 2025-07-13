import api from "@Services/api";

/**
 * Database Status Types
 */
export interface DatabaseStatus {
  status: "healthy" | "unhealthy" | "unknown";
  latency?: number;
  error?: string;
  lastCheck: string;
}

export interface DatabaseHealthResponse {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  databases: {
    sfia: DatabaseStatus;
    tpqi: DatabaseStatus;
    competency: DatabaseStatus;
  };
  summary: {
    total: number;
    healthy: number;
    unhealthy: number;
    unknown: number;
  };
}

export interface SystemHealthResponse {
  status: "healthy" | "unhealthy";
  timestamp: string;
  service: string;
  version: string;
}

/**
 * Database Health API Error Class
 */
export class DatabaseHealthError extends Error {
  constructor(
    message: string,
    public status?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = "DatabaseHealthError";
  }
}

/**
 * Database Health API Service
 * 
 * Provides methods to check system and database health status
 */

/**
 * Get basic system health status
 * @returns Promise<SystemHealthResponse>
 */
export async function getSystemHealth(): Promise<SystemHealthResponse> {
  try {
    const response = await api.get("/health");
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
    const status = axiosError.response?.status || 0;
    const message = axiosError.response?.data?.message || axiosError.message || "Failed to check system health";
    
    throw new DatabaseHealthError(message, status, error);
  }
}

/**
 * Get detailed database health status
 * @returns Promise<DatabaseHealthResponse>
 */
export async function getDatabaseHealth(): Promise<DatabaseHealthResponse> {
  try {
    const response = await api.get("/health/database");
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
    const status = axiosError.response?.status || 0;
    const message = axiosError.response?.data?.message || axiosError.message || "Failed to check database health";
    
    throw new DatabaseHealthError(message, status, error);
  }
}

/**
 * Check if a specific database is healthy
 * @param dbName - Name of the database (sfia, tpqi, competency)
 * @returns Promise<boolean>
 */
export async function isDatabaseHealthy(dbName: keyof DatabaseHealthResponse['databases']): Promise<boolean> {
  try {
    const health = await getDatabaseHealth();
    return health.databases[dbName]?.status === "healthy";
  } catch (error) {
    console.error(`Failed to check ${dbName} database health:`, error);
    return false;
  }
}

/**
 * Get a simplified health status
 * @returns Promise<"healthy" | "degraded" | "unhealthy">
 */
export async function getOverallHealthStatus(): Promise<"healthy" | "degraded" | "unhealthy"> {
  try {
    const health = await getDatabaseHealth();
    return health.status;
  } catch (error) {
    console.error("Failed to get overall health status:", error);
    return "unhealthy";
  }
}

/**
 * Utility function to check if error is network-related
 */
export function isNetworkError(error: unknown): boolean {
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

/**
 * Utility function to check if error is timeout-related
 */
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
