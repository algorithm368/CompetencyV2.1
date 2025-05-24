import { Router, RequestHandler } from "express";
import { SkillController } from "@Admin/controllers/tpqi/skillController";

const router: Router = Router();

router.get("/", SkillController.getAll as RequestHandler);
router.get("/:id", SkillController.getById as RequestHandler);
router.post("/", SkillController.create as RequestHandler);
router.put("/:id", SkillController.update as RequestHandler);
router.delete("/:id", SkillController.delete as RequestHandler);

export default router;
