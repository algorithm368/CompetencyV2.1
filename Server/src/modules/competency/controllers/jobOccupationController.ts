// =================================
// Job & Occupation Controller
// =================================
// Handles HTTP requests for both SFIA jobs and TPQI occupations

import { Request, Response, NextFunction } from "express";
import {
  getJobData,
  getOccupationData,
  getDataById,
  searchJobs,
  searchOccupations,
} from "@Competency/services/jobOccupationService";

export class JobOccupationController {
  /**
   * Get SFIA job data by job code
   * GET /api/jobs/:jobCode
   */
  static async getJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobCode } = req.params;
      
      if (!jobCode || jobCode.trim() === '') {
        return res.status(400).json({ 
          error: "Job code is required and cannot be empty" 
        });
      }

      const jobData = await getJobData(jobCode);
      
      if (!jobData) {
        return res.status(404).json({ 
          error: `Job with code '${jobCode}' not found` 
        });
      }

      res.json({
        success: true,
        data: jobData,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get TPQI occupation data by occupation ID
   * GET /api/occupations/:occupationId
   */
  static async getOccupation(req: Request, res: Response, next: NextFunction) {
    try {
      const occupationId = parseInt(req.params.occupationId);
      
      if (isNaN(occupationId) || occupationId <= 0) {
        return res.status(400).json({ 
          error: "Valid occupation ID is required (positive number)" 
        });
      }

      const occupationData = await getOccupationData(occupationId);
      
      if (!occupationData) {
        return res.status(404).json({ 
          error: `Occupation with ID ${occupationId} not found` 
        });
      }

      res.json({
        success: true,
        data: occupationData,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get data by identifier (auto-detects job code or occupation ID)
   * GET /api/data/:identifier
   */
  static async getDataByIdentifier(req: Request, res: Response, next: NextFunction) {
    try {
      const { identifier } = req.params;
      
      if (!identifier || identifier.trim() === '') {
        return res.status(400).json({ 
          error: "Identifier is required" 
        });
      }

      // Try to parse as number first
      const numericId = parseInt(identifier);
      const searchIdentifier = isNaN(numericId) ? identifier : numericId;

      const result = await getDataById(searchIdentifier);
      
      if (!result) {
        return res.status(404).json({ 
          error: `No data found for identifier '${identifier}'` 
        });
      }

      res.json({
        success: true,
        type: result.type,
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search for jobs by job code or name
   * GET /api/jobs/search?q=searchTerm
   */
  static async searchJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string' || q.trim() === '') {
        return res.status(400).json({ 
          error: "Search query 'q' is required" 
        });
      }

      const jobs = await searchJobs(q);

      res.json({
        success: true,
        count: jobs.length,
        data: jobs,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search for occupations by name
   * GET /api/occupations/search?q=searchTerm
   */
  static async searchOccupations(req: Request, res: Response, next: NextFunction) {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string' || q.trim() === '') {
        return res.status(400).json({ 
          error: "Search query 'q' is required" 
        });
      }

      const occupations = await searchOccupations(q);

      res.json({
        success: true,
        count: occupations.length,
        data: occupations,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get job description with levels and skills
   * GET /api/jobs/:jobCode/description
   */
  static async getJobDescription(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobCode } = req.params;
      
      if (!jobCode || jobCode.trim() === '') {
        return res.status(400).json({ 
          error: "Job code is required" 
        });
      }

      const jobData = await getJobData(jobCode);
      
      if (!jobData) {
        return res.status(404).json({ 
          error: `Job with code '${jobCode}' not found` 
        });
      }

      // Return only description-related data
      const description = {
        job_name: jobData.job_name,
        overall: jobData.overall,
        note: jobData.note,
        category: jobData.category,
        levels: jobData.levels,
      };

      res.json({
        success: true,
        data: description,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get occupation outcomes
   * GET /api/occupations/:occupationId/outcomes
   */
  static async getOccupationOutcomes(req: Request, res: Response, next: NextFunction) {
    try {
      const occupationId = parseInt(req.params.occupationId);
      
      if (isNaN(occupationId) || occupationId <= 0) {
        return res.status(400).json({ 
          error: "Valid occupation ID is required" 
        });
      }

      const occupationData = await getOccupationData(occupationId);
      
      if (!occupationData) {
        return res.status(404).json({ 
          error: `Occupation with ID ${occupationId} not found` 
        });
      }

      // Return only outcomes-related data
      const outcomes = {
        name_occupational: occupationData.name_occupational,
        outcomes: occupationData.outcomes,
        unit_codes: occupationData.unit_codes,
      };

      res.json({
        success: true,
        data: outcomes,
      });
    } catch (error) {
      next(error);
    }
  }
}
