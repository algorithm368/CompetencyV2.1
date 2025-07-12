import { Router, RequestHandler } from "express";
import { SkillController } from "@Admin/controllers/sfia/skillController";

const router: Router = Router();

// Jobs routes
router.get("/", SkillController.getAll as RequestHandler);
router.get("/:code", SkillController.getById as RequestHandler);
router.post("/", SkillController.create as RequestHandler);
router.put("/:code", SkillController.update as RequestHandler);
router.delete("/:code", SkillController.delete as RequestHandler);

export default router;
