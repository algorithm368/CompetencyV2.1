import { Router } from "express";
import {
  getCompetencies,
  searchCompetency,
} from "@Competency/controllers/searchCompetencyController";

const router = Router();

/**
 * @route   GET /api/competency/search/:dbType
 * @desc    Get all careers from specified database (e.g., sfia or tpqi)
 * @params  dbType: string - "sfia" | "tpqi"
 * @access  Public
 * @example
 *   GET /api/competency/search/sfia
 *   Response: ["Software Engineer", "Data Scientist"]
 */
router.get("/:dbType", getCompetencies);


/**
 * @route   POST /api/competency/search/:dbType
 * @desc    Search careers by name from the specified database
 * @params  dbType: string - "sfia" | "tpqi"
 * @body    { searchTerm: string }
 * @access  Public
 * @example
 *   POST /api/competency/search/tpqi
 *   Body: { "searchTerm": "sec" }
 *   Response: ["Security Analyst", "Cybersecurity Engineer"]
 */
router.post("/:dbType", searchCompetency);


/**
 * @route   GET /api/competency/
 * @desc    Health check for the search Competency route
 * @access  Public
 * @example
 *   GET /api/competency/
 *   Response: "Hello from search career"
 */
router.get("/", (req, res) => {
  res.send("Hello from search Competency");
});

export default router;
