import axios, { AxiosResponse } from "axios";

// Types for the delete evidence request and response
export interface DeleteKnowledgeEvidenceRequest {
  knowledgeId: number;
}

export interface DeleteSkillEvidenceRequest {
  skillId: number;
}

export interface DeleteTpqiEvidenceRequest {
  evidenceType: "knowledge" | "skill";
  evidenceId: number;
}

export interface DeleteTpqiEvidenceResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    userId: string;
    knowledgeId?: number;
    skillId?: number;
    evidenceUrl: string | null;
    approvalStatus: string;
  };
}

/**
 * Service class for deleting TPQI evidence from the server.
 * Handles API communication for both knowledge and skill evidence deletion operations.
 */
export class DeleteTpqiEvidenceService {
  private readonly baseURL: string;
  private readonly accessToken: string;

  /**
   * Creates an instance of DeleteTpqiEvidenceService.
   *
   * @param {string} baseURL - The base URL of the API server
   * @param {string} accessToken - The JWT access token for authentication
   */
  constructor(baseURL: string, accessToken: string) {
    this.baseURL = baseURL;
    this.accessToken = accessToken;
  }

  /**
   * Deletes knowledge evidence for a specific knowledge ID.
   *
   * @param {DeleteKnowledgeEvidenceRequest} request - The delete request containing knowledgeId
   * @returns {Promise<DeleteTpqiEvidenceResponse>} Promise that resolves to the deletion response
   *
   * @throws {Error} When the API request fails or returns an error
   *
   * @example
   * ```typescript
   * const deleteService = new DeleteTpqiEvidenceService(baseURL, token);
   * try {
   *   const result = await deleteService.deleteKnowledgeEvidence({ knowledgeId: 123 });
   *   if (result.success) {
   *     console.log('Knowledge evidence deleted successfully');
   *   }
   * } catch (error) {
   *   console.error('Failed to delete knowledge evidence:', error);
   * }
   * ```
   */
  async deleteKnowledgeEvidence(
    request: DeleteKnowledgeEvidenceRequest
  ): Promise<DeleteTpqiEvidenceResponse> {
    try {
      const response: AxiosResponse<DeleteTpqiEvidenceResponse> =
        await axios.delete(
          `${this.baseURL}/api/tpqi/evidence/knowledge/delete`,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
              "Content-Type": "application/json",
            },
            data: {
              knowledgeId: request.knowledgeId,
            },
          }
        );

      return response.data;
    } catch (error) {
      return this.handleError(error, "knowledge evidence");
    }
  }

  /**
   * Deletes skill evidence for a specific skill ID.
   *
   * @param {DeleteSkillEvidenceRequest} request - The delete request containing skillId
   * @returns {Promise<DeleteTpqiEvidenceResponse>} Promise that resolves to the deletion response
   *
   * @throws {Error} When the API request fails or returns an error
   *
   * @example
   * ```typescript
   * const deleteService = new DeleteTpqiEvidenceService(baseURL, token);
   * try {
   *   const result = await deleteService.deleteSkillEvidence({ skillId: 456 });
   *   if (result.success) {
   *     console.log('Skill evidence deleted successfully');
   *   }
   * } catch (error) {
   *   console.error('Failed to delete skill evidence:', error);
   * }
   * ```
   */
  async deleteSkillEvidence(
    request: DeleteSkillEvidenceRequest
  ): Promise<DeleteTpqiEvidenceResponse> {
    try {
      const response: AxiosResponse<DeleteTpqiEvidenceResponse> =
        await axios.delete(`${this.baseURL}/api/tpqi/evidence/skill/delete`, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          data: {
            skillId: request.skillId,
          },
        });

      return response.data;
    } catch (error) {
      return this.handleError(error, "skill evidence");
    }
  }

  /**
   * Unified method to delete evidence by type (knowledge or skill).
   *
   * @param {DeleteTpqiEvidenceRequest} request - The delete request containing evidenceType and evidenceId
   * @returns {Promise<DeleteTpqiEvidenceResponse>} Promise that resolves to the deletion response
   *
   * @throws {Error} When the API request fails or returns an error
   *
   * @example
   * ```typescript
   * const deleteService = new DeleteTpqiEvidenceService(baseURL, token);
   * try {
   *   const result = await deleteService.deleteEvidence({
   *     evidenceType: 'knowledge',
   *     evidenceId: 123
   *   });
   *   if (result.success) {
   *     console.log('Evidence deleted successfully');
   *   }
   * } catch (error) {
   *   console.error('Failed to delete evidence:', error);
   * }
   * ```
   */
  async deleteEvidence(
    request: DeleteTpqiEvidenceRequest
  ): Promise<DeleteTpqiEvidenceResponse> {
    try {
      const response: AxiosResponse<DeleteTpqiEvidenceResponse> =
        await axios.delete(`${this.baseURL}/api/tpqi/evidence/delete`, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          data: {
            evidenceType: request.evidenceType,
            evidenceId: request.evidenceId,
          },
        });

      return response.data;
    } catch (error) {
      return this.handleError(error, "evidence");
    }
  }

  /**
   * Private method to handle API errors consistently.
   */
  private handleError(error: unknown, evidenceType: string): never {
    if (axios.isAxiosError(error)) {
      // Handle specific HTTP error responses
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please log in again");
      }
      if (error.response?.status === 404) {
        throw new Error(`${evidenceType} not found or already deleted`);
      }
      if (error.response?.status === 403) {
        throw new Error(
          `Forbidden: You don't have permission to delete this ${evidenceType}`
        );
      }
      if (error.response?.status === 409) {
        throw new Error(
          `Cannot delete ${evidenceType} due to existing references`
        );
      }

      // Handle other server errors
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`Failed to delete ${evidenceType}: ${errorMessage}`);
    }

    // Handle network or other errors
    throw new Error("Network error: Unable to connect to the server");
  }
}

/**
 * Factory function to create a DeleteTpqiEvidenceService instance.
 *
 * @param {string} baseURL - The base URL of the API server
 * @param {string} accessToken - The JWT access token for authentication
 * @returns {DeleteTpqiEvidenceService} A new service instance
 */
export const createDeleteTpqiEvidenceService = (
  baseURL: string,
  accessToken: string
): DeleteTpqiEvidenceService => {
  return new DeleteTpqiEvidenceService(baseURL, accessToken);
};
