import { DatabaseManagement } from "@Utils/DatabaseManagement";
import { prismaCompetency, prismaTpqi, prismaSfia } from "./prismaClients";

/**
 * A mapping from model name (string) to DatabaseManagement instance.
 */
type ManagerMap = Record<string, DatabaseManagement<any>>;

/**
 * Loops over all top‐level properties of a PrismaClient instance, picks out
 * those that look like model delegates (have create() and findMany()), and
 * wraps each one in a DatabaseManagement.  The DatabaseManagement constructor
 * will default actor="system" and use FileLogger by default.
 *
 * @param client   A PrismaClient (e.g. prismaTpqi) whose top‐level keys are models.
 * @returns        An object mapping each modelName to new DatabaseManagement(client[modelName])
 */
function buildManagers(client: any): ManagerMap {
  const managers: ManagerMap = {};

  for (const modelName of Object.keys(client)) {
    const delegate = client[modelName];
    if (delegate && typeof delegate === "object" && typeof delegate.create === "function" && typeof delegate.findMany === "function") {
      managers[modelName] = new DatabaseManagement(delegate);
    }
  }

  return managers;
}

export const TPQI = buildManagers(prismaTpqi);
export const SFIA = buildManagers(prismaSfia);
export const COMPETENCY = buildManagers(prismaCompetency);
