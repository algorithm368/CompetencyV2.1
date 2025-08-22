import { ApiResponse } from "../../types/competency/ApiResponse";
import api from "@Services/api";
/**
 * Interface for SFIA skill summary data from the backend.
 */
export interface SfiaSkillSummary {
  id: number;
  skillCode: string;
  skillName: string; // Changed from nested structure to direct property
  categoryName: string; // Changed from nested structure to direct property
  levelId: number;
  levelName: string; // Changed from nested structure to direct property
  skillPercent: number;
}

/**
 * Interface for the overall SFIA summary statistics.
 */
export interface SfiaSummaryStats {
  totalSkills: number;
  averagePercent: number; // Changed from avgSkillPercent to match API
  completedSkills: number;
  skillSummaries: SfiaSkillSummary[]; // Changed from skills to skillSummaries to match API
}

/**
 * Extended API response for SFIA summary retrieval.
 */
export interface GetSfiaSummaryResponse extends ApiResponse {
  data?: SfiaSummaryStats;
}

/**
 * Service class for retrieving SFIA user summary.
 * Handles authenticated API requests and basic client-side validations.
 */
export class GetSfiaSummaryService {
  /**
   * Creates an instance of GetSfiaSummaryService.
   *
   * @param baseApiUrl - The base URL of the backend API.
   * @param accessToken - The Bearer token for authenticated API access.
   */
  constructor() {}

  /**
   * Retrieves the SFIA summary for the authenticated user.
   * Makes a GET request to the /api/sfia/summary/user endpoint.
   *
   * @returns Promise<GetSfiaSummaryResponse> - The API response containing user's SFIA summary data
   * @throws Error if user is not authenticated or if the API request fails
   */
  async getUserSummary(): Promise<GetSfiaSummaryResponse> {
    try {
      const response = await api.get<GetSfiaSummaryResponse>("/sfia/summary/user");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching SFIA summary:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch SFIA summary");
    }
  }

  /**
   * Validates the service configuration.
   *
   * @returns Object containing validation result and potential error message
   */
  validateServiceConfig(): {
    isValid: boolean;
    error?: string;
  } {
    // If all validations pass, return valid
    return {
      isValid: true,
    };
  }

  /**
   * Checks if the response contains valid summary data.
   *
   * @param response - The API response to validate
   * @returns boolean indicating if the response has valid data
   */
  hasSummaryData(response: GetSfiaSummaryResponse): boolean {
    return response.success && !!response.data && Array.isArray(response.data.skillSummaries) && response.data.skillSummaries.length > 0;
  }

  /**
   * Calculates additional statistics from the summary data.
   *
   * @param summaryData - The SFIA summary data
   * @returns Object containing calculated statistics
   */
  calculateAdditionalStats(summaryData: SfiaSummaryStats): {
    highPerformanceSkills: SfiaSkillSummary[];
    skillsByCategory: Map<string, SfiaSkillSummary[]>;
    averageByLevel: Map<string, number>;
  } {
    const highPerformanceSkills = summaryData.skillSummaries.filter((skill) => skill.skillPercent >= 80);

    const skillsByCategory = new Map<string, SfiaSkillSummary[]>();
    summaryData.skillSummaries.forEach((skill) => {
      const categoryName = skill.categoryName;
      if (!skillsByCategory.has(categoryName)) {
        skillsByCategory.set(categoryName, []);
      }
      skillsByCategory.get(categoryName)!.push(skill);
    });

    const averageByLevel = new Map<string, number>();
    const levelGroups = new Map<string, number[]>();

    summaryData.skillSummaries.forEach((skill) => {
      const levelName = skill.levelName;
      if (!levelGroups.has(levelName)) {
        levelGroups.set(levelName, []);
      }
      levelGroups.get(levelName)!.push(skill.skillPercent);
    });

    levelGroups.forEach((percentages, levelName) => {
      const average = percentages.reduce((sum, percent) => sum + percent, 0) / percentages.length;
      averageByLevel.set(levelName, Math.round(average * 100) / 100);
    });

    return {
      highPerformanceSkills,
      skillsByCategory,
      averageByLevel,
    };
  }

  /**
   * Formats the summary data for display purposes.
   *
   * @param summaryData - The raw SFIA summary data
   * @returns Formatted data ready for UI consumption
   */
  formatSummaryForDisplay(summaryData: SfiaSummaryStats): {
    formattedSkills: Array<{
      skillCode: string;
      skillName: string;
      category: string;
      level: string;
      progress: number;
      progressFormatted: string;
    }>;
    overallProgress: string;
    completionRate: string;
  } {
    const formattedSkills = summaryData.skillSummaries.map((skill) => ({
      skillCode: skill.skillCode,
      skillName: skill.skillName,
      category: skill.categoryName,
      level: skill.levelName,
      progress: skill.skillPercent,
      progressFormatted: `${skill.skillPercent}%`,
    }));

    const overallProgress = `${summaryData.averagePercent}%`;
    const completionRate = `${summaryData.completedSkills}/${summaryData.totalSkills}`;

    return {
      formattedSkills,
      overallProgress,
      completionRate,
    };
  }
}
