import { prismaTpqi } from "@/db/prismaClients";

/**
 * Result of TPQI knowledge evidence deletion operation.
 *
 * @interface DeleteKnowledgeEvidenceResult
 * @property {number} id - The ID of the deleted knowledge evidence.
 * @property {number} knowledgeId - The knowledge ID associated with the evidence.
 * @property {string} userId - The user ID who owns the evidence.
 * @property {string|null} evidenceUrl - The URL of the deleted evidence.
 * @property {string} approvalStatus - The approval status of the evidence.
 */
export interface DeleteKnowledgeEvidenceResult {
  id: number;
  knowledgeId: number;
  userId: string;
  evidenceUrl: string | null;
  approvalStatus: string;
}

/**
 * Result of TPQI skill evidence deletion operation.
 *
 * @interface DeleteSkillEvidenceResult
 * @property {number} id - The ID of the deleted skill evidence.
 * @property {number} skillId - The skill ID associated with the evidence.
 * @property {string} userId - The user ID who owns the evidence.
 * @property {string|null} evidenceUrl - The URL of the deleted evidence.
 * @property {string} approvalStatus - The approval status of the evidence.
 */
export interface DeleteSkillEvidenceResult {
  id: number;
  skillId: number;
  userId: string;
  evidenceUrl: string | null;
  approvalStatus: string;
}

/**
 * Deletes knowledge evidence by its unique identifier.
 *
 * This function performs a secure deletion of knowledge evidence data by:
 * - Validating the evidence ID parameter
 * - Removing the evidence record from the UserKnowledge table
 * - Returning the deleted evidence information for confirmation
 *
 * @async
 * @function deleteKnowledgeEvidenceById
 * @param {string} id - The unique identifier of the knowledge evidence to delete.
 * @returns {Promise<DeleteKnowledgeEvidenceResult>} The deleted knowledge evidence data for confirmation.
 *
 * @throws {Error} If the evidence ID is invalid, evidence not found, or database operation fails.
 *
 * @example
 * // Delete knowledge evidence by ID
 * try {
 *   const deletedEvidence = await deleteKnowledgeEvidenceById('123');
 *   console.log(`Deleted knowledge evidence: ${deletedEvidence.evidenceUrl}`);
 * } catch (error) {
 *   console.error('Failed to delete knowledge evidence:', error.message);
 * }
 */
export async function deleteKnowledgeEvidenceById(
  id: string
): Promise<DeleteKnowledgeEvidenceResult> {
  try {
    // Validate input parameter
    if (!id || typeof id !== "string" || id.trim().length === 0) {
      throw new Error(
        "Knowledge evidence ID is required and must be a non-empty string"
      );
    }

    // Convert to number and validate
    const numericId = parseInt(id.trim());
    if (isNaN(numericId)) {
      throw new Error("Knowledge evidence ID must be a valid number");
    }

    // Attempt to delete the knowledge evidence
    const result = await prismaTpqi.userKnowledge.delete({
      where: { id: numericId },
    });

    return result as DeleteKnowledgeEvidenceResult;
  } catch (error: any) {
    // Handle Prisma-specific errors
    if (error.code === "P2025") {
      throw new Error(
        `Knowledge evidence with ID '${id}' not found or already deleted`
      );
    }

    // Handle other database errors
    if (error.code?.startsWith("P")) {
      throw new Error(
        `Database error while deleting knowledge evidence: ${error.message}`
      );
    }

    // Handle validation errors
    if (error.message?.includes("required")) {
      throw error;
    }

    // Handle unexpected errors
    console.error("Unexpected error in deleteKnowledgeEvidenceById:", error);
    throw new Error(
      `Failed to delete knowledge evidence with ID '${id}': ${error.message}`
    );
  }
}

/**
 * Deletes skill evidence by its unique identifier.
 *
 * This function performs a secure deletion of skill evidence data by:
 * - Validating the evidence ID parameter
 * - Removing the evidence record from the UserSkill table
 * - Returning the deleted evidence information for confirmation
 *
 * @async
 * @function deleteSkillEvidenceById
 * @param {string} id - The unique identifier of the skill evidence to delete.
 * @returns {Promise<DeleteSkillEvidenceResult>} The deleted skill evidence data for confirmation.
 *
 * @throws {Error} If the evidence ID is invalid, evidence not found, or database operation fails.
 *
 * @example
 * // Delete skill evidence by ID
 * try {
 *   const deletedEvidence = await deleteSkillEvidenceById('456');
 *   console.log(`Deleted skill evidence: ${deletedEvidence.evidenceUrl}`);
 * } catch (error) {
 *   console.error('Failed to delete skill evidence:', error.message);
 * }
 */
export async function deleteSkillEvidenceById(
  id: string
): Promise<DeleteSkillEvidenceResult> {
  try {
    // Validate input parameter
    if (!id || typeof id !== "string" || id.trim().length === 0) {
      throw new Error(
        "Skill evidence ID is required and must be a non-empty string"
      );
    }

    // Convert to number and validate
    const numericId = parseInt(id.trim());
    if (isNaN(numericId)) {
      throw new Error("Skill evidence ID must be a valid number");
    }

    // Attempt to delete the skill evidence
    const result = await prismaTpqi.userSkill.delete({
      where: { id: numericId },
    });

    return result as DeleteSkillEvidenceResult;
  } catch (error: any) {
    // Handle Prisma-specific errors
    if (error.code === "P2025") {
      throw new Error(
        `Skill evidence with ID '${id}' not found or already deleted`
      );
    }

    // Handle other database errors
    if (error.code?.startsWith("P")) {
      throw new Error(
        `Database error while deleting skill evidence: ${error.message}`
      );
    }

    // Handle validation errors
    if (error.message?.includes("required")) {
      throw error;
    }

    // Handle unexpected errors
    console.error("Unexpected error in deleteSkillEvidenceById:", error);
    throw new Error(
      `Failed to delete skill evidence with ID '${id}': ${error.message}`
    );
  }
}

/**
 * Deletes knowledge evidence by knowledge ID and user ID.
 *
 * This function provides deletion by specific knowledge and user:
 * - Finding evidence associated with a specific knowledge ID and user
 * - Deleting the knowledge evidence for that combination
 * - Returning the deleted evidence information
 *
 * @async
 * @function deleteKnowledgeEvidenceByKnowledgeAndUser
 * @param {number} knowledgeId - The knowledge ID associated with the evidence.
 * @param {string} userId - The user ID who owns the evidence.
 * @returns {Promise<DeleteKnowledgeEvidenceResult|null>} The deleted knowledge evidence data, or null if no evidence found.
 *
 * @throws {Error} If parameters are invalid or database operation fails.
 *
 * @example
 * // Delete knowledge evidence by knowledge ID and user
 * const deleted = await deleteKnowledgeEvidenceByKnowledgeAndUser(123, 'user-456');
 * if (deleted) {
 *   console.log(`Deleted knowledge evidence: ${deleted.evidenceUrl}`);
 * } else {
 *   console.log('No knowledge evidence found to delete');
 * }
 */
export async function deleteKnowledgeEvidenceByKnowledgeAndUser(
  knowledgeId: number,
  userId: string
): Promise<DeleteKnowledgeEvidenceResult | null> {
  try {
    // Validate input parameters
    if (!knowledgeId || !userId) {
      throw new Error("Knowledge ID and user ID are required parameters");
    }

    // Validate knowledgeId is a positive number
    if (typeof knowledgeId !== "number" || knowledgeId <= 0) {
      throw new Error("Knowledge ID must be a positive number");
    }

    // Find the evidence to delete
    const evidenceToDelete = await prismaTpqi.userKnowledge.findFirst({
      where: {
        knowledgeId: knowledgeId,
        userId: userId.trim(),
      },
    });

    // If no evidence found, return null
    if (!evidenceToDelete) {
      return null;
    }

    // Delete the found evidence
    const result = await prismaTpqi.userKnowledge.delete({
      where: { id: evidenceToDelete.id },
    });

    return result as DeleteKnowledgeEvidenceResult;
  } catch (error: any) {
    console.error(
      "Error deleting knowledge evidence by knowledge and user:",
      error
    );
    throw new Error(
      `Failed to delete knowledge evidence for knowledge: ${knowledgeId} and user: ${userId}`
    );
  }
}

/**
 * Deletes skill evidence by skill ID and user ID.
 *
 * This function provides deletion by specific skill and user:
 * - Finding evidence associated with a specific skill ID and user
 * - Deleting the skill evidence for that combination
 * - Returning the deleted evidence information
 *
 * @async
 * @function deleteSkillEvidenceBySkillAndUser
 * @param {number} skillId - The skill ID associated with the evidence.
 * @param {string} userId - The user ID who owns the evidence.
 * @returns {Promise<DeleteSkillEvidenceResult|null>} The deleted skill evidence data, or null if no evidence found.
 *
 * @throws {Error} If parameters are invalid or database operation fails.
 *
 * @example
 * // Delete skill evidence by skill ID and user
 * const deleted = await deleteSkillEvidenceBySkillAndUser(456, 'user-789');
 * if (deleted) {
 *   console.log(`Deleted skill evidence: ${deleted.evidenceUrl}`);
 * } else {
 *   console.log('No skill evidence found to delete');
 * }
 */
export async function deleteSkillEvidenceBySkillAndUser(
  skillId: number,
  userId: string
): Promise<DeleteSkillEvidenceResult | null> {
  try {
    // Validate input parameters
    if (!skillId || !userId) {
      throw new Error("Skill ID and user ID are required parameters");
    }

    // Validate skillId is a positive number
    if (typeof skillId !== "number" || skillId <= 0) {
      throw new Error("Skill ID must be a positive number");
    }

    // Find the evidence to delete
    const evidenceToDelete = await prismaTpqi.userSkill.findFirst({
      where: {
        skillId: skillId,
        userId: userId.trim(),
      },
    });

    // If no evidence found, return null
    if (!evidenceToDelete) {
      return null;
    }

    // Delete the found evidence
    const result = await prismaTpqi.userSkill.delete({
      where: { id: evidenceToDelete.id },
    });

    return result as DeleteSkillEvidenceResult;
  } catch (error: any) {
    console.error("Error deleting skill evidence by skill and user:", error);
    throw new Error(
      `Failed to delete skill evidence for skill: ${skillId} and user: ${userId}`
    );
  }
}

/**
 * Unified function to delete evidence by type, ID, and user.
 *
 * This function provides a unified interface for deleting either knowledge or skill evidence:
 * - Accepts evidence type ('knowledge' or 'skill')
 * - Routes to appropriate deletion function
 * - Returns consistent response format
 *
 * @async
 * @function deleteEvidenceByTypeAndUser
 * @param {string} evidenceType - The type of evidence ('knowledge' or 'skill').
 * @param {number} evidenceId - The knowledge/skill ID associated with the evidence.
 * @param {string} userId - The user ID who owns the evidence.
 * @returns {Promise<DeleteKnowledgeEvidenceResult|DeleteSkillEvidenceResult|null>} The deleted evidence data, or null if no evidence found.
 *
 * @throws {Error} If parameters are invalid or database operation fails.
 *
 * @example
 * // Delete knowledge evidence
 * const deletedKnowledge = await deleteEvidenceByTypeAndUser('knowledge', 123, 'user-456');
 *
 * // Delete skill evidence
 * const deletedSkill = await deleteEvidenceByTypeAndUser('skill', 456, 'user-789');
 */
export async function deleteEvidenceByTypeAndUser(
  evidenceType: "knowledge" | "skill",
  evidenceId: number,
  userId: string
): Promise<DeleteKnowledgeEvidenceResult | DeleteSkillEvidenceResult | null> {
  try {
    // Validate evidence type
    if (evidenceType !== "knowledge" && evidenceType !== "skill") {
      throw new Error("Evidence type must be either 'knowledge' or 'skill'");
    }

    // Route to appropriate deletion function
    if (evidenceType === "knowledge") {
      return await deleteKnowledgeEvidenceByKnowledgeAndUser(
        evidenceId,
        userId
      );
    } else {
      return await deleteSkillEvidenceBySkillAndUser(evidenceId, userId);
    }
  } catch (error: any) {
    console.error(`Error deleting ${evidenceType} evidence:`, error);
    throw new Error(
      `Failed to delete ${evidenceType} evidence for ${evidenceType}: ${evidenceId} and user: ${userId}`
    );
  }
}

/**
 * Legacy support functions for backward compatibility.
 */

/**
 * Deletes knowledge evidence by its unique identifier (legacy support).
 *
 * @deprecated Use deleteKnowledgeEvidenceById instead.
 * This function maintains backward compatibility but should be replaced in new code.
 */
export async function delKnowledgeEvidenceServices(
  id: string
): Promise<DeleteKnowledgeEvidenceResult> {
  return deleteKnowledgeEvidenceById(id);
}

/**
 * Deletes skill evidence by its unique identifier (legacy support).
 *
 * @deprecated Use deleteSkillEvidenceById instead.
 * This function maintains backward compatibility but should be replaced in new code.
 */
export async function delSkillEvidenceServices(
  id: string
): Promise<DeleteSkillEvidenceResult> {
  return deleteSkillEvidenceById(id);
}
