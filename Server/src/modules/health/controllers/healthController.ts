import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { checkDatabaseHealth } from "../services/healthService";

/**
 * Health Controller
 * 
 * Handles health check endpoints for monitoring system status,
 * including database connectivity and overall system health.
 */

/**
 * Basic health check endpoint
 * Returns simple status without database checks
 */
export const getHealthStatus = async (req: Request, res: Response) => {
  try {
    res.status(StatusCodes.OK).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "CompetencyV2.1",
      version: "2.1.0"
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

/**
 * Database health check endpoint
 * Returns detailed status of all database connections
 */
export const getDatabaseStatus = async (req: Request, res: Response) => {
  try {
    const databaseHealth = await checkDatabaseHealth();
    
    const allHealthy = Object.values(databaseHealth.databases).every(db => db.status === "healthy");
    const overallStatus = allHealthy ? "healthy" : "degraded";
    
    res.status(StatusCodes.OK).json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      ...databaseHealth
    });
  } catch (error) {
    console.error("Health check error:", error);
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Health check failed",
      databases: {
        sfia: { status: "unknown", error: "Health check failed" },
        tpqi: { status: "unknown", error: "Health check failed" },
        competency: { status: "unknown", error: "Health check failed" }
      }
    });
  }
};
