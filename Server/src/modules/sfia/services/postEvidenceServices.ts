import { prismaSfia } from "../../../db/prismaClients";
import { InformationApprovalStatus } from "@prisma/client_sfia";

export interface CreateEvidenceRequest {
  userId: string;
  subSkillId: number;
  evidenceUrl: string; // Make this required, remove evidenceText
}

export interface EvidenceResponse {
  id: number;
  text: string | null;
  evidenceUrl: string | null;
  approved: InformationApprovalStatus;
  createdAt: Date;
  subSkillId: number;
  dataCollectionId: number;
}

/**
 * Request payload for creating subskill evidence.
 *
 * @typedef {Object} CreateEvidenceRequest
 * @property {string} userId - Unique identifier of the user submitting the evidence.
 * @property {number} subSkillId - Identifier of the related subskill.
 * @property {string} evidenceUrl - URL supporting the evidence.
 */

/**
 * Creates evidence for a subskill under a user's profile.
 * If no existing data collection is found for the user, a new one is created automatically.
 *
 * @async
 * @function createSubSkillEvidence
 * @param {CreateEvidenceRequest} evidenceData - Data required to create the subskill evidence.
 * @returns {Promise<EvidenceResponse>} Newly created evidence details.
 *
 * @throws {Error} If the specified subskill ID does not exist.
 * @throws {Error} If evidenceUrl is empty or invalid.
 *
 * @example
 * const evidence = await createSubSkillEvidence({
 *   userId: 'user_123',
 *   subSkillId: 42,
 *   evidenceUrl: 'https://github.com/example/project'
 * });
 * console.log(evidence.id); // Output: 101
 */
export async function createSubSkillEvidence(
  evidenceData: CreateEvidenceRequest
): Promise<EvidenceResponse> {
  // Validate evidenceUrl
  if (!evidenceData.evidenceUrl || !evidenceData.evidenceUrl.trim()) {
    throw new Error("Evidence URL is required and cannot be empty.");
  }

  // Validate that the subSkillId exists
  const subSkill = await prismaSfia.subSkill.findUnique({
    where: {
      id: evidenceData.subSkillId,
    },
  });

  // If subSkill does not exist, throw an error
  if (!subSkill) {
    throw new Error(
      `SubSkill with ID ${evidenceData.subSkillId} does not exist.`
    );
  }

  // If subSkill exists, proceed to create the evidence
  let dataCollection = await prismaSfia.dataCollection.findFirst({
    where: {
      userId: evidenceData.userId,
    },
  });

  // If no data collection exists for the user, create a new one
  dataCollection ??= await prismaSfia.dataCollection.create({
    data: {
      userId: evidenceData.userId,
    },
  });

  // Create the evidence record with only evidenceUrl
  const evidence = await prismaSfia.information.create({
    data: {
      text: null, // Set text to null since we don't want to store it
      evidenceUrl: evidenceData.evidenceUrl.trim(),
      subSkillId: evidenceData.subSkillId,
      dataCollectionId: dataCollection.id,
      approvalStatus: InformationApprovalStatus.NOT_APPROVED,
    },
  });

  // Return the created evidence as a response object
  return {
    id: evidence.id,
    text: evidence.text,
    evidenceUrl: evidence.evidenceUrl,
    approved: evidence.approvalStatus,
    createdAt: evidence.createdAt,
    subSkillId: evidence.subSkillId!,
    dataCollectionId: evidence.dataCollectionId!,
  };
}
