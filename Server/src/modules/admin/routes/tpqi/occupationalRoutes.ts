import { Router, RequestHandler } from "express";
import { OccupationalController } from "@Admin/controllers/tpqi/occupationalController";

const router: Router = Router();

router.get("/", OccupationalController.getAll as RequestHandler);
router.get("/:id", OccupationalController.getById as RequestHandler);
router.post("/", OccupationalController.create as RequestHandler);
router.put("/:id", OccupationalController.update as RequestHandler);
router.delete("/:id", OccupationalController.delete as RequestHandler);

export default router;
