import { Router } from "express";
import tpqiUnitcode from "./tpqiUnitcodeRoutes";
import tpqiEvidence from "./tpqiEvidenceRoutes";
import tpqiSummary from "./tpqiSummaryRoutes";

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

// example route: /api/tpqi/summary
// permission: protected
// description: User career summaries and statistics
router.use("/summary", tpqiSummary);

export default router;
