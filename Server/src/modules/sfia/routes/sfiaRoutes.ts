import { Router } from "express";
import sfiaSkill from "./sfiaSkillRoutes";
import sfiaEvidence from "./sfiaEvidenceRoutes";
import sfiaSummary from "./sfiaSummaryRoutes";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from sfia");
});

// example route: /api/sfia/skills
// permission: public
router.use("/skills", sfiaSkill);

// example route: /api/sfia/evidence
// permission: public
// body: { "skillCode": "string", "userId": "string" }
router.use("/evidence", sfiaEvidence);

// example route: /api/sfia/summary
// permission: protected
// description: User skill summaries and statistics
router.use("/summary", sfiaSummary);

export default router;
