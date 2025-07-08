import { Router } from "express";
import {
  getJobs,
  searchJob,
} from "@Competency/controllers/searchJobController";

const router = Router();

/**
 * @route   GET /api/competency/jobs/:dbType
 * @desc    Get all careers from specified database (e.g., sfia or tpqi)
 * @params  dbType: string - "sfia" | "tpqi"
 * @access  Public
 * @example
 *   GET /api/competency/jobs/sfia
 *   Response: ["Software Engineer", "Data Scientist"]
 */
router.get("/:dbType", getJobs);


/**
 * @route   POST /api/competency/jobs/:dbType/search
 * @desc    Search careers by name from the specified database
 * @params  dbType: string - "sfia" | "tpqi"
 * @body    { searchTerm: string }
 * @access  Public
 * @example
 *   POST /api/competency/jobs/tpqi/search
 *   Body: { "searchTerm": "sec" }
 *   Response: ["Security Analyst", "Cybersecurity Engineer"]
 */
router.post("/:dbType/search", searchJob);


/**
 * @route   GET /api/competency/jobs/
 * @desc    Health check for the search job route
 * @access  Public
 * @example
 *   GET /api/competency/jobs/
 *   Response: "Hello from search career"
 */
router.get("/", (req, res) => {
  res.send("Hello from search Job");
});

export default router;
