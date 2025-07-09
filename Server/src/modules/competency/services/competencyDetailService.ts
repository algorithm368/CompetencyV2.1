import { prismaSfia } from '../../../db/prismaClients';

export interface JobDetail {
  code_job: string;
  job_name: string | null;
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
      skills: Array<{
        id: number;
        skill_text: string | null;
      }>;
    }>;
  }>;
}

export interface JobSkillsAndLevels {
  job: JobDetail | null;
  totalLevels: number;
  totalSkills: number;
}

/**
 * Search for job details including required skills and job levels by job_code
 * @param job_code - The job code to search for
 * @returns Promise<JobSkillsAndLevels | null>
 */
export async function getJobDetailsByCode(job_code: string): Promise<JobSkillsAndLevels | null> {
  try {
    const jobData = await prismaSfia.jobs.findUnique({
      where: {
        code_job: job_code
      },
      include: {
        Category: {
          select: {
            id: true,
            category_text: true
          }
        },
        Levels: {
          include: {
            Description: {
              include: {
                Skills: {
                  select: {
                    id: true,
                    skill_text: true
                  }
                }
              }
            }
          },
          orderBy: {
            id: 'asc'
          }
        }
      }
    });

    if (!jobData) {
      return null;
    }

    // Transform the data to match our interface
    const transformedJob: JobDetail = {
      code_job: jobData.code_job,
      job_name: jobData.job_name,
      overall: jobData.overall,
      note: jobData.note,
      category: jobData.Category,
      levels: jobData.Levels.map(level => ({
        id: level.id,
        level_name: level.level_name,
        descriptions: level.Description.map(desc => ({
          id: desc.id,
          description_text: desc.description_text,
          skills: desc.Skills
        }))
      }))
    };

    // Calculate totals
    const totalLevels = jobData.Levels.length;
    const totalSkills = jobData.Levels.reduce((total, level) => {
      return total + level.Description.reduce((descTotal, desc) => {
        return descTotal + desc.Skills.length;
      }, 0);
    }, 0);

    return {
      job: transformedJob,
      totalLevels,
      totalSkills
    };

  } catch (error) {
    console.error('Error fetching job details:', error);
    throw new Error(`Failed to fetch job details for code: ${job_code}`);
  }
}

/**
 * Get all skills for a specific job and level
 * @param job_code - The job code
 * @param level_id - The level ID (optional)
 * @returns Promise<Array of skills>
 */
export async function getJobSkillsByLevel(job_code: string, level_id?: number) {
  try {
    const whereClause: any = {
      code_job: job_code
    };

    if (level_id) {
      whereClause.id = level_id;
    }

    const levels = await prismaSfia.levels.findMany({
      where: whereClause,
      include: {
        Description: {
          include: {
            Skills: {
              select: {
                id: true,
                skill_text: true,
                description_id: true
              }
            }
          }
        }
      },
      orderBy: {
        id: 'asc'
      }
    });

    const skills = levels.flatMap(level => 
      level.Description.flatMap(desc => 
        desc.Skills.map(skill => ({
          ...skill,
          level_id: level.id,
          level_name: level.level_name,
          description_text: desc.description_text
        }))
      )
    );

    return skills;

  } catch (error) {
    console.error('Error fetching job skills by level:', error);
    throw new Error(`Failed to fetch skills for job: ${job_code}`);
  }
}

/**
 * Get job summary with basic information
 * @param job_code - The job code
 * @returns Promise<Job basic info | null>
 */
export async function getJobSummary(job_code: string) {
  try {
    const job = await prismaSfia.jobs.findUnique({
      where: {
        code_job: job_code
      },
      select: {
        code_job: true,
        job_name: true,
        overall: true,
        note: true,
        Category: {
          select: {
            id: true,
            category_text: true
          }
        },
        _count: {
          select: {
            Levels: true
          }
        }
      }
    });

    return job;

  } catch (error) {
    console.error('Error fetching job summary:', error);
    throw new Error(`Failed to fetch job summary for code: ${job_code}`);
  }
}

/**
 * Search jobs by partial job_code or job_name
 * @param searchTerm - Term to search for
 * @returns Promise<Array of jobs>
 */
export async function searchJobs(searchTerm: string) {
  try {
    const jobs = await prismaSfia.jobs.findMany({
      where: {
        OR: [
          {
            code_job: {
              contains: searchTerm
            }
          },
          {
            job_name: {
              contains: searchTerm
            }
          }
        ]
      },
      include: {
        Category: {
          select: {
            id: true,
            category_text: true
          }
        },
        _count: {
          select: {
            Levels: true
          }
        }
      },
      orderBy: {
        code_job: 'asc'
      }
    });

    return jobs;

  } catch (error) {
    console.error('Error searching jobs:', error);
    throw new Error(`Failed to search jobs with term: ${searchTerm}`);
  }
}