import { prismaSfia, prismaCompetency } from "@/db/prismaClients";

/**
 * Individual skill summary information for a user.
 *
 * @interface SkillSummaryInfo
 * @property {number} id - Unique identifier of the summary.
 * @property {string} skillCode - Code of the skill (e.g., 'ADEV', 'PROG').
 * @property {string|null} skillName - Name of the skill.
 * @property {number|null} levelId - Level ID of the skill.
 * @property {string|null} levelName - Name of the level.
 * @property {number|null} skillPercent - Percentage completion of the skill.
 * @property {string|null} categoryName - Category name the skill belongs to.
 */
export interface SkillSummaryInfo {
  id: number;
  skillCode: string;
  skillName: string | null;
  levelId: number | null;
  levelName: string | null;
  skillPercent: number | null;
  categoryName: string | null;
}

/**
 * Complete user summary collection with statistical information.
 *
 * @interface UserSummaryCollection
 * @property {SkillSummaryInfo[]} skillSummaries - Array of skill summary information.
 * @property {number} totalSkills - Total count of skills found.
 * @property {number} averagePercent - Average completion percentage across all skills.
 * @property {number} completedSkills - Number of skills with 100% completion.
 */
export interface UserSummaryCollection {
  skillSummaries: SkillSummaryInfo[];
  totalSkills: number;
  averagePercent: number;
  completedSkills: number;
}

/**
 * Retrieves comprehensive skill summary collection for a specific user.
 *
 * This function performs a complex database query to fetch summary data including:
 * - All skill summaries associated with the user
 * - Skill details with names and categories
 * - Level information and completion percentages
 * - Statistical analysis of user's skill progression
 *
 * @async
 * @function getUserSummaryByUserId
 * @param {string} userId - The unique user identifier to filter summaries by.
 * @returns {Promise<UserSummaryCollection|null>} Complete summary collection with statistics, or null if no summaries found.
 *
 * @throws {Error} If database query fails or parameters are invalid.
 *
 * @example
 * // Retrieve summary for a specific user
 * const summaryData = await getUserSummaryByUserId('user-123');
 * if (summaryData) {
 *   console.log(`User has ${summaryData.totalSkills} skills with ${summaryData.averagePercent}% average completion`);
 *   summaryData.skillSummaries.forEach(skill => {
 *     console.log(`${skill.skillName}: ${skill.skillPercent}%`);
 *   });
 * }
 *
 * @example
 * // Handle case when no summaries are found
 * const result = await getUserSummaryByUserId('unknown-user');
 * if (!result) {
 *   console.log('No skill summaries found for this user');
 * }
 */
export async function getUserSummaryByUserId(userId: string): Promise<UserSummaryCollection | null> {
  try {
    // Validate input parameters
    if (!userId) {
      throw new Error("User ID is required parameter");
    }

    // Query user summaries with all related information using the email
    const summaryData = await prismaSfia.sfiaSummary.findMany({
      where: {
        userId: userId, // Use the email from competency database
      },
      include: {
        skill: {
          include: {
            category: true,
          },
        },
        level: true,
      },
      orderBy: [{ skillPercent: "desc" }, { skillCode: "asc" }],
    });

    // If no summaries found, return null
    if (!summaryData || summaryData.length === 0) {
      return null;
    }

    // Transform the raw database result to match our interface
    const skillSummaries: SkillSummaryInfo[] = summaryData.map((summary) => ({
      id: summary.id,
      skillCode: summary.skillCode || "",
      skillName: summary.skill?.name || null,
      levelId: summary.levelId,
      levelName: summary.level?.name || null,
      skillPercent: summary.skillPercent ? Number(summary.skillPercent) : null,
      categoryName: summary.skill?.category?.name || null,
    }));

    // Calculate statistics
    const validPercentages = skillSummaries.map((skill) => skill.skillPercent).filter((percent): percent is number => percent !== null);

    const totalSkills = skillSummaries.length;
    const averagePercent = validPercentages.length > 0 ? Math.round((validPercentages.reduce((sum, percent) => sum + percent, 0) / validPercentages.length) * 100) / 100 : 0;
    const completedSkills = skillSummaries.filter((skill) => skill.skillPercent === 100).length;

    return {
      skillSummaries,
      totalSkills,
      averagePercent,
      completedSkills,
    };
  } catch (error) {
    console.error("Error fetching user summary data:", error);
    throw new Error(`Failed to fetch summary for user: ${userId}`);
  }
}
