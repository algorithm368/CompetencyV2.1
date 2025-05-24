import { Router, RequestHandler } from "express";
import { CareerLevelController } from "@Admin/controllers/tpqi/careerLevelController";

const router: Router = Router();

router.get("/", CareerLevelController.getAll as RequestHandler);
router.get("/:id", CareerLevelController.getById as RequestHandler);
router.post("/", CareerLevelController.create as RequestHandler);
router.put("/:id", CareerLevelController.update as RequestHandler);
router.delete("/:id", CareerLevelController.delete as RequestHandler);

export default router;
