import { Router, RequestHandler } from "express";
import { LevelController } from "@Admin/controllers/sfia/levelController";

const router: Router = Router();

// Level routes
router.get("/", LevelController.getAll as RequestHandler);
router.get("/:id", LevelController.getById as RequestHandler);
router.post("/", LevelController.create as RequestHandler);
router.put("/:id", LevelController.update as RequestHandler);
router.delete("/:id", LevelController.delete as RequestHandler);

export default router;
