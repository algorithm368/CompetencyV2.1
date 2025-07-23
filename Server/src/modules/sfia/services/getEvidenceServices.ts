import { prismaSfia } from "@/db/prismaClients";

/**
 * Evidence information from subskill with associated URL.
 *
 * @interface EvidenceInfo
 * @property {number} id - Unique identifier of the subskill.
 * @property {string|null} evidenceUrl - URL associated with the evidence.
 */
export interface EvidenceInfo {
  id: number;
  evidenceUrl: string | null;
}

/**
 * Complete evidence collection for a skill with statistical summary.
 *
 * @interface SkillEvidenceCollection
 * @property {string} skillCode - The skill code that was queried.
 * @property {string} userId - The user ID for which evidence was retrieved.
 * @property {EvidenceInfo[]} evidences - Array of evidence information from subskills.
 * @property {number} totalEvidences - Total count of evidence items found.
 */
export interface SkillEvidenceCollection {
  skillCode: string;
  userId: string;
  evidences: EvidenceInfo[];
  totalEvidences: number;
}

/**
 * Retrieves evidence collection for a specific skill and user.
 *
 * This function performs a complex database query to fetch evidence data including:
 * - All subskills associated with the specified skill code
 * - Evidence URLs from user's data collection
 * - Only the most recent evidence per subskill
 * - Complete statistical summary
 *
 * @async
 * @function getEvidenceBySkillAndUser
 * @param {string} skillCode - The unique skill code to search for (e.g., 'ADEV', 'PROG').
 * @param {string} userId - The unique user identifier to filter evidence by.
 * @returns {Promise<SkillEvidenceCollection|null>} Complete evidence collection with statistics, or null if skill not found.
 *
 * @throws {Error} If database query fails or parameters are invalid.
 *
 * @example
 * // Retrieve evidence for ADEV skill for a specific user
 * const evidenceData = await getEvidenceBySkillAndUser('ADEV', 'user-123');
 * if (evidenceData) {
 *   console.log(`Found ${evidenceData.totalEvidences} evidence items`);
 *   evidenceData.evidences.forEach(evidence => {
 *     console.log(`SubSkill ${evidence.id}: ${evidence.evidenceUrl}`);
 *   });
 * }
 *
 * @example
 * // Handle case when no evidence is found
 * const result = await getEvidenceBySkillAndUser('INVALID_CODE', 'user-123');
 * if (!result) {
 *   console.log('Skill not found or user has no evidence');
 * }
 */
export async function getEvidenceBySkillAndUser(
  skillCode: string,
  userId: string
): Promise<SkillEvidenceCollection | null> {
  try {
    // Validate input parameters
    if (!skillCode || !userId) {
      throw new Error("Skill code and user ID are required parameters");
    }

    // First, fetch the skill and collect all subskill IDs
    const skillData = await prismaSfia.skill.findFirst({
      where: { code: skillCode },
      include: {
        levels: {
          include: {
            descriptions: {
              include: {
                subSkills: {
                  select: { id: true },
                },
              },
            },
          },
        },
        subSkills: true,
      },
    });

    // If no skill data found, return null
    if (!skillData) {
      return null;
    }

    // Extract all subskill IDs from the hierarchical structure
    const subSkillIds: number[] = [];

    if (skillData.levels) {
      for (const level of skillData.levels) {
        for (const description of level.descriptions) {
          for (const subSkill of description.subSkills) {
            subSkillIds.push(subSkill.id);
          }
        }
      }
    }

    // If no subskills found, return empty collection
    if (subSkillIds.length === 0) {
      return {
        skillCode,
        userId,
        evidences: [],
        totalEvidences: 0,
      };
    }

    // Query evidence data for the collected subskill IDs
    const evidenceList = await prismaSfia.subSkill.findMany({
      where: {
        id: { in: subSkillIds },
        informations: {
          some: {
            dataCollection: {
              userId: userId,
            },
          },
        },
      },
      select: {
        id: true,
        informations: {
          where: {
            dataCollection: {
              userId: userId,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            evidenceUrl: true,
          },
        },
      },
    });

    // Transform the raw database result to match our interface
    const evidences: EvidenceInfo[] = evidenceList.map((subSkill) => ({
      id: subSkill.id,
      evidenceUrl: subSkill.informations[0]?.evidenceUrl || null,
    }));

    return {
      skillCode,
      userId,
      evidences,
      totalEvidences: evidences.length,
    };
  } catch (error) {
    console.error("Error fetching evidence data:", error);
    throw new Error(
      `Failed to fetch evidence for skill: ${skillCode} and user: ${userId}`
    );
  }
}

/**
 * Retrieves evidence collection for a specific skill and user (legacy support).
 *
 * @deprecated Use getEvidenceBySkillAndUser instead.
 * This function maintains backward compatibility but should be replaced in new code.
 */
export async function getEvidenceServices(
  skillCode: string,
  userId: string
): Promise<SkillEvidenceCollection | null> {
  return getEvidenceBySkillAndUser(skillCode, userId);
}
