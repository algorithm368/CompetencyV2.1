import { Router, RequestHandler } from "express";
import { SkillController } from "@Admin/controllers/tpqi/skillController";
import { withAuth } from "@/middlewares/withAuth";
const router: Router = Router();

router.get("/", withAuth({ resource: "Skills", action: "read" }, SkillController.getAll as RequestHandler));
router.get("/:id", withAuth({ resource: "Skills", action: "read" }, SkillController.getById as RequestHandler));
router.post("/", withAuth({ resource: "Skills", action: "create" }, SkillController.create as RequestHandler));
router.put("/:id", withAuth({ resource: "Skills", action: "update" }, SkillController.update as RequestHandler));
router.delete("/:id", withAuth({ resource: "Skills", action: "delete" }, SkillController.delete as RequestHandler));

export default router;
