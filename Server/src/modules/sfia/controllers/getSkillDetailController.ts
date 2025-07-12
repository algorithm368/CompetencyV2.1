import { Request, Response, NextFunction } from "express";
import { getSkillDetailsByCode } from "../services/getSkillDetailServices";

/**
 * Controller to handle GET /skill-details/:skillCode
 * Fetches detailed skill information including subskills and levels for a given skill code.
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

    const skillDetails = await getSkillDetailsByCode(skillCode);
    
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
