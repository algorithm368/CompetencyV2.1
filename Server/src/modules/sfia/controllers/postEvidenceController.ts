import { Response, NextFunction } from "express";
import axios from "axios";
import { URL } from "url";
import { isIP } from "net";
import { createSubSkillEvidence, CreateEvidenceRequest } from "../services/postEvidenceServices";
import { AuthenticatedRequest } from "../../../middlewares/authMiddleware";

/**
 * Validates if a string is a valid URL and safe for external access
 * @param url - The URL string to validate
 * @returns boolean - True if valid and safe URL, false otherwise
 */
const isValidAndSafeUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);

    // Only allow HTTP and HTTPS protocols
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return false;
    }

    // Get hostname
    const hostname = urlObj.hostname.toLowerCase();

    // Block localhost and local addresses
    const blockedHostnames = [
      "localhost",
      "127.0.0.1",
      "0.0.0.0",
      "::1",
      "metadata.google.internal", // GCP metadata
      "169.254.169.254", // AWS/Azure metadata
      "metadata.azure.com", // Azure metadata
      "instance-data", // Some cloud providers
      "metadata", // Generic metadata
    ];

    if (blockedHostnames.includes(hostname)) {
      return false;
    }

    // Block private IP ranges
    if (isIP(hostname)) {
      const ip = hostname;

      // IPv4 private and special ranges
      if (
        ip.startsWith("10.") ||
        ip.startsWith("127.") ||
        ip.startsWith("169.254.") || // Link-local
        ip.startsWith("224.") || // Multicast
        ip.startsWith("240.") || // Reserved
        /^192\.168\./.test(ip) ||
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip) ||
        ip === "0.0.0.0" ||
        ip === "255.255.255.255"
      ) {
        return false;
      }

      // IPv6 private ranges
      if (
        ip.startsWith("::1") ||
        ip.startsWith("::") ||
        ip.startsWith("fc00:") ||
        ip.startsWith("fd00:") ||
        ip.startsWith("fe80:") ||
        ip.startsWith("ff00:") // Multicast
      ) {
        return false;
      }
    }

    // Block common internal domain patterns
    const internalPatterns = [/\.local$/, /\.internal$/, /\.corp$/, /\.lan$/, /\.intranet$/, /\.private$/];

    if (internalPatterns.some((pattern) => pattern.test(hostname))) {
      return false;
    }

    // Block URLs with non-standard ports that might be internal services
    const port = urlObj.port;
    if (port) {
      const portNum = parseInt(port, 10);
      // Block common internal service ports
      const blockedPorts = [22, 23, 25, 53, 135, 139, 445, 993, 995, 1433, 1521, 3306, 3389, 5432, 5984, 6379, 8080, 8443, 9200, 9300, 11211, 27017, 50070];
      if (blockedPorts.includes(portNum)) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
};

/**
 * Checks if a URL is accessible by making a HEAD request with security restrictions
 * @param url - The URL to check
 * @returns Promise<boolean> - True if accessible, false otherwise
 */
const isUrlAccessible = async (url: string): Promise<boolean> => {
  // First validate the URL is safe
  if (!isValidAndSafeUrl(url)) {
    return false;
  }

  try {
    await axios.head(url, {
      timeout: 5000,
      maxRedirects: 0, // FIXED: No redirects for security
      validateStatus: (status) => status < 400,
      headers: {
        "User-Agent": "CompetencyApp-URLValidator/1.0",
      },
      maxContentLength: 0, // HEAD requests shouldn't have content
      // Add additional security options
      decompress: false, // Disable automatic decompression
      maxBodyLength: 0,
    });
    return true;
  } catch (error: any) {
    // If HEAD fails, try GET with strict limits
    if (error.response?.status >= 400 && error.response?.status < 500) {
      try {
        await axios.get(url, {
          timeout: 5000,
          maxRedirects: 0, // No redirects for security
          validateStatus: (status) => status < 400,
          maxContentLength: 512, // Even smaller limit
          maxBodyLength: 512,
          headers: {
            "User-Agent": "CompetencyApp-URLValidator/1.0",
            Range: "bytes=0-511", // Only get first 512 bytes
          },
          decompress: false,
        });
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
};

// Alternative secure approach - format validation only (RECOMMENDED)
const validateUrlFormatOnly = (url: string): boolean => {
  return isValidAndSafeUrl(url);
};

export const postEvidenceController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
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

    // Validate evidenceText length
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

      // OPTION 1: Secure URL validation with accessibility check
      if (!isValidAndSafeUrl(trimmedUrl)) {
        res.status(400).json({
          success: false,
          message: "Evidence URL must be a valid, publicly accessible HTTP or HTTPS URL.",
        });
        return;
      }

      const isAccessible = await isUrlAccessible(trimmedUrl);
      if (!isAccessible) {
        res.status(400).json({
          success: false,
          message: "Evidence URL is not accessible. Please provide a valid, accessible URL.",
        });
        return;
      }

      // OPTION 2: Most secure - format validation only (RECOMMENDED)
      /*
      if (!validateUrlFormatOnly(trimmedUrl)) {
        res.status(400).json({
          success: false,
          message: "Evidence URL format is invalid or not allowed.",
        });
        return;
      }
      */

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
