import { Request, Response, NextFunction } from "express";
import { getUnitCodeDetailsByCode } from "../services/getUnitcodeDetailServices";

/**
 * Controller to handle GET /unit-code-details/:unitCode
 * Fetches detailed unit code information including skills and knowledge for a given unit code.
 */
export const getUnitCodeDetailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { unitCode } = req.params;

  try {
    // Validate unit code parameter
    if (!unitCode || unitCode.trim() === "") {
      return res.status(400).json({ 
        success: false, 
        message: "Unit code is required and cannot be empty." 
      });
    }

    const unitCodeDetails = await getUnitCodeDetailsByCode(unitCode);
    
    if (!unitCodeDetails) {
      return res.status(404).json({ 
        success: false, 
        message: `Unit code with code '${unitCode}' not found.` 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: unitCodeDetails 
    });
  } catch (error: any) {
    if (error?.message?.startsWith("Failed to fetch unit code details for code:")) {
      return res.status(500).json({ 
        success: false, 
        message: "Failed to fetch unit code details. Please try again later." 
      });
    }
    
    console.error("Unexpected error in getUnitCodeDetailController:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error." 
    });
  }
};
