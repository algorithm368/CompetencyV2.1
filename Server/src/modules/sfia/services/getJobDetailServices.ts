import { prismaSfia } from "../../../db/prismaClients";

export interface JobDetail {
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
      skills: Array<{
        id: number;
        skill_text: string | null;
      }>;
    }>;
  }>;
}

export interface JobSkillsAndLevels {
  competency: JobDetail | null;
  totalLevels: number;
  totalSkills: number;
}

/**
 * Search for job details including required skills and job levels by job_code
 * @param job_code - The job code to search for
 * @returns Promise<JobSkillsAndLevels | null>
 */
export async function getJobDetailsByCode(
  job_code: string
): Promise<JobSkillsAndLevels | null> {
  try {
    const jobData = await prismaSfia.jobs.findUnique({
      where: {
        code_job: job_code,
      },
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
            id: "asc",
          },
        },
      },
    });

    if (!jobData) {
      return null;
    }

    // Transform the data to match our interface
    const transformedJob: JobDetail = {
      competency_id: jobData.code_job,
      competency_name: jobData.job_name,
      overall: jobData.overall,
      note: jobData.note,
      category: jobData.Category,
      levels: jobData.Levels.map((level) => ({
        id: level.id,
        level_name: level.level_name,
        descriptions: level.Description.map((desc) => ({
          id: desc.id,
          description_text: desc.description_text,
          skills: desc.Skills,
        })),
      })),
    };

    // Calculate totals
    const totalLevels = jobData.Levels.length;
    const totalSkills = jobData.Levels.reduce((total, level) => {
      return (
        total +
        level.Description.reduce((descTotal, desc) => {
          return descTotal + desc.Skills.length;
        }, 0)
      );
    }, 0);

    return {
      competency: transformedJob,
      totalLevels,
      totalSkills,
    };
  } catch (error) {
    console.error("Error fetching job details:", error);
    throw new Error(`Failed to fetch job details for code: ${job_code}`);
  }
}
