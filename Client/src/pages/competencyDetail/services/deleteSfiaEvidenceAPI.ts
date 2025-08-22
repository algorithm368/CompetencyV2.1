import { AxiosResponse } from "axios";
import api from "@Services/api";

// Types for the delete evidence request and response
export interface DeleteEvidenceRequest {
  subSkillId: number;
}

export interface DeleteEvidenceResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    text: string | null;
    subSkillId: number | null;
    dataCollectionId: number | null;
    evidenceUrl: string | null;
    createdAt: string;
    approvalStatus: string;
  };
}

/**
 * Service class for deleting SFIA evidence from the server.
 * Handles API communication for evidence deletion operations.
 */
export class DeleteSfiaEvidenceService {
  /**
   * Deletes evidence for a specific subskill.
   *
   * @param {DeleteEvidenceRequest} request - The delete request containing subSkillId
   * @returns {Promise<DeleteEvidenceResponse>} Promise that resolves to the deletion response
   */
  async deleteEvidence(request: DeleteEvidenceRequest): Promise<DeleteEvidenceResponse> {
    this.validateRequest(request);

    try {
      const response: AxiosResponse<DeleteEvidenceResponse> = await api.delete(`/sfia/evidence/delete`, {
        data: {
          subSkillId: request.subSkillId,
        },
      });

      return response.data;
    } catch (error) {
      if (api.isAxiosError?.(error)) {
        if (error.response?.status === 401) {
          throw new Error("Unauthorized: Please log in again");
        }
        if (error.response?.status === 404) {
          throw new Error("Evidence not found or already deleted");
        }
        if (error.response?.status === 403) {
          throw new Error("Forbidden: You don't have permission to delete this evidence");
        }

        const errorMessage = (error.response?.data as { message?: string })?.message || error.message;
        throw new Error(`Failed to delete evidence: ${errorMessage}`);
      }

      throw new Error("Network error: Unable to connect to the server");
    }
  }

  /**
   * Validates the delete request parameters.
   *
   * @param {DeleteEvidenceRequest} request - The request to validate
   * @returns {boolean} True if valid, throws error if invalid
   */
  private validateRequest(request: DeleteEvidenceRequest): boolean {
    if (!request.subSkillId || typeof request.subSkillId !== "number") {
      throw new Error("SubSkill ID is required and must be a number");
    }

    if (request.subSkillId <= 0) {
      throw new Error("SubSkill ID must be a positive number");
    }

    return true;
  }
}

/**
 * Factory function to create a DeleteSfiaEvidenceService instance.
 */
export const createDeleteSfiaEvidenceService = (): DeleteSfiaEvidenceService => {
  return new DeleteSfiaEvidenceService();
};
