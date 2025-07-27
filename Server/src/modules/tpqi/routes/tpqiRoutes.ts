import { Router } from "express";
import tpqiUnitcode from "./tpqiUnitcodeRoutes";
import tpqiEvidence from "./tpqiEvidenceRoutes";

const router = Router();

// example route: /api/tpqi
router.get("/", (req, res) => {
  res.send("Hello from tpqi");
});

// example route: /api/tpqi/evidence
// permission: public
router.use("/unitcodes", tpqiUnitcode);

// example route: /api/tpqi/evidence
// permission: protected
// body: { "skillId": "string", "knowledgeId": "string", "evidenceUrl": "string" }
router.use("/evidence", tpqiEvidence);

export default router;
