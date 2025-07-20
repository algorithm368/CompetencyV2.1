import { Request, Response, NextFunction } from "express";
import { getSkillDetailsByCode } from "../services/getSkillDetailServices";

/**
 * Controller function to handling skill detail retrieval requests.
 * 
 * This controller processes GET requests to fetch comprehensive skill details.
 * including hierarchical data (levels, descriptions, and subskills) and statistical summaries.
 * for a specific skill identified by its code.
 * 
 * **Route:** `GET /api/skills/:skillCode`
 * 
 * **Request Flow**:
 * 1. Validates the `skillCode` parameter.
 * 2. Calls the service to retrieve skill details.
 * 3. Returns the skill details in the response if found.
 * 4. Handles errors gracefully, returning appropriate HTTP status codes and messages.
 * 
 * **Success Response Structure**:
 * ```json
 * {
 *   "success": true,
 *   "data": {
 *     "competency": {
 *       "competency_id": "PROG",
 *       "competency_name": "Programming/software development",
 *       "overall": "The application of mathematical and scientific...",
 *       "note": null,
 *       "category": { "id": 1, "category_text": "Strategy and architecture" },
 *       "levels": [...]
 *     },
 *     "totalLevels": 7,
 *     "totalSubSkills": 35
 *   }
 * }
 * ```
 * 
 * **Error Response Structure**:
 * ```json
 * {
 *  "success": false,
 *  "message": "Skill with code 'PROG' not found."
 * }
 * ```
 */
export const getSkillDetailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { skillCode } = req.params;

  try {
    // Validate skill code parameter
    if (!skillCode || skillCode.trim() === "") {
      return res.status(400).json({ 
        success: false, 
        message: "Skill code is required and cannot be empty." 
      });
    }

    const skillDetails = await getSkillDetailsByCode(skillCode)
    
    if (!skillDetails) {
      return res.status(404).json({ 
        success: false, 
        message: `Skill with code '${skillCode}' not found.` 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: skillDetails 
    });
  } catch (error: any) {
    if (error?.message?.startsWith("Failed to fetch skill details for code:")) {
      return res.status(500).json({ 
        success: false, 
        message: "Failed to fetch skill details. Please try again later." 
      });
    }
    
    console.error("Unexpected error in getSkillDetailController:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error." 
    });
  }
};
