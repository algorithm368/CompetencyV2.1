// 1. IMPORTS
// =================================
import { prismaSfia } from "@Database/prismaClients";

// 2. TYPE DEFINITIONS (for better readability and type safety)
// =================================
export interface JobSkill {
  id: number;
  skill_text: string;
}

export interface JobLevel {
  id: number;
  level_name: string;
  description?: string;
  skills: JobSkill[]; // Changed to be non-optional for consistency
}

// 3. FUNCTION DEFINITION
// =================================
/**
 * Fetches all proficiency levels for a specific SFIA job code,
 * including their descriptions and associated skills.
 *
 * @param jobCode The SFIA code for the job (e.g., "PROG", "DBAD").
 * @returns A Promise that resolves to an array of level objects.
 * @throws {Error} if the job code is empty or not found in the database.
 */
export async function getJobLevels(jobCode: string): Promise<JobLevel[]> {
  const normalizedJobCode = jobCode?.trim();
  if (!normalizedJobCode) {
    // A more specific error for an empty/null input
    throw new Error("Job code cannot be empty.");
  }

  try {
    // COMBINED QUERY: Fetch all data in a single database call.
    // This is more performant than making two separate calls.
    const levels = await prismaSfia.level.findMany({
      where: { code_job: normalizedJobCode },
      select: {
        id: true,
        level_name: true,
        // Assuming a one-to-one or one-to-few relationship between Level and Description.
        // If a level can have multiple descriptions, this logic may need adjustment.
        Description: {
          select: {
            description_text: true,
            Skills: {
              select: {
                id: true,
                skill_text: true,
              },
            },
          },
          // Only take the first description related to the level.
          take: 1,
        },
      },
      orderBy: { id: "asc" },
    });

    // Check for results AFTER the query. If the array is empty, the job code was not found.
    // This provides the same user-friendly error without the extra database call.
    if (levels.length === 0) {
      throw new Error(`Job with code "${jobCode}" not found in SFIA database.`);
    }

    // Process the data using modern JS (Optional Chaining) for clarity and safety.
    return levels.map((level): JobLevel => {
      // Use Optional Chaining (?.) and Nullish Coalescing (??) to safely access nested data.
      const firstDescription = level.Description?.[0];
      const skills =
        firstDescription?.Skills?.filter(
          (skill): skill is JobSkill => skill.skill_text !== null
        ) ?? [];

      return {
        id: level.id,
        level_name: level.level_name ?? "Unknown Level", // Use ?? for clarity
        description: firstDescription?.description_text ?? undefined,
        skills, // Always return an array, even if it's empty
      };
    });
  } catch (error) {
    // Log the error for debugging but re-throw to let the caller handle it.
    console.error(`Error fetching levels for job code ${jobCode}:`, error);
    throw error;
  }
}