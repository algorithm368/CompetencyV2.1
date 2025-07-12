// 1. IMPORTS
// =================================
import { prismaSfia } from "@Database/prismaClients";

// 2. TYPE DEFINITIONS (for better readability and type safety)
// =================================
export interface SubSkillData {
  id: number;
  text: string;
  skillCode: string;
}

export interface DescriptionData {
  id: number;
  text: string;
  subSkills: SubSkillData[];
}

export interface SkillLevel {
  id: number;
  name: string;
  descriptions: DescriptionData[];
}

export interface SkillData {
  code: string;
  name: string;
  overview?: string;
  note?: string;
  levels: SkillLevel[];
  subSkills: SubSkillData[];
}

// 3. FUNCTION DEFINITIONS
// =================================

/**
 * Fetches a specific SFIA skill with its levels and sub-skills.
 *
 * @param skillCode The SFIA code for the skill (e.g., "PROG", "DBAD").
 * @returns A Promise that resolves to a skill object with levels and sub-skills.
 * @throws {Error} if the skill code is empty or not found in the database.
 */
export async function getSkillWithLevelsAndSubSkills(skillCode: string): Promise<SkillData> {
  const normalizedSkillCode = skillCode?.trim();
  if (!normalizedSkillCode) {
    throw new Error("Skill code is required and cannot be empty.");
  }

  try {
    const skill = await prismaSfia.skill.findUnique({
      where: { code: normalizedSkillCode },
      select: {
        code: true,
        name: true,
        overview: true,
        note: true,
        levels: {
          select: {
            id: true,
            name: true,
            descriptions: {
              select: {
                id: true,
                text: true,
                subSkills: {
                  select: {
                    id: true,
                    text: true,
                    skillCode: true,
                  },
                },
              },
            },
          },
          orderBy: { id: "asc" },
        },
        subSkills: {
          select: {
            id: true,
            text: true,
            skillCode: true,
          },
        },
      },
    });

    if (!skill) {
      throw new Error(`Skill with code "${skillCode}" not found in SFIA database.`);
    }

    // Process the data to match our interface
    return {
      code: skill.code,
      name: skill.name ?? "Unknown Skill",
      overview: skill.overview ?? undefined,
      note: skill.note ?? undefined,
      levels: skill.levels.map((level): SkillLevel => ({
        id: level.id,
        name: level.name ?? "Unknown Level",
        descriptions: level.descriptions.map((desc): DescriptionData => ({
          id: desc.id,
          text: desc.text ?? "",
          subSkills: desc.subSkills
            .filter((subSkill) => subSkill.text !== null)
            .map((subSkill): SubSkillData => ({
              id: subSkill.id,
              text: subSkill.text ?? "",
              skillCode: subSkill.skillCode,
            })),
        })),
      })),
      subSkills: skill.subSkills
        .filter((subSkill) => subSkill.text !== null)
        .map((subSkill): SubSkillData => ({
          id: subSkill.id,
          text: subSkill.text ?? "",
          skillCode: subSkill.skillCode,
        })),
    };
  } catch (error) {
    console.error(`Error fetching skill with code ${skillCode}:`, error);
    throw error;
  }
}

/**
 * Fetches all skills with their sub-skills (without levels for performance).
 *
 * @returns A Promise that resolves to an array of skills with their sub-skills.
 */
export async function getAllSkillsWithSubSkills(): Promise<Omit<SkillData, 'levels'>[]> {
  try {
    const skills = await prismaSfia.skill.findMany({
      select: {
        code: true,
        name: true,
        overview: true,
        note: true,
        subSkills: {
          select: {
            id: true,
            text: true,
            skillCode: true,
          },
        },
      },
      orderBy: { code: "asc" },
    });

    return skills.map((skill) => ({
      code: skill.code,
      name: skill.name ?? "Unknown Skill",
      overview: skill.overview ?? undefined,
      note: skill.note ?? undefined,
      subSkills: skill.subSkills
        .filter((subSkill) => subSkill.text !== null)
        .map((subSkill): SubSkillData => ({
          id: subSkill.id,
          text: subSkill.text ?? "",
          skillCode: subSkill.skillCode,
        })),
    }));
  } catch (error) {
    console.error("Error fetching all skills with sub-skills:", error);
    throw error;
  }
}