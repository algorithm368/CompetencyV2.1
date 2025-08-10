import { Response, NextFunction } from "express";
import {
  deleteKnowledgeEvidenceByKnowledgeAndUser,
  deleteSkillEvidenceBySkillAndUser,
  deleteEvidenceByTypeAndUser,
} from "../services/delEvidenceServices";
import { AuthenticatedRequest } from "../../../middlewares/authMiddleware";

/**
 * Controller to delete knowledge evidence data for a specific knowledge and user.
 */
export const delKnowledgeEvidenceController = async (
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

    const { knowledgeId } = req.body;

    // Validate required field
    if (!knowledgeId) {
      res.status(400).json({
        success: false,
        message: "Knowledge ID is required in the request body.",
      });
      return;
    }

    // Validate knowledgeId is a positive number
    const numericKnowledgeId = parseInt(knowledgeId);
    if (isNaN(numericKnowledgeId) || numericKnowledgeId <= 0) {
      res.status(400).json({
        success: false,
        message: "Knowledge ID must be a valid positive number.",
      });
      return;
    }

    // Use the authenticated user's ID
    const deleteResult = await deleteKnowledgeEvidenceByKnowledgeAndUser(
      numericKnowledgeId,
      req.user.userId
    );

    if (!deleteResult) {
      res.status(404).json({
        success: false,
        message:
          "No knowledge evidence found for the specified knowledge and user.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Knowledge evidence deleted successfully.",
      data: deleteResult,
    });
  } catch (error: any) {
    console.error("Error in delKnowledgeEvidenceController:", error);

    // Handle specific service errors
    if (error.message?.includes("not found")) {
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

    // Handle foreign key constraint errors
    if (
      error.code === "P2003" ||
      error.message?.includes("foreign key constraint")
    ) {
      res.status(409).json({
        success: false,
        message: "Cannot delete knowledge evidence due to existing references.",
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
        message: "Knowledge evidence not found or already deleted.",
      });
      return;
    }

    // Handle other database errors
    if (error.code?.startsWith("P")) {
      res.status(500).json({
        success: false,
        message: "Database error occurred while deleting knowledge evidence.",
      });
      return;
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while deleting knowledge evidence.",
    });
  }
};

/**
 * Controller to delete skill evidence data for a specific skill and user.
 */
export const delSkillEvidenceController = async (
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

    const { skillId } = req.body;

    // Validate required field
    if (!skillId) {
      res.status(400).json({
        success: false,
        message: "Skill ID is required in the request body.",
      });
      return;
    }

    // Validate skillId is a positive number
    const numericSkillId = parseInt(skillId);
    if (isNaN(numericSkillId) || numericSkillId <= 0) {
      res.status(400).json({
        success: false,
        message: "Skill ID must be a valid positive number.",
      });
      return;
    }

    // Use the authenticated user's ID
    const deleteResult = await deleteSkillEvidenceBySkillAndUser(
      numericSkillId,
      req.user.userId
    );

    if (!deleteResult) {
      res.status(404).json({
        success: false,
        message: "No skill evidence found for the specified skill and user.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Skill evidence deleted successfully.",
      data: deleteResult,
    });
  } catch (error: any) {
    console.error("Error in delSkillEvidenceController:", error);

    // Handle specific service errors
    if (error.message?.includes("not found")) {
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

    // Handle foreign key constraint errors
    if (
      error.code === "P2003" ||
      error.message?.includes("foreign key constraint")
    ) {
      res.status(409).json({
        success: false,
        message: "Cannot delete skill evidence due to existing references.",
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
        message: "Skill evidence not found or already deleted.",
      });
      return;
    }

    // Handle other database errors
    if (error.code?.startsWith("P")) {
      res.status(500).json({
        success: false,
        message: "Database error occurred while deleting skill evidence.",
      });
      return;
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred while deleting skill evidence.",
    });
  }
};

/**
 * Unified controller to delete evidence by type (knowledge or skill).
 * This provides a single endpoint for deleting either type of evidence.
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

    const { evidenceType, evidenceId } = req.body;

    // Validate required fields
    if (!evidenceType || !evidenceId) {
      res.status(400).json({
        success: false,
        message:
          "Evidence type and evidence ID are required in the request body.",
      });
      return;
    }

    // Validate evidenceType
    if (evidenceType !== "knowledge" && evidenceType !== "skill") {
      res.status(400).json({
        success: false,
        message: "Evidence type must be either 'knowledge' or 'skill'.",
      });
      return;
    }

    // Validate evidenceId is a positive number
    const numericEvidenceId = parseInt(evidenceId);
    if (isNaN(numericEvidenceId) || numericEvidenceId <= 0) {
      res.status(400).json({
        success: false,
        message: "Evidence ID must be a valid positive number.",
      });
      return;
    }

    // Use the authenticated user's ID
    const deleteResult = await deleteEvidenceByTypeAndUser(
      evidenceType,
      numericEvidenceId,
      req.user.userId
    );

    if (!deleteResult) {
      res.status(404).json({
        success: false,
        message: `No ${evidenceType} evidence found for the specified ${evidenceType} and user.`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `${
        evidenceType.charAt(0).toUpperCase() + evidenceType.slice(1)
      } evidence deleted successfully.`,
      data: deleteResult,
    });
  } catch (error: any) {
    console.error("Error in delEvidenceController:", error);

    // Handle specific service errors
    if (error.message?.includes("not found")) {
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

    // Handle foreign key constraint errors
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

    // Handle other database errors
    if (error.code?.startsWith("P")) {
      res.status(500).json({
        success: false,
        message: "Database error occurred while deleting evidence.",
      });
      return;
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred while deleting evidence.",
    });
  }
};
