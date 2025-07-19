import { Router } from "express";
import { postEvidenceController } from "../controllers/postEvidenceController";
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

export default router;
