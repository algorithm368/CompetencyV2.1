import { Router, RequestHandler } from "express";
import { getSkillLevelsController } from "../controllers/getSkillLevelsController";

const router = Router();

/**
 * @route   GET /api/sfia/skill-levels/:skillCode
 * @desc    Get all proficiency levels for a specific SFIA skill code
 * @params  skillCode: string - The SFIA code for the skill (e.g., "PROG", "DBAD")
 * @access  Public
 * @example
 *   GET /api/sfia/skill-levels/PROG
 *   Response: [
 *     { id: 1, name: "Level 1", description: "Description for Level 1", skills: [...] },
 *     { id: 2, name: "Level 2", description: "Description for Level 2", skills: [...] }
 *   ]
 */
router.get("/:skillCode", getSkillLevelsController as RequestHandler);

export default router;
