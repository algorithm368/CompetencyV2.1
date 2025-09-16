import { Router, RequestHandler } from "express";
import { USkillController } from "@Admin/controllers/tpqi/uSkillController";
import { withAuth } from "@Middlewares/withAuth";

const router: Router = Router();

router.get("/", withAuth({ resource: "uSkill", action: "view" }, USkillController.getAll as RequestHandler));

router.get("/:id", withAuth({ resource: "uSkill", action: "view" }, USkillController.getById as RequestHandler));

router.post("/", withAuth({ resource: "uSkill", action: "create" }, USkillController.create as RequestHandler));

router.put("/:id", withAuth({ resource: "uSkill", action: "edit" }, USkillController.update as RequestHandler));

router.delete("/:id", withAuth({ resource: "uSkill", action: "delete" }, USkillController.delete as RequestHandler));

export default router;
