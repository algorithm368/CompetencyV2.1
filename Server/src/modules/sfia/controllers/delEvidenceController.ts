import { Response, NextFunction } from "express";
import { deleteEvidenceBySkillAndUser } from "../services/delEvidenceServices";
import { AuthenticatedRequest } from "../../../middlewares/authMiddleware";

/**
 * Controller to delete evidence data for a specific skill and user.
 */
export const delEvidenceController = async (
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

    const { skillCode } = req.body;

    // Validate required field
    if (!skillCode) {
      res.status(400).json({
        success: false,
        message: "Skill code is required in the request body.",
      });
      return;
    }

    // Validate skillCode is not empty
    if (typeof skillCode !== "string" || skillCode.trim() === "") {
      res.status(400).json({
        success: false,
        message: "Skill code cannot be empty.",
      });
      return;
    }

    // Use the authenticated user's ID instead of requiring it in the request body
    const deleteResult = await deleteEvidenceBySkillAndUser(
      skillCode.trim(),
      req.user.userId
    );

    if (!deleteResult) {
      res.status(404).json({
        success: false,
        message: "No evidence found for the specified skill and user.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Evidence deleted successfully.",
      data: deleteResult,
    });
  } catch (error: any) {
    // Consider using a logger instead of console.error in production
    console.error("Error in delEvidenceController:", error);

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

    // Handle foreign key constraint errors (evidence might be referenced elsewhere)
    if (
      error.code === "P2003" ||
      error.message?.includes("foreign key constraint")
    ) {
      res.status(409).json({
        success: false,
        message: "Cannot delete evidence due to existing references.",
      });
      return;
    }

    // Handle record not found errors
    if (
      error.code === "P2025" ||
      error.message?.includes("Record to delete does not exist")
    ) {
      res.status(404).json({
        success: false,
        message: "Evidence not found or already deleted.",
      });
      return;
    }

    // Generic server error
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};
