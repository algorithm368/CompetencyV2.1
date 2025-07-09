import { Request, Response, NextFunction } from "express";
import { getJobDetailsByCode } from "../services/getJobDetailServices";

/**
 * Controller to handle GET /job-details/:jobCode
 * Fetches detailed job information including skills and levels for a given job code.
 */
export const getJobDetailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { jobCode } = req.params;

  try {
    // Validate job code parameter
    if (!jobCode || jobCode.trim() === "") {
      return res.status(400).json({ 
        success: false, 
        message: "Job code is required and cannot be empty." 
      });
    }

    const jobDetails = await getJobDetailsByCode(jobCode);
    
    if (!jobDetails) {
      return res.status(404).json({ 
        success: false, 
        message: `Job with code '${jobCode}' not found.` 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: jobDetails 
    });
  } catch (error: any) {
    if (error?.message?.startsWith("Failed to fetch job details for code:")) {
      return res.status(500).json({ 
        success: false, 
        message: "Failed to fetch job details. Please try again later." 
      });
    }
    
    console.error("Unexpected error in getJobDetailController:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error." 
    });
  }
};
