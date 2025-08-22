import api from "@Services/api";
import { AxiosError } from "axios";
import { ApiResponse } from "../types/sfia";

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
  async getEvidence(request: GetEvidenceRequest): Promise<GetEvidenceResponse> {
    try {
      const response = await api.post<GetEvidenceResponse>("/sfia/evidence/get", request);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<GetEvidenceResponse>;
      const errData = axiosError.response?.data;
      throw new Error((errData && "message" in errData ? errData.message : undefined) || axiosError.message || "Failed to retrieve evidence");
    }
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
