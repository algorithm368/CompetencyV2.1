import { Router, RequestHandler } from "express";
import { SkillController } from "@Admin/controllers/sfia/skillController";
import { withAuth } from "@Middlewares/withAuth";

const router: Router = Router();

router.get("/", withAuth({ resource: "skill", action: "view" }, SkillController.getAll as RequestHandler));

router.get("/:code", withAuth({ resource: "skill", action: "view" }, SkillController.getById as RequestHandler));

router.post("/", withAuth({ resource: "skill", action: "create" }, SkillController.create as RequestHandler));

router.put("/:code", withAuth({ resource: "skill", action: "edit" }, SkillController.update as RequestHandler));

router.delete("/:code", withAuth({ resource: "skill", action: "delete" }, SkillController.delete as RequestHandler));

export default router;
