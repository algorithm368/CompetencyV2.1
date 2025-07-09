import { prismaSfia, prismaTpqi } from "../../../db/prismaClients";

// Types for SFIA Job Data
export interface SFIAJobDescription {
  code_job: string;
  job_name: string | null;
  overall: string | null;
  note: string | null;
  category?: {
    id: number;
    category_text: string | null;
  };
  levels: {
    id: number;
    level_name: string | null;
    descriptions: {
      id: number;
      description_text: string | null;
      skills: {
        id: number;
        skill_text: string | null;
      }[];
    }[];
  }[];
}

// Types for TPQI Occupation Data
export interface TPQIOccupationData {
  id_occupational: number;
  name_occupational: string;
  unit_codes: {
    id_unit_code: number;
    unit_code: string;
    name: string;
    description_unitcode: string;
    skills: {
      id_skill: number;
      name_skill: string;
    }[];
    knowledge: {
      id_knowledge: number;
      name_knowledge: string;
    }[];
  }[];
}

// Types for Career Levels with Details
export interface TPQICareerLevelData {
  id_career_level: number;
  career: {
    id_career: number;
    name_career: string;
  };
  level: {
    id_level: number;
    name_level: string;
  };
  skills: {
    id_skill: number;
    name_skill: string;
  }[];
  knowledge: {
    id_knowledge: number;
    name_knowledge: string;
  }[];
  unit_codes: {
    id_unit_code: number;
    unit_code: string;
    name: string;
    description_unitcode: string;
  }[];
  details: {
    id_d: number;
    outcomes: string;
  }[];
}

class JobOccupationService {
  // SFIA Services
  
  /**
   * Get all SFIA jobs with basic information
   */
  async getAllSFIAJobs(): Promise<{ code_job: string; job_name: string | null; overall: string | null }[]> {
    try {
      const jobs = await prismaSfia.jobs.findMany({
        select: {
          code_job: true,
          job_name: true,
          overall: true,
        },
        orderBy: {
          job_name: 'asc',
        },
      });
      return jobs;
    } catch (error) {
      throw new Error(`Failed to fetch SFIA jobs: ${error}`);
    }
  }

  /**
   * Get detailed SFIA job description by job code
   */
  async getSFIAJobByCode(codeJob: string): Promise<SFIAJobDescription | null> {
    try {
      const job = await prismaSfia.jobs.findUnique({
        where: { code_job: codeJob },
        include: {
          Category: {
            select: {
              id: true,
              category_text: true,
            },
          },
          Levels: {
            include: {
              Description: {
                include: {
                  Skills: {
                    select: {
                      id: true,
                      skill_text: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              level_name: 'asc',
            },
          },
        },
      });

      if (!job) return null;

      return {
        code_job: job.code_job,
        job_name: job.job_name,
        overall: job.overall,
        note: job.note,
        category: job.Category ? {
          id: job.Category.id,
          category_text: job.Category.category_text,
        } : undefined,
        levels: job.Levels.map(level => ({
          id: level.id,
          level_name: level.level_name,
          descriptions: level.Description.map(desc => ({
            id: desc.id,
            description_text: desc.description_text,
            skills: desc.Skills.map(skill => ({
              id: skill.id,
              skill_text: skill.skill_text,
            })),
          })),
        })),
      };
    } catch (error) {
      throw new Error(`Failed to fetch SFIA job by code ${codeJob}: ${error}`);
    }
  }

  /**
   * Search SFIA jobs by name or description
   */
  async searchSFIAJobs(searchTerm: string): Promise<{ code_job: string; job_name: string | null; overall: string | null }[]> {
    try {
      const jobs = await prismaSfia.jobs.findMany({
        where: {
          OR: [
            {
              job_name: {
                contains: searchTerm,
              },
            },
            {
              overall: {
                contains: searchTerm,
              },
            },
          ],
        },
        select: {
          code_job: true,
          job_name: true,
          overall: true,
        },
        orderBy: {
          job_name: 'asc',
        },
      });
      return jobs;
    } catch (error) {
      throw new Error(`Failed to search SFIA jobs: ${error}`);
    }
  }

  /**
   * Get SFIA jobs by category
   */
  async getSFIAJobsByCategory(categoryId: number): Promise<{ code_job: string; job_name: string | null; overall: string | null }[]> {
    try {
      const jobs = await prismaSfia.jobs.findMany({
        where: {
          category_id: categoryId,
        },
        select: {
          code_job: true,
          job_name: true,
          overall: true,
        },
        orderBy: {
          job_name: 'asc',
        },
      });
      return jobs;
    } catch (error) {
      throw new Error(`Failed to fetch SFIA jobs by category: ${error}`);
    }
  }

  // TPQI Services

  /**
   * Get all TPQI occupations
   */
  async getAllTPQIOccupations(): Promise<{ id_occupational: number; name_occupational: string }[]> {
    try {
      const occupations = await prismaTpqi.occupational.findMany({
        select: {
          id_occupational: true,
          name_occupational: true,
        },
        orderBy: {
          name_occupational: 'asc',
        },
      });
      return occupations;
    } catch (error) {
      throw new Error(`Failed to fetch TPQI occupations: ${error}`);
    }
  }

  /**
   * Get detailed TPQI occupation data by ID
   */
  async getTPQIOccupationById(occupationId: number): Promise<TPQIOccupationData | null> {
    try {
      const occupation = await prismaTpqi.occupational.findUnique({
        where: { id_occupational: occupationId },
        include: {
          unit_occupational: {
            include: {
              unit_code: {
                include: {
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
                    select: {
                      id_knowledge: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!occupation) return null;

      // Get knowledge details separately due to the missing relation
      const knowledgeIds = occupation.unit_occupational.flatMap(
        uo => uo.unit_code.u_knowledge.map(uk => uk.id_knowledge)
      );
      
      const knowledgeData = await prismaTpqi.knowledge.findMany({
        where: {
          id_knowledge: {
            in: knowledgeIds,
          },
        },
      });

      return {
        id_occupational: occupation.id_occupational,
        name_occupational: occupation.name_occupational,
        unit_codes: occupation.unit_occupational.map(uo => ({
          id_unit_code: uo.unit_code.id_unit_code,
          unit_code: uo.unit_code.unit_code,
          name: uo.unit_code.name,
          description_unitcode: uo.unit_code.description_unitcode,
          skills: uo.unit_code.u_skill.map(us => ({
            id_skill: us.skill.id_skill,
            name_skill: us.skill.name_skill,
          })),
          knowledge: uo.unit_code.u_knowledge.map(uk => {
            const knowledge = knowledgeData.find(k => k.id_knowledge === uk.id_knowledge);
            return {
              id_knowledge: uk.id_knowledge,
              name_knowledge: knowledge?.name_knowledge || '',
            };
          }),
        })),
      };
    } catch (error) {
      throw new Error(`Failed to fetch TPQI occupation by ID ${occupationId}: ${error}`);
    }
  }

  /**
   * Get all TPQI careers
   */
  async getAllTPQICareers(): Promise<{ id_career: number; name_career: string }[]> {
    try {
      const careers = await prismaTpqi.career.findMany({
        select: {
          id_career: true,
          name_career: true,
        },
        orderBy: {
          name_career: 'asc',
        },
      });
      return careers;
    } catch (error) {
      throw new Error(`Failed to fetch TPQI careers: ${error}`);
    }
  }

  /**
   * Get TPQI career levels by career ID
   */
  async getTPQICareerLevels(careerId: number): Promise<TPQICareerLevelData[]> {
    try {
      const careerLevels = await prismaTpqi.career_level.findMany({
        where: { id_career: careerId },
        include: {
          career: {
            select: {
              id_career: true,
              name_career: true,
            },
          },
          level: {
            select: {
              id_level: true,
              name_level: true,
            },
          },
          cl_skills: {
            include: {
              skill: {
                select: {
                  id_skill: true,
                  name_skill: true,
                },
              },
            },
          },
          cl_knowledge: {
            select: {
              id_knowledge: true,
            },
          },
          cl_uc: {
            include: {
              unit_code: {
                select: {
                  id_unit_code: true,
                  unit_code: true,
                  name: true,
                  description_unitcode: true,
                },
              },
            },
          },
          all_details: {
            include: {
              details: {
                select: {
                  id_d: true,
                  outcomes: true,
                },
              },
            },
          },
        },
      });

      // Get knowledge details separately
      const result: TPQICareerLevelData[] = [];
      
      for (const careerLevel of careerLevels) {
        const knowledgeIds = careerLevel.cl_knowledge.map(ck => ck.id_knowledge);
        const knowledgeData = await prismaTpqi.knowledge.findMany({
          where: {
            id_knowledge: {
              in: knowledgeIds,
            },
          },
        });

        result.push({
          id_career_level: careerLevel.id_career_level,
          career: {
            id_career: careerLevel.career.id_career,
            name_career: careerLevel.career.name_career,
          },
          level: {
            id_level: careerLevel.level.id_level,
            name_level: careerLevel.level.name_level,
          },
          skills: careerLevel.cl_skills.map(cs => ({
            id_skill: cs.skill.id_skill,
            name_skill: cs.skill.name_skill,
          })),
          knowledge: knowledgeData.map(k => ({
            id_knowledge: k.id_knowledge,
            name_knowledge: k.name_knowledge,
          })),
          unit_codes: careerLevel.cl_uc.map(cu => ({
            id_unit_code: cu.unit_code.id_unit_code,
            unit_code: cu.unit_code.unit_code,
            name: cu.unit_code.name,
            description_unitcode: cu.unit_code.description_unitcode,
          })),
          details: careerLevel.all_details.map(ad => ({
            id_d: ad.details.id_d,
            outcomes: ad.details.outcomes,
          })),
        });
      }

      return result;
    } catch (error) {
      throw new Error(`Failed to fetch TPQI career levels for career ${careerId}: ${error}`);
    }
  }

  /**
   * Search TPQI occupations by name
   */
  async searchTPQIOccupations(searchTerm: string): Promise<{ id_occupational: number; name_occupational: string }[]> {
    try {
      const occupations = await prismaTpqi.occupational.findMany({
        where: {
          name_occupational: {
            contains: searchTerm,
          },
        },
        select: {
          id_occupational: true,
          name_occupational: true,
        },
        orderBy: {
          name_occupational: 'asc',
        },
      });
      return occupations;
    } catch (error) {
      throw new Error(`Failed to search TPQI occupations: ${error}`);
    }
  }

  /**
   * Get all TPQI sectors
   */
  async getAllTPQISectors(): Promise<{ id_sector: number; name_sector: string }[]> {
    try {
      const sectors = await prismaTpqi.sector.findMany({
        select: {
          id_sector: true,
          name_sector: true,
        },
        orderBy: {
          name_sector: 'asc',
        },
      });
      return sectors;
    } catch (error) {
      throw new Error(`Failed to fetch TPQI sectors: ${error}`);
    }
  }

  /**
   * Get unit codes by sector
   */
  async getTPQIUnitCodesBySector(sectorId: number): Promise<{ id_unit_code: number; unit_code: string; name: string; description_unitcode: string }[]> {
    try {
      const unitSectors = await prismaTpqi.unit_sector.findMany({
        where: { id_sector: sectorId },
        include: {
          unit_code: {
            select: {
              id_unit_code: true,
              unit_code: true,
              name: true,
              description_unitcode: true,
            },
          },
        },
      });

      return unitSectors.map(us => us.unit_code);
    } catch (error) {
      throw new Error(`Failed to fetch TPQI unit codes by sector ${sectorId}: ${error}`);
    }
  }
  /**
   * Get SFIA job name and description by job code (ID)
   */
  async getSFIAJobInfoByCode(codeJob: string): Promise<{ code_job: string; job_name: string | null; overall: string | null; note: string | null } | null> {
    try {
      const job = await prismaSfia.jobs.findUnique({
        where: { code_job: codeJob },
        select: {
          code_job: true,
          job_name: true,
          overall: true,
          note: true,
        },
      });
      return job;
    } catch (error) {
      throw new Error(`Failed to fetch SFIA job info by code ${codeJob}: ${error}`);
    }
  }

  /**
   * Get TPQI career name and description by career ID
   */
  async getTPQICareerInfoById(careerId: number): Promise<{ id_career: number; name_career: string } | null> {
    try {
      const career = await prismaTpqi.career.findUnique({
        where: { id_career: careerId },
        select: {
          id_career: true,
          name_career: true,
        },
      });
      return career;
    } catch (error) {
      throw new Error(`Failed to fetch TPQI career info by ID ${careerId}: ${error}`);
    }
  }

  /**
   * Get TPQI occupation name by occupation ID
   */
  async getTPQIOccupationInfoById(occupationId: number): Promise<{ id_occupational: number; name_occupational: string } | null> {
    try {
      const occupation = await prismaTpqi.occupational.findUnique({
        where: { id_occupational: occupationId },
        select: {
          id_occupational: true,
          name_occupational: true,
        },
      });
      return occupation;
    } catch (error) {
      throw new Error(`Failed to fetch TPQI occupation info by ID ${occupationId}: ${error}`);
    }
  }

  /**
   * Get TPQI unit code details by unit code ID
   */
  async getTPQIUnitCodeInfoById(unitCodeId: number): Promise<{ id_unit_code: number; unit_code: string; name: string; description_unitcode: string } | null> {
    try {
      const unitCode = await prismaTpqi.unit_code.findUnique({
        where: { id_unit_code: unitCodeId },
        select: {
          id_unit_code: true,
          unit_code: true,
          name: true,
          description_unitcode: true,
        },
      });
      return unitCode;
    } catch (error) {
      throw new Error(`Failed to fetch TPQI unit code info by ID ${unitCodeId}: ${error}`);
    }
  }

  /**
   * Get TPQI skill name by skill ID
   */
  async getTPQISkillInfoById(skillId: number): Promise<{ id_skill: number; name_skill: string } | null> {
    try {
      const skill = await prismaTpqi.skill.findUnique({
        where: { id_skill: skillId },
        select: {
          id_skill: true,
          name_skill: true,
        },
      });
      return skill;
    } catch (error) {
      throw new Error(`Failed to fetch TPQI skill info by ID ${skillId}: ${error}`);
    }
  }

  /**
   * Get TPQI knowledge name by knowledge ID
   */
  async getTPQIKnowledgeInfoById(knowledgeId: number): Promise<{ id_knowledge: number; name_knowledge: string } | null> {
    try {
      const knowledge = await prismaTpqi.knowledge.findUnique({
        where: { id_knowledge: knowledgeId },
        select: {
          id_knowledge: true,
          name_knowledge: true,
        },
      });
      return knowledge;
    } catch (error) {
      throw new Error(`Failed to fetch TPQI knowledge info by ID ${knowledgeId}: ${error}`);
    }
  }

  /**
   * Get TPQI level name by level ID
   */
  async getTPQILevelInfoById(levelId: number): Promise<{ id_level: number; name_level: string } | null> {
    try {
      const level = await prismaTpqi.level.findUnique({
        where: { id_level: levelId },
        select: {
          id_level: true,
          name_level: true,
        },
      });
      return level;
    } catch (error) {
      throw new Error(`Failed to fetch TPQI level info by ID ${levelId}: ${error}`);
    }
  }

  /**
   * Get SFIA category info by category ID
   */
  async getSFIACategoryInfoById(categoryId: number): Promise<{ id: number; category_text: string | null } | null> {
    try {
      const category = await prismaSfia.category.findUnique({
        where: { id: categoryId },
        select: {
          id: true,
          category_text: true,
        },
      });
      return category;
    } catch (error) {
      throw new Error(`Failed to fetch SFIA category info by ID ${categoryId}: ${error}`);
    }
  }

  /**
   * Get SFIA level info by level ID
   */
  async getSFIALevelInfoById(levelId: number): Promise<{ id: number; level_name: string | null; code_job: string | null } | null> {
    try {
      const level = await prismaSfia.levels.findUnique({
        where: { id: levelId },
        select: {
          id: true,
          level_name: true,
          code_job: true,
        },
      });
      return level;
    } catch (error) {
      throw new Error(`Failed to fetch SFIA level info by ID ${levelId}: ${error}`);
    }
  }
}

export default new JobOccupationService();

// console.log("JobOccupationService initialized");
// Uncomment the line below to test the service directly
const jobOccupationService = new JobOccupationService();

// jobOccupationService.getAllSFIAJobs().then(console.log).catch(console.error);
// jobOccupationService.getSFIAJobByCode("PROG").then(console.log).catch(console.error);
// jobOccupationService.getTPQIOccupationById(571).then(console.log).catch(console.error);
// jobOccupationService.getTPQICareerLevels(1)
//   .then(data => {
//     console.dir(data, { depth: null });
//   })
//   .catch(console.error);
// jobOccupationService.getTPQICareerInfoById(1).then(console.log).catch(console.error);
jobOccupationService.getTPQIOccupationInfoById(1).then(console.log).catch(console.error);
// jobOccupationService.getTPQIUnitCodeInfoById(1).then(console.log).catch(console.error);
// jobOccupationService.getTPQISkillInfoById(1).then(console.log).catch(console.error);
// jobOccupationService.getTPQIKnowledgeInfoById(1).then(console.log).catch(console.error);
// jobOccupationService.getTPQILevelInfoById(1).then(console.log).catch(console.error);
// jobOccupationService.getSFIACategoryInfoById(1).then(console.log).catch(console.error);
// jobOccupationService.getSFIALevelInfoById(1).then(console.log).catch(console.error);

