import { prismaSfia } from "../../../db/prismaClients";

export interface SkillDetail {
  competency_id: string;
  competency_name: string | null;
  overall: string | null;
  note: string | null;
  category: {
    id: number;
    category_text: string | null;
  } | null;
  levels: Array<{
    id: number;
    level_name: string | null;
    descriptions: Array<{
      id: number;
      description_text: string | null;
      subskills: Array<{
        id: number;
        subskill_text: string | null;
      }>;
    }>;
  }>;
}

export interface SkillSubSkillsAndLevels {
  competency: SkillDetail | null;
  totalLevels: number;
  totalSubSkills: number;
}

/**
 * Search for skill details including required subskills and skill levels by skill_code
 * @param skill_code - The skill code to search for
 * @returns Promise<SkillSubSkillsAndLevels | null>
 */
export async function getSkillDetailsByCode(
  skill_code: string
): Promise<SkillSubSkillsAndLevels | null> {
  try {
    const skillData = await prismaSfia.skill.findFirst({
      where: {
        code: skill_code,
        levels: {
          some: {
            descriptions: {
              some: {},
            },
          },
        },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        levels: {
          where: {
            descriptions: {
              some: {},
            },
          },
          include: {
            descriptions: {
              include: {
                subSkills: {
                  select: {
                    id: true,
                    text: true,
                  },
                },
              },
            },
          },
          orderBy: {
            id: "asc",
          },
        },
      },
    });

    if (!skillData) {
      return null;
    }

    // Transform the data to match our interface
    const transformedSkill: SkillDetail = {
      competency_id: skillData.code,
      competency_name: skillData.name,
      overall: skillData.overview,
      note: skillData.note,
      category: skillData.category
        ? {
            id: skillData.category.id,
            category_text: skillData.category.name,
          }
        : null,
      levels: skillData.levels.map((level: any) => ({
        id: level.id,
        level_name: level.name,
        descriptions: level.descriptions.map((desc: any) => ({
          id: desc.id,
          description_text: desc.text,
          subskills: desc.subSkills.map((subskill: any) => ({
            id: subskill.id,
            subskill_text: subskill.text,
          })),
        })),
      })),
    };

    // Calculate totals
    const totalLevels = skillData.levels.length;
    const totalSubSkills = skillData.levels.reduce(
      (total: number, level: any) => {
        return (
          total +
          level.descriptions.reduce((descTotal: number, desc: any) => {
            return descTotal + desc.subSkills.length;
          }, 0)
        );
      },
      0
    );

    return {
      competency: transformedSkill,
      totalLevels,
      totalSubSkills,
    };
  } catch (error) {
    console.error("Error fetching skill details:", error);
    throw new Error(`Failed to fetch skill details for code: ${skill_code}`);
  }
}

// For backward compatibility, also export with the old name
export type SkillSkillsAndLevels = SkillSubSkillsAndLevels;

