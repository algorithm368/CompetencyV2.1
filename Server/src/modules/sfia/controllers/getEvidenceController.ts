import { Request, Response, NextFunction } from "express";
import { getEvidenceServices } from "../services/getEvidenceServices";

/**
 * Controller to get evidence data for a specific skill and user.
 */
export const getEvidenceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { skillCode, userId } = req.body;

  if (!skillCode || !userId) {
    return res.status(400).json({
      success: false,
      message: "Skill code and user ID are required in the request body",
    });
  }

  try {
    const evidenceData = await getEvidenceServices(skillCode, userId);

    if (!evidenceData) {
      return res.status(404).json({
        success: false,
        message: "No evidence found for the specified skill and user",
      });
    }

    return res.status(200).json({
      success: true,
      data: evidenceData,
    });
  } catch (error) {
    // Consider using a logger instead of console.error in production
    console.error("Error fetching evidence data:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching evidence data",
    });
  }
};
