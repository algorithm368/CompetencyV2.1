import { delEvidenceService } from "../services/delEvidenceService";
import { AuthenticatedRequest } from "@/middlewares/authMiddleware";

const delEvidenceController = {
  deleteEvidence: async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    try {
      const result = await delEvidenceService.deleteEvidence(id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default delEvidenceController;