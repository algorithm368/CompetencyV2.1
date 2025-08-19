import axios, { AxiosResponse } from "axios";

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
  private baseURL: string;
  private accessToken: string;

  /**
   * Creates an instance of DeleteSfiaEvidenceService.
   *
   * @param {string} baseURL - The base URL of the API server
   * @param {string} accessToken - The JWT access token for authentication
   */
  constructor(baseURL: string, accessToken: string) {
    this.baseURL = baseURL;
    this.accessToken = accessToken;
  }

  /**
   * Deletes evidence for a specific subskill.
   *
   * @param {DeleteEvidenceRequest} request - The delete request containing subSkillId
   * @returns {Promise<DeleteEvidenceResponse>} Promise that resolves to the deletion response
   *
   * @throws {Error} When the API request fails or returns an error
   *
   * @example
   * ```typescript
   * const deleteService = new DeleteSfiaEvidenceService(baseURL, token);
   * try {
   *   const result = await deleteService.deleteEvidence({ subSkillId: 123 });
   *   if (result.success) {
   *     console.log('Evidence deleted successfully');
   *   }
   * } catch (error) {
   *   console.error('Failed to delete evidence:', error);
   * }
   * ```
   */
  async deleteEvidence(
    request: DeleteEvidenceRequest
  ): Promise<DeleteEvidenceResponse> {
    try {
      const response: AxiosResponse<DeleteEvidenceResponse> =
        await axios.delete(`${this.baseURL}/api/sfia/evidence/delete`, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          data: {
            subSkillId: request.subSkillId,
          },
        });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle specific HTTP error responses
        if (error.response?.status === 401) {
          throw new Error("Unauthorized: Please log in again");
        }
        if (error.response?.status === 404) {
          throw new Error("Evidence not found or already deleted");
        }
        if (error.response?.status === 403) {
          throw new Error(
            "Forbidden: You don't have permission to delete this evidence"
          );
        }

        // Handle other server errors
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(`Failed to delete evidence: ${errorMessage}`);
      }

      // Handle network or other errors
      throw new Error("Network error: Unable to connect to the server");
    }
  }

  /**
   * Validates the delete request parameters.
   *
   * @param {DeleteEvidenceRequest} request - The request to validate
   * @returns {boolean} True if valid, throws error if invalid
   *
   * @throws {Error} When validation fails
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
 *
 * @param {string} baseURL - The base URL of the API server
 * @param {string} accessToken - The JWT access token for authentication
 * @returns {DeleteSfiaEvidenceService} A new service instance
 */
export const createDeleteSfiaEvidenceService = (
  baseURL: string,
  accessToken: string
): DeleteSfiaEvidenceService => {
  return new DeleteSfiaEvidenceService(baseURL, accessToken);
};
