import { ApiResponse } from "../../types/competency/ApiResponse";

/**
 * Interface for TPQI career summary data from the backend.
 */
export interface TpqiCareerSummary {
  id: number;
  careerId: number;
  careerName: string | null;
  levelId: number;
  levelName: string | null;
  careerLevelId: number;
  skillPercent: number | null;
  knowledgePercent: number | null;
}

/**
 * Interface for the overall TPQI summary statistics.
 */
export interface TpqiSummaryStats {
  totalCareers: number;
  averageSkillPercent: number;
  averageKnowledgePercent: number;
  completedCareers: number;
  careerSummaries: TpqiCareerSummary[];
}

/**
 * Extended API response for TPQI summary retrieval.
 */
export interface GetTpqiSummaryResponse extends ApiResponse {
  data?: TpqiSummaryStats;
}

/**
 * Service class for retrieving TPQI user summary.
 * Handles authenticated API requests and basic client-side validations.
 */
export class GetTpqiSummaryService {
  private readonly baseApiUrl: string;
  private readonly accessToken: string | null;

  /**
   * Creates an instance of GetTpqiSummaryService.
   *
   * @param baseApiUrl - The base URL of the backend API.
   * @param accessToken - The Bearer token for authenticated API access.
   */
  constructor(baseApiUrl: string, accessToken: string | null) {
    this.baseApiUrl = baseApiUrl;
    this.accessToken = accessToken;
  }

  /**
   * Retrieves the TPQI summary for the authenticated user.
   * Makes a GET request to the /api/tpqi/summary/user endpoint.
   *
   * @returns Promise<GetTpqiSummaryResponse> - The API response containing user's TPQI summary data
   * @throws Error if user is not authenticated or if the API request fails
   */
  async getUserSummary(): Promise<GetTpqiSummaryResponse> {
    // Validate authentication
    if (!this.accessToken) {
      throw new Error("User is not authenticated");
    }

    try {
      // Make API request to get user summary
      const response = await fetch(`${this.baseApiUrl}/api/tpqi/summary/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      // Parse response JSON
      let result: GetTpqiSummaryResponse;
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
      console.error("Error fetching TPQI summary:", error);
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
  hasSummaryData(response: GetTpqiSummaryResponse): boolean {
    return (
      response.success &&
      !!response.data &&
      Array.isArray(response.data.careerSummaries) &&
      response.data.careerSummaries.length > 0
    );
  }

  /**
   * Calculates additional statistics from the summary data.
   *
   * @param summaryData - The TPQI summary data
   * @returns Object containing calculated statistics
   */
  calculateAdditionalStats(summaryData: TpqiSummaryStats): {
    highPerformanceCareers: TpqiCareerSummary[];
    careersByLevel: Map<string, TpqiCareerSummary[]>;
    skillVsKnowledgeGap: TpqiCareerSummary[];
  } {
    const highPerformanceCareers = summaryData.careerSummaries.filter(
      (career) => 
        (career.skillPercent || 0) >= 80 && (career.knowledgePercent || 0) >= 80
    );

    const careersByLevel = new Map<string, TpqiCareerSummary[]>();
    summaryData.careerSummaries.forEach((career) => {
      const levelName = career.levelName || "Unknown";
      if (!careersByLevel.has(levelName)) {
        careersByLevel.set(levelName, []);
      }
      careersByLevel.get(levelName)!.push(career);
    });

    // Find careers with significant gap between skill and knowledge percentages
    const skillVsKnowledgeGap = summaryData.careerSummaries.filter((career) => {
      const skillPercent = career.skillPercent || 0;
      const knowledgePercent = career.knowledgePercent || 0;
      return Math.abs(skillPercent - knowledgePercent) >= 20;
    });

    return {
      highPerformanceCareers,
      careersByLevel,
      skillVsKnowledgeGap,
    };
  }

  /**
   * Formats the summary data for display purposes.
   *
   * @param summaryData - The raw TPQI summary data
   * @returns Formatted data ready for UI consumption
   */
  formatSummaryForDisplay(summaryData: TpqiSummaryStats): {
    formattedCareers: Array<{
      careerName: string;
      level: string;
      skillProgress: number;
      knowledgeProgress: number;
      skillProgressFormatted: string;
      knowledgeProgressFormatted: string;
      overallProgress: number;
      overallProgressFormatted: string;
    }>;
    overallSkillProgress: string;
    overallKnowledgeProgress: string;
    completionRate: string;
  } {
    const formattedCareers = summaryData.careerSummaries.map((career) => {
      const skillPercent = career.skillPercent || 0;
      const knowledgePercent = career.knowledgePercent || 0;
      const overallProgress = (skillPercent + knowledgePercent) / 2;

      return {
        careerName: career.careerName || "Unknown Career",
        level: career.levelName || "Unknown Level",
        skillProgress: skillPercent,
        knowledgeProgress: knowledgePercent,
        skillProgressFormatted: `${skillPercent}%`,
        knowledgeProgressFormatted: `${knowledgePercent}%`,
        overallProgress: Math.round(overallProgress * 100) / 100,
        overallProgressFormatted: `${Math.round(overallProgress * 100) / 100}%`,
      };
    });

    const overallSkillProgress = `${summaryData.averageSkillPercent}%`;
    const overallKnowledgeProgress = `${summaryData.averageKnowledgePercent}%`;
    const completionRate = `${summaryData.completedCareers}/${summaryData.totalCareers}`;

    return {
      formattedCareers,
      overallSkillProgress,
      overallKnowledgeProgress,
      completionRate,
    };
  }

  /**
   * Compares skill vs knowledge progress and provides insights.
   *
   * @param summaryData - The TPQI summary data
   * @returns Analysis of skill vs knowledge balance
   */
  analyzeSkillKnowledgeBalance(summaryData: TpqiSummaryStats): {
    overallBalance: "skill-heavy" | "knowledge-heavy" | "balanced";
    recommendedFocus: "skills" | "knowledge" | "maintain-balance";
    balanceScore: number; // -100 to 100, negative means skill-heavy, positive means knowledge-heavy
  } {
    const skillAvg = summaryData.averageSkillPercent;
    const knowledgeAvg = summaryData.averageKnowledgePercent;
    const difference = knowledgeAvg - skillAvg;
    const balanceScore = Math.round(difference * 100) / 100;

    let overallBalance: "skill-heavy" | "knowledge-heavy" | "balanced";
    let recommendedFocus: "skills" | "knowledge" | "maintain-balance";

    if (Math.abs(difference) <= 5) {
      overallBalance = "balanced";
      recommendedFocus = "maintain-balance";
    } else if (difference > 5) {
      overallBalance = "knowledge-heavy";
      recommendedFocus = "skills";
    } else {
      overallBalance = "skill-heavy";
      recommendedFocus = "knowledge";
    }

    return {
      overallBalance,
      recommendedFocus,
      balanceScore,
    };
  }
}
