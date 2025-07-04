import { prismaSfia, prismaTpqi } from "@Database/prismaClients";

type DBType = "sfia" | "tpqi";

interface DatabaseConfig {
  client: typeof prismaSfia | typeof prismaTpqi;
  table: string;
  field: string;
  errorPrefix: string;
}

// Configuration mapping for database types
const DB_CONFIG: Record<DBType, DatabaseConfig> = {
  sfia: {
    client: prismaSfia,
    table: "jobs",
    field: "job_name",
    errorPrefix: "SFIA job names",
  },
  tpqi: {
    client: prismaTpqi,
    table: "occupational",
    field: "name_occupational",
    errorPrefix: "TPQI career names",
  },
};

/**
 * Generic function to execute database queries with error handling
 */
async function executeQuery<T>(
  operation: string,
  dbType: DBType,
  queryFn: (config: DatabaseConfig) => Promise<T>
): Promise<T> {
  const config = DB_CONFIG[dbType];

  try {
    return await queryFn(config);
  } catch (error) {
    console.error(`Error ${operation} ${config.errorPrefix}:`, error);
    throw error;
  }
}

/**
 * Get all job/career names from the specified database
 */
export async function getJobs(dbType: DBType): Promise<string[]> {
  return executeQuery("fetching", dbType, async (config) => {
    const results = await (config.client as any)[config.table].findMany({
      select: { [config.field]: true },
      orderBy: { [config.field]: "asc" },
    });

    return results.map((item: any) => item[config.field]);
  });
}

/**
 * Search for job/career names containing the search term
 */
export async function searchCareer(
  dbType: DBType,
  searchTerm: string
): Promise<string[]> {
  const normalizedSearchTerm = searchTerm.toLowerCase().trim();

  if (!normalizedSearchTerm) {
    return [];
  }

  return executeQuery<string[]>("searching", dbType, async (config) => {
    const results = await(config.client as any)[config.table].findMany({
      where: {
        [config.field]: {
          contains: normalizedSearchTerm,
        },
      },
      select: { [config.field]: true },
      orderBy: { [config.field]: "asc" },
      take: 100, // Limit results for performance
    });

    return Object.freeze(
      results
        .map((item: any) => item[config.field])
        .filter(
          (name: any): name is string =>
            typeof name === "string" && name.length > 0
        )
    );
  });
}

// Example usage
// getJobs("tpqi").then(result => console.log(result));
// searchCareer("tpqi", "ช่างติดตั้งระบบ").then((result) => console.log(result));
// searchCareer("sfia", "secur").then(result => console.log(result));
