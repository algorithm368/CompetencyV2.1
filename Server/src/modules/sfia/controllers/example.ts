import { Request, Response, NextFunction } from "express";
import {
  createSubSkillEvidence,
  CreateEvidenceRequest,
} from "../services/postEvidenceServices";
import { AuthenticatedRequest } from "../../../middlewares/authMiddleware";

/**
 * Controller to handle POST /evidence
 * Creates new evidence for a specific subskill
 */
export const postEvidenceController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate user authentication
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const { subSkillId, evidenceText, evidenceUrl } = req.body;

    // Validate required fields
    if (!subSkillId || !evidenceText) {
      return res.status(400).json({
        success: false,
        message: "SubSkill ID and evidence text are required.",
      });
    }

    // Validate subSkillId is a number
    if (!Number.isInteger(subSkillId) || subSkillId <= 0) {
      return res.status(400).json({
        success: false,
        message: "SubSkill ID must be a positive integer.",
      });
    }

    // Validate evidenceText is not empty
    if (typeof evidenceText !== "string" || evidenceText.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Evidence text cannot be empty.",
      });
    }

    // Validate evidenceUrl if provided
    if (
      evidenceUrl &&
      (typeof evidenceUrl !== "string" || evidenceUrl.trim() === "")
    ) {
      return res.status(400).json({
        success: false,
        message: "Evidence URL must be a valid string if provided.",
      });
    }

    // Create evidence request object
    const evidenceRequest: CreateEvidenceRequest = {
      userId: req.user.userId,
      subSkillId: Number(subSkillId),
      evidenceText: evidenceText.trim(),
      evidenceUrl: evidenceUrl?.trim() || undefined,
    };

    // Call service to create evidence
    const evidence = await createSubSkillEvidence(evidenceRequest);

    // Return success response
    res.status(201).json({
      success: true,
      message: "Evidence created successfully.",
      data: evidence,
    });
  } catch (error: any) {
    console.error("Error in postEvidenceController:", error);

    // Handle specific errors
    if (error.message?.includes("does not exist")) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message?.includes("SubSkill")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // Handle database errors
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Evidence already exists for this subskill.",
      });
    }

    // Generic server error
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};