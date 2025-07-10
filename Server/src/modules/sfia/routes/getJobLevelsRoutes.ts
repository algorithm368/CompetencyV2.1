import { Router, RequestHandler } from "express";
import { getJobLevelsController } from "../controllers/getJobLevelsController";

const router = Router();

/**
 * @route   GET /api/sfia/job-levels/:jobCode
 * @desc    Get all proficiency levels for a specific SFIA job code
 * @params  jobCode: string - The SFIA code for the job (e.g., "PROG", "DBAD")
 * @access  Public
 * @example
 *   GET /api/sfia/job-levels/PROG
 *   Response: [
 *     { id: 1, level_name: "Level 1", description: "Description for Level 1", skills: [...] },
 *     { id: 2, level_name: "Level 2", description: "Description for Level 2", skills: [...] }
 *   ]
 */
router.get("/:jobCode", getJobLevelsController as RequestHandler);

export default router;