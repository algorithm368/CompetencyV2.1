import { Router, RequestHandler } from "express";
import { LevelController } from "@Admin/controllers/tpqi/levelController";
import { withAuth } from "@Middlewares/withAuth";

const router: Router = Router();

router.get("/", withAuth({ resource: "tpqi-level", action: "view" }, LevelController.getAll as RequestHandler));

router.get("/:id", withAuth({ resource: "tpqi-level", action: "view" }, LevelController.getById as RequestHandler));

router.post("/", withAuth({ resource: "tpqi-level", action: "create" }, LevelController.create as RequestHandler));

router.put("/:id", withAuth({ resource: "tpqi-level", action: "edit" }, LevelController.update as RequestHandler));

router.delete("/:id", withAuth({ resource: "tpqi-level", action: "delete" }, LevelController.delete as RequestHandler));

export default router;
