import { Router } from "express";
import { getSkillDetailController } from "../controllers/getSkillDetailController";
import { RequestHandler } from "express";

const router = Router();

// example route: /api/sfia/skills
router.get("/", (req, res) => {
  res.send("Hello from sfia skill routes");
});

// example route: /api/sfia/skills/PROG
router.get("/:skillCode", getSkillDetailController as RequestHandler);
// New routes with updated names

export default router;