import { Router } from "express";
import { getSkillDetailController } from "../controllers/getSkillDetailController";

const router = Router();

// example route: /api/sfia/skills
router.get("/", (req, res) => {
  res.send("Hello from sfia skill routes");
});

// example route: /api/sfia/skills/PROG
router.use("/:skillCode", getSkillDetailController);
// New routes with updated names

export default router;