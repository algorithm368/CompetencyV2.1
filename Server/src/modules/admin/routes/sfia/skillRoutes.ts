import { Router, RequestHandler } from "express";
import { SkillsController } from "@Admin/controllers/sfia/skillController";

const router: Router = Router();

// Skills routes
router.get("/", SkillsController.getAll as RequestHandler);
router.get("/:id", SkillsController.getById as RequestHandler);
router.post("/", SkillsController.create as RequestHandler);
router.put("/:id", SkillsController.update as RequestHandler);
router.delete("/:id", SkillsController.delete as RequestHandler);

export default router;
