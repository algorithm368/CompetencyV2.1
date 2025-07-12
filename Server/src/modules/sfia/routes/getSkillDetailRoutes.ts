import { Router, RequestHandler } from "express";
import { getSkillDetailController } from "../controllers/getSkillDetailController";

const router = Router();

/**
 * @route   GET /api/sfia/skill-details/:skillCode
 * @desc    Get detailed skill information including subskills and levels for a specific SFIA skill code
 * @params  skillCode: string - The SFIA code for the skill (e.g., "PROG", "DBAD")
 * @access  Public
 * @example
 *   GET /api/sfia/skill-details/PROG
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
 *             name: "Level 1",
 *             description: "Uses existing tools...",
 *             skills: [...]
 *           }
 *         ]
 *       }
 *     }
 *   }
 */
router.get("/:skillCode", getSkillDetailController as RequestHandler);

export default router;
