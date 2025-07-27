import { Router } from "express";
import { postTpqiEvidenceController } from "../controllers/postEvidenceController"
import { authenticate } from "@/middlewares/authMiddleware";

const router = Router();

// example route: /api/tpqi/evidence
// permission: public
router.get("/", (req, res) => {
  res.send("Hello from tpqi evidence routes");
});

// example route: /api/tpqi/evidence
// permission: protected
// body: { "skillId": "string", "knowledgeId": "string"
router.post("/", authenticate, postTpqiEvidenceController);

export default router;