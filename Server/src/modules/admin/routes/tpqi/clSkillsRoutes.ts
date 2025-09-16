import { Router, RequestHandler } from "express";
import { ClSkillsController } from "@Admin/controllers/tpqi/clSkillsController";
import { withAuth } from "@Middlewares/withAuth";

const router: Router = Router();

router.get("/", withAuth({ resource: "clSkills", action: "view" }, ClSkillsController.getAll as RequestHandler));

router.get("/:id", withAuth({ resource: "clSkills", action: "view" }, ClSkillsController.getById as RequestHandler));

router.post("/", withAuth({ resource: "clSkills", action: "create" }, ClSkillsController.create as RequestHandler));

router.put("/:id", withAuth({ resource: "clSkills", action: "edit" }, ClSkillsController.update as RequestHandler));

router.delete("/:id", withAuth({ resource: "clSkills", action: "delete" }, ClSkillsController.delete as RequestHandler));

export default router;
