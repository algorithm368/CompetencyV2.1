import { Router } from "express";
import {
  getJobs,
  searchCareer,
} from "@Competency/controllers/searchCareerController";

const router = Router();

/**
 * @route   GET /api/competency/careers/:dbType
 * @desc    Get all careers from specified database (e.g., sfia or tpqi)
 * @params  dbType: string - "sfia" | "tpqi"
 * @access  Public
 * @example
 *   GET /api/competency/careers/sfia
 *   Response: ["Software Engineer", "Data Scientist"]
 */
router.get("/:dbType", getJobs);


/**
 * @route   POST /api/competency/careers/:dbType/search
 * @desc    Search careers by name from the specified database
 * @params  dbType: string - "sfia" | "tpqi"
 * @body    { searchTerm: string }
 * @access  Public
 * @example
 *   POST /api/competency/careers/tpqi/search
 *   Body: { "searchTerm": "sec" }
 *   Response: ["Security Analyst", "Cybersecurity Engineer"]
 */
router.post("/:dbType/search", searchCareer);


/**
 * @route   GET /api/competency/careers/
 * @desc    Health check for the search career route
 * @access  Public
 * @example
 *   GET /api/competency/careers/
 *   Response: "Hello from search career"
 */
router.get("/", (req, res) => {
  res.send("Hello from search career");
});

export default router;
