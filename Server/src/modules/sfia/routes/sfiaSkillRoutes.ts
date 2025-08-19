import { Router } from "express";
import { getSkillDetailController } from "../controllers/getSkillDetailController";
import { RequestHandler } from "express";

const router = Router();

// example route: /api/sfia/skills
// permission: public
router.get("/", (req, res) => {
  res.send("Hello from sfia skill routes");
});

// example route: /api/sfia/skills/PROG
// permission: public
router.get("/:skillCode", getSkillDetailController as RequestHandler);

export default router;
