import { Router } from "express";
import { postEvidenceController } from "../controllers/postEvidenceController";
import { getEvidenceController } from "../controllers/getEvidenceController";
import { authenticate } from "@/middlewares/authMiddleware";

const router = Router();

// example route: /api/sfia/evidence
// permission: public
router.get("/", (req, res) => {
  res.send("Hello from sfia evidence routes");
});

// example route: /api/sfia/evidence
// permission: protected
router.post("/", authenticate, postEvidenceController);

// example route: /api/sfia/evidence/get
// permission: protected
router.post("/get", authenticate, getEvidenceController);

router.delete("/:id", authenticate, delEvidenceController.deleteEvidence);

export default router;
