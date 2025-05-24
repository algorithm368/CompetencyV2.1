import { Router, RequestHandler } from "express";
import { USkillController } from "@Admin/controllers/tpqi/uSkillController";

const router = Router();

router.get("/", USkillController.getAll as RequestHandler);
router.get("/:id", USkillController.getById as RequestHandler);
router.post("/", USkillController.create as RequestHandler);
router.put("/:id", USkillController.update as RequestHandler);
router.delete("/:id", USkillController.delete as RequestHandler);

export default router;
