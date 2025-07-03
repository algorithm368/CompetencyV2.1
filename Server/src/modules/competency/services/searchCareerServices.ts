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

getJobs("tpqi").then((job) => console.log(job));

// async function searchJobByName(searchTerm: string) {
//   try {
//     const jobs = await prisma.jobs.findMany({
//       where: {
//         job_name: {
//           contains: searchTerm,
//         },
//       },
//       select: {
//         job_name: true,
//       },
//       orderBy: {
//         job_name: "asc",
//       },
//     });
//     return jobs.map((job) => job.job_name);
//   } catch (error) {
//     console.error("Error searching jobs by name:", error);
//     throw error;
//   }
// }

// searchJobByName("busi").then((job) => console.log(job));
