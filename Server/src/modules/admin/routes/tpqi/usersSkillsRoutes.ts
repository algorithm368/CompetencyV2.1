import { Router, RequestHandler } from "express";
import { UsersSkillsController } from "@Admin/controllers/tpqi/usersSkillsController";
import { withAuth } from "@Middlewares/withAuth";

const router: Router = Router();

router.get("/", withAuth({ resource: "usersSkills", action: "view" }, UsersSkillsController.getAll as RequestHandler));

router.get("/:id", withAuth({ resource: "usersSkills", action: "view" }, UsersSkillsController.getById as RequestHandler));

router.post("/", withAuth({ resource: "usersSkills", action: "create" }, UsersSkillsController.create as RequestHandler));

router.put("/:id", withAuth({ resource: "usersSkills", action: "edit" }, UsersSkillsController.update as RequestHandler));

router.delete("/:id", withAuth({ resource: "usersSkills", action: "delete" }, UsersSkillsController.delete as RequestHandler));

export default router;
