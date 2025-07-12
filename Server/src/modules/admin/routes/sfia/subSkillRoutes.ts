import { Router, RequestHandler } from "express";
import { SubSkillController } from "@Admin/controllers/sfia/subSkillController";

const router: Router = Router();

// SubSkills routes
router.get("/", SubSkillController.getAll as RequestHandler);
router.get("/:id", SubSkillController.getById as RequestHandler);
router.post("/", SubSkillController.create as RequestHandler);
router.put("/:id", SubSkillController.update as RequestHandler);
router.delete("/:id", SubSkillController.delete as RequestHandler);

export default router;
