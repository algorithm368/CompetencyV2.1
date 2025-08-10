import { Router } from "express";
import { getEvidenceController } from "../controllers/getEvidenceController";
import { postEvidenceController } from "../controllers/postEvidenceController";
import { delEvidenceController } from "../controllers/delEvidenceController";
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

// example route: /api/sfia/evidence/delete
// permission: protected
router.delete("/delete", authenticate, delEvidenceController);

export default router;
