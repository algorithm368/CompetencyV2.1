import { DatabaseManagement } from "@Utils/databaseUtils";
import { prismaCompetency, prismaTpqi, prismaSfia } from "./prismaClients";
import { DbLogger } from "@Admin/services/logger/DbLogger";
import { Logger } from "@Admin/services/logger/LoggerInterface";

const dbLogger: Logger = new DbLogger();

type ManagerMap = Record<string, DatabaseManagement<any>>;

function buildManagers(client: any, logger: Logger = dbLogger): ManagerMap {
  const managers: ManagerMap = {};

  for (const modelName of Object.keys(client)) {
    const delegate = client[modelName];
    if (delegate && typeof delegate === "object" && typeof delegate.create === "function" && typeof delegate.findMany === "function") {
      managers[modelName] = new DatabaseManagement(delegate, "system", logger);
    }
  }

  return managers;
}

export const TPQI = buildManagers(prismaTpqi);
export const SFIA = buildManagers(prismaSfia);
export const COMPETENCY = buildManagers(prismaCompetency);

// raw prisma clients
export const RAW = {
  COMPETENCY: prismaCompetency,
  SFIA: prismaSfia,
  TPQI: prismaTpqi,
};
