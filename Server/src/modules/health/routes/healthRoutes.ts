import { Router } from "express";
import { getHealthStatus, getDatabaseStatus } from "../controllers/healthController";

const healthRoutes = Router();

/**
 * Health Routes
 * 
 * Provides endpoints for monitoring system health and database connectivity
 */

/**
 * @route GET /api/health
 * @description Basic health check endpoint
 * @returns {Object} Basic system status
 */
healthRoutes.get("/", getHealthStatus);

/**
 * @route GET /api/health/database
 * @description Database health check endpoint
 * @returns {Object} Detailed database connection status
 */
healthRoutes.get("/database", getDatabaseStatus);

export default healthRoutes;
