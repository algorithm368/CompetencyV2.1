import { Request, Response, NextFunction } from "express";
import { getJobLevels } from "../services/getJobLevelsServices";

/**
 * Controller to handle GET /job-levels/:jobCode
 * Fetches job levels for a given job code.
 */
export const getJobLevelsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { jobCode } = req.params;

  try {
    const jobLevels = await getJobLevels(jobCode);
    res.status(200).json({ success: true, data: jobLevels });
  } catch (error: any) {
    // Handle known errors with specific messages
    if (error.message === "Job code cannot be empty.") {
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error.message.startsWith("Job with code")) {
      return res.status(404).json({ success: false, message: error.message });
    }
    // For unexpected errors, log and return generic message
    console.error("Unexpected error in getJobLevelsController:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
