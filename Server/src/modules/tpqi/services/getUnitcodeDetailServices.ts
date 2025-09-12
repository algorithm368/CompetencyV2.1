import { prismaTpqi } from "../../../db/prismaClients";

export interface UnitCodeDetail {
  competency_id: string;
  competency_name: string | null;
  overall: string | null;
  note: string | null;
  occupational: Array<{
    id: number;
    name_occupational: string;
  }>;
  sector: Array<{
    id: number;
    name_sector: string;
  }>;
  skills: Array<{
    id: number;
    name_skill: string;
  }>;
  knowledge: Array<{
    id: number;
    name_knowledge: string;
  }>;
}

export interface UnitCodeSkillsAndKnowledge {
  competency: UnitCodeDetail | null;
  totalSkills: number;
  totalKnowledge: number;
  totalOccupational: number;
  totalSector: number;
}

/**
 * Search for unit code details including skills and knowledge by UnitCode
 * @param UnitCode - The unit code to search for
 * @returns Promise<UnitCodeSkillsAndKnowledge | null>
 */
export async function getUnitCodeDetailsByCode(
  UnitCode: string
): Promise<UnitCodeSkillsAndKnowledge | null> {
  try {
    const UnitCodeData = await prismaTpqi.unitCode.findFirst({
      where: {
        code: UnitCode,
      },
      include: {
        unitOccupationalLinks: {
          include: {
            occupational: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        unitSectorLinks: {
          include: {
            sector: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        // 🔹 เปลี่ยนจาก unitSkillLinks → UnitSkill
        UnitSkill: true,
        // 🔹 เปลี่ยนจาก unitKnowledgeLinks → UnitKnowledge
        UnitKnowledge: true,
      },
    });

    if (!UnitCodeData) {
      return null;
    }

    // Get skills data
    const skillIds = UnitCodeData.UnitSkill.map(link => link.skillId);
    const skills = await prismaTpqi.skill.findMany({
      where: {
        id: {
          in: skillIds
        }
      },
      select: {
        id: true,
        name: true
      }
    });

    // Get knowledge data  
    const knowledgeIds = UnitCodeData.UnitKnowledge.map(link => link.knowledgeId);
    const knowledge = await prismaTpqi.knowledge.findMany({
      where: {
        id: {
          in: knowledgeIds
        }
      },
      select: {
        id: true,
        name: true
      }
    });

    const transformedUnitCode: UnitCodeDetail = {
      competency_id: UnitCodeData.code,
      competency_name: UnitCodeData.name,
      overall: UnitCodeData.description,
      note: UnitCodeData.code,
      occupational: UnitCodeData.unitOccupationalLinks.map((uo) => ({
        id: uo.occupational.id,
        name_occupational: uo.occupational.name,
      })),
      sector: UnitCodeData.unitSectorLinks.map((us) => ({
        id: us.sector.id,
        name_sector: us.sector.name,
      })),
      skills: skills.map((skill) => ({
        id: skill.id,
        name_skill: skill.name,
      })),
      knowledge: knowledge.map((knowledgeItem) => ({
        id: knowledgeItem.id,
        name_knowledge: knowledgeItem.name,
      })),
    };

    const totalSkills = UnitCodeData.UnitSkill.length;
    const totalKnowledge = UnitCodeData.UnitKnowledge.length;
    const totalOccupational = UnitCodeData.unitOccupationalLinks.length;
    const totalSector = UnitCodeData.unitSectorLinks.length;

    return {
      competency: transformedUnitCode,
      totalSkills,
      totalKnowledge,
      totalOccupational,
      totalSector,
    };
  } catch (error) {
    console.error("Error fetching unit code details:", error);
    throw new Error(`Failed to fetch unit code details for code: ${UnitCode}`);
  }
}
