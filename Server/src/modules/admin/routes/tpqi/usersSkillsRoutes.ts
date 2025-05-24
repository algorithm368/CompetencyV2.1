import { Router, RequestHandler } from "express";
import { UsersSkillsController } from "@Admin/controllers/tpqi/usersSkillsController";

const router: Router = Router();

router.get("/", UsersSkillsController.getAll as RequestHandler);
router.get("/:id", UsersSkillsController.getById as RequestHandler);
router.post("/", UsersSkillsController.create as RequestHandler);
router.put("/:id", UsersSkillsController.update as RequestHandler);
router.delete("/:id", UsersSkillsController.delete as RequestHandler);

export default router;
