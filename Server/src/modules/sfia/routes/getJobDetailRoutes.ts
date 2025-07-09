import { Router, RequestHandler } from "express";
import { getJobDetailController } from "../controllers/getJobDetailController";

const router = Router();

/**
 * @route   GET /api/sfia/job-details/:jobCode
 * @desc    Get detailed job information including skills and levels for a specific SFIA job code
 * @params  jobCode: string - The SFIA code for the job (e.g., "PROG", "DBAD")
 * @access  Public
 * @example
 *   GET /api/sfia/job-details/PROG
 *   Response: {
 *     success: true,
 *     data: {
 *       competency: {
 *         competency_id: "PROG",
 *         competency_name: "Programming/software development",
 *         overall: "The application of mathematical and scientific principles...",
 *         note: "Programming includes...",
 *         category: "Technical skills",
 *         levels: [
 *           {
 *             level: 1,
 *             level_name: "Level 1",
 *             description: "Uses existing tools...",
 *             skills: [...]
 *           }
 *         ]
 *       }
 *     }
 *   }
 */
router.get("/:jobCode", getJobDetailController as RequestHandler);

export default router;
