import { Router, RequestHandler } from "express";
import { getJobLevelsController } from "../controllers/getJobLevelsController";
import { getJobDetailController } from "../controllers/getJobDetailController";

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
router.get("/:jobCode", getJobDetailController as RequestHandler);

export default router;