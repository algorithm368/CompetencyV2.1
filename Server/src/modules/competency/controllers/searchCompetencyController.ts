import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as searchCompetencyServices from "@Competency/services/searchCompetencyServices";

// Get all jobs/careers from the specified database (sfia or tpqi)
export const getCompetencies = async (req: Request, res: Response): Promise<void> => {
  const dbType = req.params?.dbType as "sfia" | "tpqi";
  if (!dbType || (dbType !== "sfia" && dbType !== "tpqi")) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid or missing dbType (must be 'sfia' or 'tpqi')",
    });
    return;
  }
  try {
    const Competencies = await searchCompetencyServices.getCompetencies(dbType);
    res.status(StatusCodes.OK).json({ Competencies });
  } catch (err: any) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err.message ?? "Failed to fetch Competencies" });
  }
};

// Search for jobs/careers by name from the specified database (sfia or tpqi)
export const searchCompetency = async (
  req: Request,
  res: Response
): Promise<void> => {
  const dbType = req.params?.dbType as "sfia" | "tpqi";
  const searchTerm = req.body?.searchTerm;

  if (!dbType || (dbType !== "sfia" && dbType !== "tpqi")) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid or missing dbType (must be 'sfia' or 'tpqi')",
    });
    return;
  }
  if (
    !searchTerm ||
    typeof searchTerm !== "string" ||
    searchTerm.trim() === ""
  ) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Missing or invalid searchTerm" });
    return;
  }
  try {
    const results = await searchCompetencyServices.searchCompetency(dbType, searchTerm);
    res.status(StatusCodes.OK).json({ results });
  } catch (err: any) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err.message ?? "Failed to search Competencies" });
  }
};
