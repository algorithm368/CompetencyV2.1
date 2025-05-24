import { Router, RequestHandler } from "express";
import { LevelController } from "@Admin/controllers/tpqi/levelController";

const router: Router = Router();

router.get("/", LevelController.getAll as RequestHandler);
router.get("/:id", LevelController.getById as RequestHandler);
router.post("/", LevelController.create as RequestHandler);
router.put("/:id", LevelController.update as RequestHandler);
router.delete("/:id", LevelController.delete as RequestHandler);

export default router;
