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
 * Search for unit code details including skills and knowledge by unit_code
 * @param unit_code - The unit code to search for
 * @returns Promise<UnitCodeSkillsAndKnowledge | null>
 */
export async function getUnitCodeDetailsByCode(
  unit_code: string
): Promise<UnitCodeSkillsAndKnowledge | null> {
  try {
    const unitCodeData = await prismaTpqi.unit_code.findFirst({
      where: {
        unit_code: unit_code,
      },
      include: {
        unit_occupational: {
          include: {
            occupational: {
              select: {
                id_occupational: true,
                name_occupational: true,
              },
            },
          },
        },
        unit_sector: {
          include: {
            sector: {
              select: {
                id_sector: true,
                name_sector: true,
              },
            },
          },
        },
        u_skill: {
          include: {
            skill: {
              select: {
                id_skill: true,
                name_skill: true,
              },
            },
          },
        },
        u_knowledge: {
          include: {
            knowledge: {
              select: {
                id_knowledge: true,
                name_knowledge: true,
              },
            },
          },
        },
      },
    });

    if (!unitCodeData) {
      return null;
    }

    const transformedUnitCode: UnitCodeDetail = {
      competency_id: unitCodeData.unit_code,
      competency_name: unitCodeData.name,
      overall: unitCodeData.description_unitcode,
      note: unitCodeData.unit_code,
      occupational: unitCodeData.unit_occupational.map((uo) => ({
        id: uo.occupational.id_occupational,
        name_occupational: uo.occupational.name_occupational,
      })),
      sector: unitCodeData.unit_sector.map((us) => ({
        id: us.sector.id_sector,
        name_sector: us.sector.name_sector,
      })),
      skills: unitCodeData.u_skill.map((us) => ({
        id: us.skill.id_skill,
        name_skill: us.skill.name_skill,
      })),
      knowledge: unitCodeData.u_knowledge.map((uk) => ({
        id: uk.knowledge.id_knowledge,
        name_knowledge: uk.knowledge.name_knowledge,
      })),
    };

    const totalSkills = unitCodeData.u_skill.length;
    const totalKnowledge = unitCodeData.u_knowledge.length;
    const totalOccupational = unitCodeData.unit_occupational.length;
    const totalSector = unitCodeData.unit_sector.length;

    return {
      competency: transformedUnitCode,
      totalSkills,
      totalKnowledge,
      totalOccupational,
      totalSector,
    };
  } catch (error) {
    console.error("Error fetching unit code details:", error);
    throw new Error(`Failed to fetch unit code details for code: ${unit_code}`);
  }
}

getUnitCodeDetailsByCode("ICT-LIGW-404B")
  .then((result) => {
    console.log("Unit Code Details:", result);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
