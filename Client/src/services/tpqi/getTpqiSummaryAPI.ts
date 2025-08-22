import { ApiResponse } from "../../types/competency/ApiResponse";
import api from "@Services/api";
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
  /**
   * Retrieves the TPQI summary for the authenticated user.
   * Makes a GET request to the /api/tpqi/summary/user endpoint.
   *
   * @returns Promise<GetTpqiSummaryResponse> - The API response containing user's TPQI summary data
   * @throws Error if user is not authenticated or if the API request fails
   */
  async getUserSummary(): Promise<GetTpqiSummaryResponse> {
    try {
      const { data } = await api.get<GetTpqiSummaryResponse>("/sfia/summary/user", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!data.success) {
        throw new Error(data.message || "Failed to retrieve SFIA summary");
      }

      return data;
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
    return response.success && !!response.data && Array.isArray(response.data.careerSummaries) && response.data.careerSummaries.length > 0;
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
    const highPerformanceCareers = summaryData.careerSummaries.filter((career) => (career.skillPercent || 0) >= 80 && (career.knowledgePercent || 0) >= 80);

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
