import { Router } from "express";
import sfiaSkill from "./sfiaSkillRoutes"
import sfiaEvidence from "./sfiaEvidenceRoutes";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from sfia");
});

// example route: /api/sfia/skills
// permission: public
router.use("/skills", sfiaSkill);

// example route: /api/sfia/evidence
// permission: public
router.use("/evidence", sfiaEvidence);

export default router;
