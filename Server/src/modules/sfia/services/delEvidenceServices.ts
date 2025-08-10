import { prismaSfia } from "@/db/prismaClients";

/**
 * Result of evidence deletion operation.
 *
 * @interface DeleteEvidenceResult
 * @property {number} id - The ID of the deleted evidence.
 * @property {string|null} text - The text content of the evidence.
 * @property {number|null} subSkillId - The sub-skill ID associated with the evidence.
 * @property {number|null} dataCollectionId - The data collection ID.
 * @property {string|null} evidenceUrl - The URL of the deleted evidence.
 * @property {Date} createdAt - When the evidence was originally created.
 * @property {string} approvalStatus - The approval status of the evidence.
 */
export interface DeleteEvidenceResult {
  id: number;
  text: string | null;
  subSkillId: number | null;
  dataCollectionId: number | null;
  evidenceUrl: string | null;
  createdAt: Date;
  approvalStatus: string;
}

/**
 * Deletes evidence by its unique identifier.
 *
 * This function performs a secure deletion of evidence data by:
 * - Validating the evidence ID parameter
 * - Removing the evidence record from the database
 * - Returning the deleted evidence information for confirmation
 *
 * @async
 * @function deleteEvidenceById
 * @param {string} id - The unique identifier of the evidence to delete.
 * @returns {Promise<DeleteEvidenceResult>} The deleted evidence data for confirmation.
 *
 * @throws {Error} If the evidence ID is invalid, evidence not found, or database operation fails.
 *
 * @example
 * // Delete evidence by ID
 * try {
 *   const deletedEvidence = await deleteEvidenceById('123');
 *   console.log(`Deleted evidence: ${deletedEvidence.text}`);
 * } catch (error) {
 *   console.error('Failed to delete evidence:', error.message);
 * }
 *
 * @example
 * // Handle evidence not found
 * try {
 *   await deleteEvidenceById('999');
 * } catch (error) {
 *   if (error.message.includes('not found')) {
 *     console.log('Evidence already deleted or does not exist');
 *   }
 * }
 */
export async function deleteEvidenceById(
  id: string
): Promise<DeleteEvidenceResult> {
  try {
    // Validate input parameter
    if (!id || typeof id !== "string" || id.trim().length === 0) {
      throw new Error("Evidence ID is required and must be a non-empty string");
    }

    // Convert to number and validate
    const numericId = parseInt(id.trim());
    if (isNaN(numericId)) {
      throw new Error("Evidence ID must be a valid number");
    }

    // Attempt to delete the evidence
    const result = await prismaSfia.information.delete({
      where: { id: numericId },
    });

    return result as DeleteEvidenceResult;
  } catch (error: any) {
    // Handle Prisma-specific errors
    if (error.code === "P2025") {
      throw new Error(`Evidence with ID '${id}' not found or already deleted`);
    }

    // Handle other database errors
    if (error.code?.startsWith("P")) {
      throw new Error(
        `Database error while deleting evidence: ${error.message}`
      );
    }

    // Handle validation errors
    if (error.message?.includes("required")) {
      throw error;
    }

    // Handle unexpected errors
    console.error("Unexpected error in deleteEvidenceById:", error);
    throw new Error(
      `Failed to delete evidence with ID '${id}': ${error.message}`
    );
  }
}

/**
 * Deletes evidence by skill code and user ID.
 *
 * This function provides an alternative deletion method by:
 * - Finding evidence associated with a specific skill code and user
 * - Deleting the most recent evidence for that combination
 * - Returning the deleted evidence information
 *
 * @async
 * @function deleteEvidenceBySkillAndUser
 * @param {string} skillCode - The skill code associated with the evidence.
 * @param {string} userId - The user ID who owns the evidence.
 * @returns {Promise<DeleteEvidenceResult|null>} The deleted evidence data, or null if no evidence found.
 *
 * @throws {Error} If parameters are invalid or database operation fails.
 *
 * @example
 * // Delete evidence by skill code and user
 * const deleted = await deleteEvidenceBySkillAndUser('SKILL-001', 'user-123');
 * if (deleted) {
 *   console.log(`Deleted evidence: ${deleted.evidenceUrl}`);
 * } else {
 *   console.log('No evidence found to delete');
 * }
 */
export async function deleteEvidenceBySkillAndUser(
  skillCode: string,
  userId: string
): Promise<DeleteEvidenceResult | null> {
  try {
    // Validate input parameters
    if (!skillCode || !userId) {
      throw new Error("Skill code and user ID are required parameters");
    }

    // Find the evidence to delete through the proper relationship chain
    const evidenceToDelete = await prismaSfia.information.findFirst({
      where: {
        subSkill: {
          skillCode: skillCode.trim(),
        },
        dataCollection: {
          userId: userId.trim(),
        },
      },
      orderBy: {
        createdAt: "desc", // Get the most recent evidence
      },
    });

    // If no evidence found, return null
    if (!evidenceToDelete) {
      return null;
    }

    // Delete the found evidence
    const result = await prismaSfia.information.delete({
      where: { id: evidenceToDelete.id },
    });

    return result as DeleteEvidenceResult;
  } catch (error: any) {
    console.error("Error deleting evidence by skill and user:", error);
    throw new Error(
      `Failed to delete evidence for skill: ${skillCode} and user: ${userId}`
    );
  }
}

/**
 * Deletes evidence by its unique identifier (legacy support).
 *
 * @deprecated Use deleteEvidenceById instead.
 * This function maintains backward compatibility but should be replaced in new code.
 */
export async function delEvidenceServices(
  id: string
): Promise<DeleteEvidenceResult> {
  return deleteEvidenceById(id);
}
