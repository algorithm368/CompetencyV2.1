import { ApiResponse } from "../../types/competency/ApiResponse";

/**
 * Interface for SFIA skill summary data from the backend.
 */
export interface SfiaSkillSummary {
  id: number;
  skillCode: string;
  skillName: string;  // Changed from nested structure to direct property
  categoryName: string;  // Changed from nested structure to direct property
  levelId: number;
  levelName: string;  // Changed from nested structure to direct property
  skillPercent: number;
}

/**
 * Interface for the overall SFIA summary statistics.
 */
export interface SfiaSummaryStats {
  totalSkills: number;
  averagePercent: number;  // Changed from avgSkillPercent to match API
  completedSkills: number;
  skillSummaries: SfiaSkillSummary[];  // Changed from skills to skillSummaries to match API
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
  private readonly baseApiUrl: string;
  private readonly accessToken: string | null;

  /**
   * Creates an instance of GetSfiaSummaryService.
   *
   * @param baseApiUrl - The base URL of the backend API.
   * @param accessToken - The Bearer token for authenticated API access.
   */
  constructor(baseApiUrl: string, accessToken: string | null) {
    this.baseApiUrl = baseApiUrl;
    this.accessToken = accessToken;
  }

  /**
   * Retrieves the SFIA summary for the authenticated user.
   * Makes a GET request to the /api/sfia/summary/user endpoint.
   *
   * @returns Promise<GetSfiaSummaryResponse> - The API response containing user's SFIA summary data
   * @throws Error if user is not authenticated or if the API request fails
   */
  async getUserSummary(): Promise<GetSfiaSummaryResponse> {
    // Validate authentication
    if (!this.accessToken) {
      throw new Error("User is not authenticated");
    }

    try {
      // Make API request to get user summary
      const response = await fetch(`${this.baseApiUrl}/api/sfia/summary/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      // Parse response JSON
      let result: GetSfiaSummaryResponse;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error("Error parsing response JSON:", parseError);
        throw new Error("Failed to parse API response");
      }

      // Handle non-200 responses
      if (!response.ok) {
        throw new Error(
          result.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return result;
    } catch (error) {
      console.error("Error fetching SFIA summary:", error);
      throw error;
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
    // Check if base API URL is provided
    if (!this.baseApiUrl || this.baseApiUrl.trim() === "") {
      return {
        isValid: false,
        error: "Base API URL is required",
      };
    }

    // Check if access token is provided
    if (!this.accessToken || this.accessToken.trim() === "") {
      return {
        isValid: false,
        error: "Access token is required for authentication",
      };
    }

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
    return (
      response.success &&
      !!response.data &&
      Array.isArray(response.data.skillSummaries) &&
      response.data.skillSummaries.length > 0
    );
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
    const highPerformanceSkills = summaryData.skillSummaries.filter(
      (skill) => skill.skillPercent >= 80
    );

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
