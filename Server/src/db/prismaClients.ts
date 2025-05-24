import { PrismaClient as CompetencyClient } from "@prisma/client_competency";
import { PrismaClient as SFIAClient } from "@prisma/client_sfia";
import { PrismaClient as TPQIClient } from "@prisma/client_tpqi";

export const prismaCompetency = new CompetencyClient({
  datasources: {
    db: { url: process.env.DATABASE_URL_COMPETENCY },
  },
});

export const prismaTpqi = new TPQIClient({
  datasources: {
    db: { url: process.env.DATABASE_URL_TPQI },
  },
});

export const prismaSfia = new SFIAClient({
  datasources: {
    db: { url: process.env.DATABASE_URL_SFIA },
  },
});
