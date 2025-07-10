import { Router, RequestHandler } from "express";
import { getUnitCodeDetailController } from "../controllers/getUnitcodeDetailController";

const router = Router();

/**
 * @route   GET /api/tpqi/unit-code-details/:unitCode
 * @desc    Get detailed unit code information including skills, knowledge, occupational and sector data for a specific TPQI unit code
 * @params  unitCode: string - The TPQI unit code (e.g., "ICT-LIGW-404B", "UNIT-123")
 * @access  Public
 * @example
 *   GET /api/tpqi/unit-code-details/ICT-LIGW-404B
 *   Response: {
 *     success: true,
 *     data: {
 *       competency: {
 *         competency_id: "ICT-LIGW-404B",
 *         competency_name: "Software Development Unit",
 *         overall: "Overall description of the competency unit",
 *         note: "ICT-LIGW-404B",
 *         occupational: [
 *           { id: 1, name_occupational: "Software Developer" }
 *         ],
 *         sector: [
 *           { id: 1, name_sector: "Information Technology" }
 *         ],
 *         skills: [
 *           { id: 1, name_skill: "Programming" }
 *         ],
 *         knowledge: [
 *           { id: 1, name_knowledge: "Software Engineering Principles" }
 *         ]
 *       },
 *       totalSkills: 1,
 *       totalKnowledge: 1,
 *       totalOccupational: 1,
 *       totalSector: 1
 *     }
 *   }
 */
router.get("/:unitCode", getUnitCodeDetailController as RequestHandler);

export default router;
