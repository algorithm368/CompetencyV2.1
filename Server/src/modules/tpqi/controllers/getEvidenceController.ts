import { Response, NextFunction } from "express";
import { getEvidenceByUnitCodeAndUser } from "../services/getEvicenceService";
import { AuthenticatedRequest } from "../../../middlewares/authMiddleware";

/**
 * Controller to get evidence data for a specific unit code and user.
 */
export const getTpqiEvidenceController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate user authentication
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const { unitCode } = req.body;

    // Validate required field
    if (!unitCode) {
      res.status(400).json({
        success: false,
        message: "Unit code is required in the request body.",
      });
      return;
    }

    // Validate unitCode is not empty
    if (typeof unitCode !== "string" || unitCode.trim() === "") {
      res.status(400).json({
        success: false,
        message: "Unit code cannot be empty.",
      });
      return;
    }

    // Use the authenticated user's ID instead of requiring it in the request body
    const evidenceData = await getEvidenceByUnitCodeAndUser(
      unitCode.trim(),
      req.user.userId
    );

    if (!evidenceData) {
      res.status(404).json({
        success: false,
        message: "No evidence found for the specified unit code and user.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: evidenceData,
    });
  } catch (error: any) {
    // Consider using a logger instead of console.error in production
    console.error("Error in getTpqiEvidenceController:", error);

    // Handle specific service errors
    if (error.message?.includes("does not exist")) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    // Handle unit code not found errors
    if (error.message?.includes("Failed to fetch evidence for unit code")) {
      res.status(404).json({
        success: false,
        message: "Unit code not found or invalid.",
      });
      return;
    }

    // Handle database connection errors
    if (error.code === "P1001" || error.code === "P1017") {
      res.status(503).json({
        success: false,
        message: "Database connection error. Please try again later.",
      });
      return;
    }

    // Handle Prisma errors
    if (error.code?.startsWith("P")) {
      res.status(500).json({
        success: false,
        message: "Database error occurred while fetching evidence.",
      });
      return;
    }

    // Generic error fallback
    res.status(500).json({
      success: false,
      message: "Internal server error occurred while retrieving evidence.",
    });
  }
};

/**
 * Alternative controller that accepts unitCode as a URL parameter instead of request body.
 * Useful for GET requests where unitCode is part of the URL.
 */
export const getTpqiEvidenceByParamController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate user authentication
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const { unitCode } = req.params;

    // Validate required parameter
    if (!unitCode) {
      res.status(400).json({
        success: false,
        message: "Unit code is required as a URL parameter.",
      });
      return;
    }

    // Validate unitCode is not empty
    if (typeof unitCode !== "string" || unitCode.trim() === "") {
      res.status(400).json({
        success: false,
        message: "Unit code cannot be empty.",
      });
      return;
    }

    // Use the authenticated user's ID
    const evidenceData = await getEvidenceByUnitCodeAndUser(
      unitCode.trim(),
      req.user.userId
    );

    if (!evidenceData) {
      res.status(404).json({
        success: false,
        message: "No evidence found for the specified unit code and user.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: evidenceData,
      meta: {
        unitCode: evidenceData.unitCode,
        totalSkillEvidences: evidenceData.skillEvidences.length,
        totalKnowledgeEvidences: evidenceData.knowledgeEvidences.length,
        totalEvidences: evidenceData.totalEvidences,
      },
    });
  } catch (error: any) {
    console.error("Error in getTpqiEvidenceByParamController:", error);

    // Handle specific service errors
    if (error.message?.includes("Failed to fetch evidence for unit code")) {
      res.status(404).json({
        success: false,
        message: "Unit code not found or invalid.",
      });
      return;
    }

    // Generic error fallback
    res.status(500).json({
      success: false,
      message: "Internal server error occurred while retrieving evidence.",
    });
  }
};
