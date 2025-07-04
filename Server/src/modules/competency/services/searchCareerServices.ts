import { prismaSfia, prismaTpqi } from "@Database/prismaClients";

type DBType = "sfia" | "tpqi"

// Get all job name
async function getJobs(dbType: DBType) {
  if (dbType === "sfia") {
    try {
      const jobs = await prismaSfia.jobs.findMany({
        select: { job_name: true },
        orderBy: { job_name: "asc" },
      });
      return jobs.map((job: any) => job.job_name);
    } catch (error) {
      console.error("Error fetching SFIA job names:", error);
      throw error;
    }
  } else {
    try {
      const careers = await prismaTpqi.occupational.findMany({
        select: { name_occupational: true },
        orderBy: { name_occupational: "asc" },
      });
      return careers.map((career: any) => career.name_occupational);
    } catch (error) {
      console.error("Error fetching TPQI career names:", error);
      throw error;
    }
  }
}

async function searchCareer(
  dbType: DBType,
  searchTerm: string
): Promise<string[]> {
  const nomalizedSearchTerm = searchTerm.toLowerCase().trim();

  if (!nomalizedSearchTerm) {
    return [];
  }

  if (dbType === "sfia") {
    try {
      const jobs = await prismaSfia.jobs.findMany({
        where: {
          job_name: {
            contains: nomalizedSearchTerm,
          },
        },
        select: { job_name: true },
        orderBy: { job_name: "asc" },
      });
      return jobs.map((job: any) => job.job_name);
    } catch (error) {
      console.error("Error searching SFIA job names:", error);
      throw error;
    }
  } else if (dbType === "tpqi") {
    try {
      const careers = await prismaTpqi.occupational.findMany({
        where: {
          name_occupational: {
            contains: nomalizedSearchTerm,
          },
        },
        select: { name_occupational: true },
        orderBy: { name_occupational: "asc" },
      });
      return careers.map((career: any) => career.name_occupational);
    } catch (error) {
      console.error("Error searching TPQI career names:", error);
      throw error;
    }
  }
  return [];
}

// getJobs("tpqi").then(result => console.log(result));
// searchCareer("sfia", "develop").then(result => console.log(result));
searchCareer("tpqi", "ช่างติดตั้งระบบ").then((result) => console.log(result));;