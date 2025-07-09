// =================================
// Job & Occupation Routes
// =================================
// Defines API routes for both SFIA jobs and TPQI occupations

import { Router } from "express";
import { JobOccupationController } from "@Competency/controllers/jobOccupationController";

const router = Router();

// =================================
// Job Routes (SFIA)
// =================================

/**
 * @route   GET /api/jobs/search
 * @desc    Search for jobs by job code or name
 * @query   q: string - Search term
 * @access  Public
 * @example
 *   GET /api/jobs/search?q=PROG
 *   Response: { success: true, count: 2, data: [...] }
 */
router.get("/jobs/search", JobOccupationController.searchJobs);

/**
 * @route   GET /api/jobs/:jobCode
 * @desc    Get complete job data by SFIA job code
 * @params  jobCode: string - The SFIA job code (e.g., "PROG", "DBAD")
 * @access  Public
 * @example
 *   GET /api/jobs/PROG
 *   Response: { success: true, data: { code_job: "PROG", job_name: "...", levels: [...] } }
 */
router.get("/jobs/:jobCode", JobOccupationController.getJob);

/**
 * @route   GET /api/jobs/:jobCode/description
 * @desc    Get job description with levels and skills
 * @params  jobCode: string - The SFIA job code
 * @access  Public
 * @example
 *   GET /api/jobs/PROG/description
 *   Response: { success: true, data: { job_name: "...", levels: [...] } }
 */
router.get("/jobs/:jobCode/description", JobOccupationController.getJobDescription);

// =================================
// Occupation Routes (TPQI)
// =================================

/**
 * @route   GET /api/occupations/search
 * @desc    Search for occupations by name
 * @query   q: string - Search term
 * @access  Public
 * @example
 *   GET /api/occupations/search?q=Developer
 *   Response: { success: true, count: 3, data: [...] }
 */
router.get("/occupations/search", JobOccupationController.searchOccupations);

/**
 * @route   GET /api/occupations/:occupationId
 * @desc    Get complete occupation data by ID
 * @params  occupationId: number - The TPQI occupation ID
 * @access  Public
 * @example
 *   GET /api/occupations/1
 *   Response: { success: true, data: { id_occupational: 1, name_occupational: "...", outcomes: [...] } }
 */
router.get("/occupations/:occupationId", JobOccupationController.getOccupation);

/**
 * @route   GET /api/occupations/:occupationId/outcomes
 * @desc    Get occupation outcomes and unit codes
 * @params  occupationId: number - The TPQI occupation ID
 * @access  Public
 * @example
 *   GET /api/occupations/1/outcomes
 *   Response: { success: true, data: { name_occupational: "...", outcomes: [...] } }
 */
router.get("/occupations/:occupationId/outcomes", JobOccupationController.getOccupationOutcomes);

// =================================
// Combined Routes
// =================================

/**
 * @route   GET /api/data/:identifier
 * @desc    Get data by identifier (auto-detects job code or occupation ID)
 * @params  identifier: string|number - Job code (string) or occupation ID (number)
 * @access  Public
 * @example
 *   GET /api/data/PROG (job code)
 *   GET /api/data/1 (occupation ID)
 *   Response: { success: true, type: "job|occupation", data: {...} }
 */
router.get("/data/:identifier", JobOccupationController.getDataByIdentifier);

export default router;
