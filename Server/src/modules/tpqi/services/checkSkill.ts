import { prismaTpqi } from "../../../db/prismaClients";

async function checkSkills() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL_TPQI);
  try {
    const skills = await prismaTpqi.skill.findMany();
    console.log(skills);
    if (skills.length === 0) {
      console.log("No skills found in the database.");
    } else {
      console.log("Skills in the database:");
      for (const skill of skills) {
        console.log(`ID: ${skill.id}, Name: ${skill.name ?? "(no name)"}`);
      }
    }
  } catch (error) {
    console.error("Error fetching skil ls:", error);
  }
}

checkSkills();
