import { SfiaSkillResponse, TpqiUnitResponse, APIError } from "../services/competencyDetailAPI";

// Types for the hook
export interface CompetencyDetailState {
  data: SfiaSkillResponse | TpqiUnitResponse | null;
  loading: boolean;
  error: APIError | null;
  lastFetched: Date | null;
}

export interface MultipleCompetencyDetailState {
  results: Array<{
    source: "sfia" | "tpqi";
    code: string;
    data?: SfiaSkillResponse | TpqiUnitResponse;
    error?: APIError;
  }>;
  loading: boolean;
  error: APIError | null;
  totalRequests: number;
  completedRequests: number;
}

export interface UseCompetencyDetailOptions {
  // Cache duration in milliseconds (default: 5 minutes)
  cacheDuration?: number;
  // Maximum retry attempts on failure (default: 3)
  maxRetries?: number;
  // Retry delay in milliseconds (default: 1000ms)
  retryDelay?: number;
  // Auto-retry on network errors (default: true)
  autoRetryOnNetworkError?: boolean;
}

export const DEFAULT_OPTIONS: Required<UseCompetencyDetailOptions> = {
  cacheDuration: 5 * 60 * 1000, // 5 minutes
  maxRetries: 3,
  retryDelay: 1000,
  autoRetryOnNetworkError: true,
};

export type CompetencySource = "sfia" | "tpqi";

export interface CompetencyRequest {
  source: CompetencySource;
  code: string;
}

export interface CacheEntry {
  data: SfiaSkillResponse | TpqiUnitResponse;
  timestamp: number;
}
