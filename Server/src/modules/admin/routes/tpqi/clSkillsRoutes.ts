import { Router, RequestHandler } from "express";
import { ClSkillsController } from "@Admin/controllers/tpqi/clSkillsController";

const router: Router = Router();

router.get("/", ClSkillsController.getAll as RequestHandler);
router.get("/:id", ClSkillsController.getById as RequestHandler);
router.post("/", ClSkillsController.create as RequestHandler);
router.put("/:id", ClSkillsController.update as RequestHandler);
router.delete("/:id", ClSkillsController.delete as RequestHandler);

export default router;
