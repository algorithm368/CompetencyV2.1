import { Response, NextFunction } from "express";
import { getUserCareerSummaryByUserId } from "../services/getUserSummaryService";
import { AuthenticatedRequest } from "../../../middlewares/authMiddleware";

/**
 * Controller to get user career summary data for the authenticated user.
 * Returns all career summaries with statistical information.
 */
export const getUserCareerSummaryController = async (
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

    // Use the authenticated user's ID
    const summaryData = await getUserCareerSummaryByUserId(req.user.userId);

    if (!summaryData) {
      res.status(404).json({
        success: false,
        message: "No career summaries found for the user.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: summaryData,
    });
  } catch (error: any) {
    console.error("Error in getUserCareerSummaryController:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    // Handle specific service errors
    if (error.message?.includes("Failed to fetch career summary")) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve user career summary data.",
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
