import { Response, NextFunction } from "express";
import axios from "axios";
import {
  createSubSkillEvidence,
  CreateEvidenceRequest,
} from "../services/postEvidenceServices";
import { AuthenticatedRequest } from "../../../middlewares/authMiddleware";

/**
 * Validates if a string is a valid URL
 * @param url - The URL string to validate
 * @returns boolean - True if valid URL, false otherwise
 */
const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ["http:", "https:"].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

/**
 * Checks if a URL is accessible by making a HEAD request
 * @param url - The URL to check
 * @returns Promise<boolean> - True if accessible, false otherwise
 */
const isUrlAccessible = async (url: string): Promise<boolean> => {
  try {
    await axios.head(url, {
      timeout: 10000,
      maxRedirects: 5,
      validateStatus: (status) => status < 400,
    });
    return true;
  } catch {
    // Do not log error for HEAD failure

    try {
      await axios.get(url, {
        timeout: 10000,
        maxRedirects: 5,
        validateStatus: (status) => status < 400,
        maxContentLength: 1024,
      });
      return true;
    } catch {
      // Do not log error for GET failure
      return false;
    }
  }
};

/**
 * Controller to handle POST /evidence
 * Creates new evidence for a specific subskill
 */
export const postEvidenceController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate user authentication
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const { subSkillId, evidenceText, evidenceUrl } = req.body;

    // Validate required fields
    if (!subSkillId || !evidenceText) {
      res.status(400).json({
        success: false,
        message: "SubSkillId and evidenceText are required.",
      });
      return;
    }

    // Validate subSkillId is a positive integer
    const parsedSubSkillId = Number(subSkillId);
    if (!Number.isInteger(parsedSubSkillId) || parsedSubSkillId <= 0) {
      res.status(400).json({
        success: false,
        message: "SubSkillId must be a positive integer.",
      });
      return;
    }

    // Validate evidenceText is not empty
    if (typeof evidenceText !== "string" || evidenceText.trim() === "") {
      res.status(400).json({
        success: false,
        message: "Evidence text cannot be empty.",
      });
      return;
    }

    // Validate evidenceText length (optional: add reasonable limits)
    const trimmedEvidenceText = evidenceText.trim();
    if (trimmedEvidenceText.length > 5000) {
      res.status(400).json({
        success: false,
        message: "Evidence text cannot exceed 5000 characters.",
      });
      return;
    }

    // Validate evidenceUrl if provided
    let validatedEvidenceUrl: string | undefined;
    if (evidenceUrl) {
      if (typeof evidenceUrl !== "string") {
        res.status(400).json({
          success: false,
          message: "Evidence URL must be a string.",
        });
        return;
      }

      const trimmedUrl = evidenceUrl.trim();
      if (trimmedUrl === "") {
        res.status(400).json({
          success: false,
          message: "Evidence URL cannot be empty if provided.",
        });
        return;
      }

      if (!isValidUrl(trimmedUrl)) {
        res.status(400).json({
          success: false,
          message: "Evidence URL must be a valid HTTP or HTTPS URL.",
        });
        return;
      }

      // Check if URL is accessible
      const isAccessible = await isUrlAccessible(trimmedUrl);
      if (!isAccessible) {
        res.status(400).json({
          success: false,
          message:
            "Evidence URL is not accessible. Please provide a valid, accessible URL.",
        });
        return;
      }

      validatedEvidenceUrl = trimmedUrl;
    }

    // Create evidence request object
    const evidenceRequest: CreateEvidenceRequest = {
      userId: req.user.userId,
      subSkillId: parsedSubSkillId,
      evidenceText: trimmedEvidenceText,
      evidenceUrl: validatedEvidenceUrl,
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

    // Handle specific service errors
    if (error.message?.includes("does not exist")) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error.message?.includes("SubSkill")) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    // Handle Prisma database errors
    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        message: "Evidence already exists for this subskill.",
      });
      return;
    }

    if (error.code === "P2025") {
      res.status(404).json({
        success: false,
        message: "Related record not found.",
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

    // Generic server error
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};
