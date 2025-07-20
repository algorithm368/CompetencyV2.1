import { prismaSfia } from "../../../db/prismaClients";
import { InformationApprovalStatus } from "@prisma/client_sfia";

export interface CreateEvidenceRequest {
  userId: string;
  subSkillId: number;
  evidenceText: string;
  evidenceUrl?: string;
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
 * @property {string} evidenceText - Description or explanation provided as evidence.
 * @property {string} [evidenceUrl] - Optional URL supporting the evidence.
 */

/**
 * Response object representing created subskill evidence.
 *
 * @typedef {Object} EvidenceResponse
 * @property {number} id - Unique identifier of the created evidence.
 * @property {string|null} text - Evidence text description.
 * @property {string|null} evidenceUrl - URL supporting the evidence.
 * @property {InformationApprovalStatus} approved - Current approval status of the evidence.
 * @property {Date} createdAt - Timestamp of when the evidence was created.
 * @property {number} subSkillId - Identifier of the related subskill.
 * @property {number} dataCollectionId - Associated data collection identifier.
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
 *
 * @example
 * const evidence = await createSubSkillEvidence({
 *   userId: 'user_123',
 *   subSkillId: 42,
 *   evidenceText: 'Implemented automated deployment pipeline.',
 *   evidenceUrl: 'https://github.com/example/project'
 * });
 * console.log(evidence.id); // Output: 101
 */
export async function createSubSkillEvidence(
  evidenceData: CreateEvidenceRequest
): Promise<EvidenceResponse> {
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

  // Create the evidence record
  const evidence = await prismaSfia.information.create({
    data: {
      text: evidenceData.evidenceText,
      evidenceUrl: evidenceData.evidenceUrl,
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