import { AxiosResponse } from "axios";
import api from "@Services/api";

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
 */
export class DeleteTpqiEvidenceService {
  /**
   * Deletes knowledge evidence for a specific knowledge ID.
   */
  async deleteKnowledgeEvidence(request: DeleteKnowledgeEvidenceRequest): Promise<DeleteTpqiEvidenceResponse> {
    try {
      const response: AxiosResponse<DeleteTpqiEvidenceResponse> = await api.delete(`/tpqi/evidence/knowledge/delete`, {
        data: { knowledgeId: request.knowledgeId },
      });

      return response.data;
    } catch (error) {
      return this.handleError(error, "knowledge evidence");
    }
  }

  /**
   * Deletes skill evidence for a specific skill ID.
   */
  async deleteSkillEvidence(request: DeleteSkillEvidenceRequest): Promise<DeleteTpqiEvidenceResponse> {
    try {
      const response: AxiosResponse<DeleteTpqiEvidenceResponse> = await api.delete(`/tpqi/evidence/skill/delete`, {
        data: { skillId: request.skillId },
      });

      return response.data;
    } catch (error) {
      return this.handleError(error, "skill evidence");
    }
  }

  /**
   * Unified method to delete evidence by type.
   */
  async deleteEvidence(request: DeleteTpqiEvidenceRequest): Promise<DeleteTpqiEvidenceResponse> {
    try {
      const response: AxiosResponse<DeleteTpqiEvidenceResponse> = await api.delete(`/tpqi/evidence/delete`, {
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
    if ((api as any).isAxiosError?.(error)) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please log in again");
      }
      if (error.response?.status === 404) {
        throw new Error(`${evidenceType} not found or already deleted`);
      }
      if (error.response?.status === 403) {
        throw new Error(`Forbidden: You don't have permission to delete this ${evidenceType}`);
      }
      if (error.response?.status === 409) {
        throw new Error(`Cannot delete ${evidenceType} due to existing references`);
      }

      const errorMessage = (error.response?.data as { message?: string })?.message || error.message;
      throw new Error(`Failed to delete ${evidenceType}: ${errorMessage}`);
    }

    throw new Error("Network error: Unable to connect to the server");
  }
}

/**
 * Factory function to create a DeleteTpqiEvidenceService instance.
 */
export const createDeleteTpqiEvidenceService = (): DeleteTpqiEvidenceService => {
  return new DeleteTpqiEvidenceService();
};
