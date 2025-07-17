import { Request, Response, NextFunction } from "express";
import {
  createSubSkillEvidence,
  CreateEvidenceRequest,
} from "../services/postEvidenceServices";
import { AuthenticatedRequest } from "@/middlewares/authMiddleware";

export const postEvidenceController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {

    // Ensure the user is authenticated
    if (!req.body?.userId) {
      return res.status(400).json({
        success: false,
        message: "Authentication required to post evidence.",
      });
    }

    // Extract necessary data from the request body
    const { subSkillId, evidenceText, evidenceUrl } = req.body;

    if ()

    if 
  }