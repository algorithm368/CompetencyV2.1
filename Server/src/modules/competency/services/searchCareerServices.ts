import { PrismaClient } from "@prisma/client_sfia";

const prisma = new PrismaClient();

// Get all job name
async function getJobs() {
  try {
    const jobs = await prisma.jobs.findMany({
      select: {
        job_name: true,
      },
      orderBy: {
        job_name: "asc",
      },
    });
    return jobs.map((job) => job.job_name);
  } catch (error) {
    console.error("Error fetching job names:", error);
    throw error;
  }
}

//
async function searchJobByName(searchTerm: string) {
  try {
    const jobs = await prisma.jobs.findMany({
      where: {
        job_name: {
          contains: searchTerm,
        },
      },
      select: {
        job_name: true,
      },
      orderBy: {
        job_name: "asc",
      },
    });
    return jobs.map((job) => job.job_name);
  } catch (error) {
    console.error("Error searching jobs by name:", error);
    throw error;
  }
}

searchJobByName("busi").then((job) => console.log(job));
