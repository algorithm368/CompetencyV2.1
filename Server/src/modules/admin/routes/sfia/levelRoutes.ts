import { Router, RequestHandler } from "express";
import { LevelsController } from "@Admin/controllers/sfia/levelController";

const router: Router = Router();

// Levels routes
router.get("/", LevelsController.getAll as RequestHandler);
router.get("/:id", LevelsController.getById as RequestHandler);
router.post("/", LevelsController.create as RequestHandler);
router.put("/:id", LevelsController.update as RequestHandler);
router.delete("/:id", LevelsController.delete as RequestHandler);

export default router;
