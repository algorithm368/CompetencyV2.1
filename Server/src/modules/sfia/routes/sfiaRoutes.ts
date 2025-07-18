import { Router } from "express";
import sfiaSkill from "./sfiaSkillRoutes"

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from sfia");
});

// example route: /api/sfia/skills
router.use("/skills", sfiaSkill);

export default router;
