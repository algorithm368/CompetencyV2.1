import { Response, NextFunction } from "express";
import axios from "axios";
import {
  createTpqiEvidence,
  CreateTpqiEvidenceRequest,
} from "../services/postEvidenceService";
import { AuthenticatedRequest } from "../../../middlewares/authMiddleware";

/**
 * Validates if a string is a valid HTTP/HTTPS URL
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
 * Checks if a URL is accessible by making a HEAD or GET request
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
    try {
      await axios.get(url, {
        timeout: 10000,
        maxRedirects: 5,
        validateStatus: (status) => status < 400,
        maxContentLength: 1024,
      });
      return true;
    } catch {
      return false;
    }
  }
};

/**
 * Helper to validate skillId and knowledgeId
 */
function validateSkillOrKnowledge(
  skillId: any,
  knowledgeId: any
): string | null {
  if (!skillId && !knowledgeId) {
    return "Either skillId or knowledgeId must be provided.";
  }
  if (skillId !== undefined && (!Number.isInteger(skillId) || skillId <= 0)) {
    return "skillId must be a positive integer if provided.";
  }
  if (
    knowledgeId !== undefined &&
    (!Number.isInteger(knowledgeId) || knowledgeId <= 0)
  ) {
    return "knowledgeId must be a positive integer if provided.";
  }
  return null;
}

/**
 * Helper to validate evidenceUrl
 */
async function validateEvidenceUrl(
  evidenceUrl: any
): Promise<{ error: string | null; value?: string }> {
  if (evidenceUrl === undefined) return { error: null };
  if (typeof evidenceUrl !== "string") {
    return { error: "evidenceUrl must be a string if provided." };
  }
  const trimmedUrl = evidenceUrl.trim();
  if (trimmedUrl === "") {
    return { error: "evidenceUrl cannot be empty if provided." };
  }
  if (!isValidUrl(trimmedUrl)) {
    return { error: "evidenceUrl must be a valid HTTP or HTTPS URL." };
  }
  const isAccessible = await isUrlAccessible(trimmedUrl);
  if (!isAccessible) {
    return {
      error:
        "evidenceUrl is not accessible. Please provide a valid, accessible URL.",
    };
  }
  return { error: null, value: trimmedUrl };
}

/**
 * Controller to handle POST /tpqi/evidence
 * Creates new evidence for a user's skill or knowledge in TPQI
 */
export const postTpqiEvidenceController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Use userId from authentication middleware, not from body
    if (!req.user?.userId) {
      res
        .status(401)
        .json({ success: false, message: "Authentication required." });
      return;
    }

    const { skillId, knowledgeId, evidenceUrl } = req.body as Omit<
      CreateTpqiEvidenceRequest,
      "userId"
    >;

    // Validate skillId and knowledgeId
    const skillOrKnowledgeError = validateSkillOrKnowledge(
      skillId,
      knowledgeId
    );
    if (skillOrKnowledgeError) {
      res.status(400).json({ success: false, message: skillOrKnowledgeError });
      return;
    }

    // Validate evidenceUrl if provided
    let validatedEvidenceUrl: string | undefined;
    const evidenceUrlResult = await validateEvidenceUrl(evidenceUrl);
    if (evidenceUrlResult.error) {
      res
        .status(400)
        .json({ success: false, message: evidenceUrlResult.error });
      return;
    }
    validatedEvidenceUrl = evidenceUrlResult.value;

    // Call service to create evidence
    const evidence = await createTpqiEvidence({
      userId: req.user.userId,
      skillId,
      knowledgeId,
      evidenceUrl: validatedEvidenceUrl,
    });

    res.status(201).json({
      success: true,
      message: "Evidence created successfully.",
      data: evidence,
    });
  } catch (error: any) {
    // Handle known service errors
    if (error.message?.includes("does not exist")) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }
    // Handle Prisma errors
    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        message: "Evidence already exists for this skill or knowledge.",
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
      message:
        error.message || "Internal server error. Please try again later.",
    });
  }
};
