import { Router, RequestHandler } from "express";
import { LevelController } from "@Admin/controllers/sfia/levelController";
import { withAuth } from "@Middlewares/withAuth";

const router: Router = Router();

router.get("/", withAuth({ resource: "level", action: "view" }, LevelController.getAll as RequestHandler));
router.get("/:id", withAuth({ resource: "level", action: "view" }, LevelController.getById as RequestHandler));
router.post("/", withAuth({ resource: "level", action: "create" }, LevelController.create as RequestHandler));
router.put("/:id", withAuth({ resource: "level", action: "edit" }, LevelController.update as RequestHandler));
router.delete("/:id", withAuth({ resource: "level", action: "delete" }, LevelController.delete as RequestHandler));

export default router;
