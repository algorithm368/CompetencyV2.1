import { Router, RequestHandler } from "express";
import { SubSkillController } from "@Admin/controllers/sfia/subSkillController";
import { withAuth } from "@Middlewares/withAuth";

const router: Router = Router();

router.get("/", withAuth({ resource: "subSkill", action: "view" }, SubSkillController.getAll as RequestHandler));

router.get("/:id", withAuth({ resource: "subSkill", action: "view" }, SubSkillController.getById as RequestHandler));

router.post("/", withAuth({ resource: "subSkill", action: "create" }, SubSkillController.create as RequestHandler));

router.put("/:id", withAuth({ resource: "subSkill", action: "edit" }, SubSkillController.update as RequestHandler));

router.delete("/:id", withAuth({ resource: "subSkill", action: "delete" }, SubSkillController.delete as RequestHandler));

export default router;
