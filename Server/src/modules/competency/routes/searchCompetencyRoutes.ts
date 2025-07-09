import { Router } from "express";
import {
  getCompetencies,
  searchCompetency,
} from "@Competency/controllers/searchCompetencyController";

const router = Router();

/**
 * @route   GET /api/competency/competency/:dbType
 * @desc    Get all careers from specified database (e.g., sfia or tpqi)
 * @params  dbType: string - "sfia" | "tpqi"
 * @access  Public
 * @example
 *   GET /api/competency/Competencies/sfia
 *   Response: ["Software Engineer", "Data Scientist"]
 */
router.get("/:dbType", getCompetencies);


/**
 * @route   POST /api/competency/Competencies/:dbType/search
 * @desc    Search careers by name from the specified database
 * @params  dbType: string - "sfia" | "tpqi"
 * @body    { searchTerm: string }
 * @access  Public
 * @example
 *   POST /api/competency/Competencies/tpqi/search
 *   Body: { "searchTerm": "sec" }
 *   Response: ["Security Analyst", "Cybersecurity Engineer"]
 */
router.post("/:dbType", searchCompetency);


/**
 * @route   GET /api/competency/Competencies/
 * @desc    Health check for the search Competency route
 * @access  Public
 * @example
 *   GET /api/competency/Competencies/
 *   Response: "Hello from search career"
 */
router.get("/", (req, res) => {
  res.send("Hello from search Competency");
});

export default router;
