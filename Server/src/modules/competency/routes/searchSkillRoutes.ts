import { Router } from "express";
import {
  getSkills,
  searchSkill,
} from "@Competency/controllers/searchSkillController";

const router = Router();

/**
 * @route   GET /api/competency/skill/:dbType
 * @desc    Get all careers from specified database (e.g., sfia or tpqi)
 * @params  dbType: string - "sfia" | "tpqi"
 * @access  Public
 * @example
 *   GET /api/competency/Skills/sfia
 *   Response: ["Software Engineer", "Data Scientist"]
 */
router.get("/:dbType", getSkills);


/**
 * @route   POST /api/competency/Skills/:dbType/search
 * @desc    Search careers by name from the specified database
 * @params  dbType: string - "sfia" | "tpqi"
 * @body    { searchTerm: string }
 * @access  Public
 * @example
 *   POST /api/competency/Skills/tpqi/search
 *   Body: { "searchTerm": "sec" }
 *   Response: ["Security Analyst", "Cybersecurity Engineer"]
 */
router.post("/:dbType/search", searchSkill);


/**
 * @route   GET /api/competency/Skills/
 * @desc    Health check for the search Skill route
 * @access  Public
 * @example
 *   GET /api/competency/Skills/
 *   Response: "Hello from search career"
 */
router.get("/", (req, res) => {
  res.send("Hello from search Skill");
});

export default router;
