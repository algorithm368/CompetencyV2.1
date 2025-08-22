import { AxiosResponse } from "axios";
import { ApiResponse } from "../types/ApiResponse";
import api from "@Services/api";

/**
 * Request interface for getting SFIA evidence.
 */
export interface GetEvidenceRequest {
  skillCode: string;
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
 */
export class GetSfiaEvidenceService {
  async getEvidence(request: GetEvidenceRequest): Promise<GetEvidenceResponse> {
    try {
      const response: AxiosResponse<GetEvidenceResponse> = await api.post("/sfia/evidence/get", request);

      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Unknown error";
      throw new Error(message);
    }
  }

  validateGetEvidenceRequest(
    skillCode: string,
    userId: string
  ): {
    isValid: boolean;
    error?: string;
  } {
    if (!skillCode || skillCode.trim() === "") {
      return {
        isValid: false,
        error: "Skill code is required",
      };
    }

    if (!userId || userId.trim() === "") {
      return {
        isValid: false,
        error: "User ID is required",
      };
    }

    return { isValid: true };
  }

  hasEvidenceData(response: GetEvidenceResponse): boolean {
    return response.success && !!response.data;
  }
}
