import { Router, RequestHandler } from "express";
import { UnitOccupationalController } from "@Admin/controllers/tpqi/unitOccupationalController";

const router: Router = Router();

router.get("/", UnitOccupationalController.getAll as RequestHandler);
router.get("/:id", UnitOccupationalController.getById as RequestHandler);
router.post("/", UnitOccupationalController.create as RequestHandler);
router.put("/:id", UnitOccupationalController.update as RequestHandler);
router.delete("/:id", UnitOccupationalController.delete as RequestHandler);

export default router;
