import { ApiResponse } from "../types/ApiResponse";

/**
 * Request interface for getting SFIA evidence.
 * Contains the skill code and user ID for which evidence is requested.
 */
export interface GetEvidenceRequest {
  skillCode: string;
  userId: string;
}

/**
 * Response interface for SFIA evidence retrieval.
 */
export interface EvidenceData {
  id: string;
  skillCode: string;
  userId: string;
  evidences: string[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Extended API response for SFIA evidence retrieval.
 */
export interface GetEvidenceResponse extends ApiResponse {
  data?: EvidenceData;
}

/**
 * Service class for retrieving SFIA evidence.
 * Handles authenticated API requests and basic client-side validations.
 */
export class GetSfiaEvidenceService {
  private readonly baseApiUrl: string;
  private readonly accessToken: string | null;

  /**
   * Creates an instance of GetSfiaEvidenceService.
   *
   * @param baseApiUrl - The base URL of the backend API.
   * @param accessToken - The Bearer token for authenticated API access.
   */
  constructor(baseApiUrl: string, accessToken: string | null) {
    this.baseApiUrl = baseApiUrl;
    this.accessToken = accessToken;
  }

  async getEvidence(request: GetEvidenceRequest): Promise<GetEvidenceResponse> {
    // Validate request parameters
    if (!this.accessToken) {
      throw new Error("User is not authenticated");
    }

    // request evidence data from the backend API
    const response = await fetch(`${this.baseApiUrl}/api/sfia/evidence/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify(request),
    });

    // result handling
    let result;

    // Attempt to parse the response JSON
    try {
      result = await response.json();
    } catch (e) {
      console.error("Error parsing response JSON:", e);
      result = {
        success: false,
        message: "Failed to parse response",
      };
    }

    // Handle non-200 responses
    if (!response.ok) {
      throw new Error(
        result.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return result;
  }

  validateGetEvidenceRequest(
    skillCode: string,
    userId: string
  ): {
    isValid: boolean;
    error?: string;
  } {
    // Basic validation for the request parameters1
    if (!skillCode || skillCode.trim() === "") {
      return {
        isValid: false,
        error: "Skill code is required",
      };
    }

    // Check if userId is provided
    if (!userId || userId.trim() === "") {
      return {
        isValid: false,
        error: "User ID is required",
      };
    }

    // If all validations pass, return valid
    return {
      isValid: true,
    };
  }

  // Checks if the response contains evidence data
  hasEvidenceData(response: GetEvidenceResponse): boolean {
    return response.success && !!response.data;
  }
}
