import { prismaSfia, prismaTpqi, prismaCompetency } from "@Database/prismaClients";

/**
 * Database Health Status Types
 */
export interface DatabaseStatus {
  status: "healthy" | "unhealthy" | "unknown";
  latency?: number;
  error?: string;
  lastCheck: string;
}

export interface DatabaseHealthResponse {
  databases: {
    sfia: DatabaseStatus;
    tpqi: DatabaseStatus;
    competency: DatabaseStatus;
  };
  summary: {
    total: number;
    healthy: number;
    unhealthy: number;
    unknown: number;
  };
}

/**
 * Health Service
 * 
 * Provides health check functionality for database connections
 * and overall system status monitoring.
 */

/**
 * Check the health of a single database connection
 * @param client - Prisma client instance
 * @param dbName - Name of the database for logging
 * @returns Database status information
 */
async function checkSingleDatabase(client: any, dbName: string): Promise<DatabaseStatus> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  try {
    // Use a simple query that works across different database schemas
    // $queryRaw allows us to execute a basic connection test
    await client.$queryRaw`SELECT 1 as test`;
    
    const latency = Date.now() - startTime;
    
    return {
      status: "healthy",
      latency,
      lastCheck: timestamp
    };
  } catch (error) {
    const latency = Date.now() - startTime;
    console.error(`Database ${dbName} health check failed:`, error);
    
    return {
      status: "unhealthy",
      latency,
      error: error instanceof Error ? error.message : "Unknown database error",
      lastCheck: timestamp
    };
  }
}

/**
 * Check the health of all database connections
 * @returns Comprehensive database health status
 */
export async function checkDatabaseHealth(): Promise<DatabaseHealthResponse> {
  try {
    // Run all database health checks in parallel for better performance
    const [sfiaStatus, tpqiStatus, competencyStatus] = await Promise.all([
      checkSingleDatabase(prismaSfia, "sfia"),
      checkSingleDatabase(prismaTpqi, "tpqi"),
      checkSingleDatabase(prismaCompetency, "competency")
    ]);

    const databases = {
      sfia: sfiaStatus,
      tpqi: tpqiStatus,
      competency: competencyStatus
    };

    // Calculate summary statistics
    const statuses = Object.values(databases);
    const summary = {
      total: statuses.length,
      healthy: statuses.filter(db => db.status === "healthy").length,
      unhealthy: statuses.filter(db => db.status === "unhealthy").length,
      unknown: statuses.filter(db => db.status === "unknown").length
    };

    return {
      databases,
      summary
    };
  } catch (error) {
    console.error("Error during database health check:", error);
    
    // Return error state for all databases
    const errorTimestamp = new Date().toISOString();
    const errorMessage = error instanceof Error ? error.message : "Health check failed";
    
    return {
      databases: {
        sfia: { status: "unknown", error: errorMessage, lastCheck: errorTimestamp },
        tpqi: { status: "unknown", error: errorMessage, lastCheck: errorTimestamp },
        competency: { status: "unknown", error: errorMessage, lastCheck: errorTimestamp }
      },
      summary: {
        total: 3,
        healthy: 0,
        unhealthy: 0,
        unknown: 3
      }
    };
  }
}

/**
 * Quick database connectivity test
 * Returns a simple boolean indicating if core databases are accessible
 */
export async function isSystemHealthy(): Promise<boolean> {
  try {
    const health = await checkDatabaseHealth();
    return health.summary.healthy >= 2; // At least 2 out of 3 databases should be healthy
  } catch (error) {
    console.error("System health check failed:", error);
    return false;
  }
}
