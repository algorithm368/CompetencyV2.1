import { Request, Response, NextFunction } from "express";
import { getSkillWithLevelsAndSubSkills } from "../services/getSkillLevelServices";

/**
 * Controller to handle GET /skill-levels/:skillCode
 * Fetches skill levels for a given skill code.
 */
export const getSkillLevelsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { skillCode } = req.params;

  try {
    const skillLevels = await getSkillWithLevelsAndSubSkills(skillCode);
    res.status(200).json({ success: true, data: skillLevels });
  } catch (error: any) {
    if (error.message === "Skill code is required and cannot be empty.") {
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error.message.startsWith("Skill with code")) {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error("Unexpected error in getSkillLevelsController:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
