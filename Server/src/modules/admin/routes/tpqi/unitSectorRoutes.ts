import { Router, RequestHandler } from "express";
import { UnitSectorController } from "@Admin/controllers/tpqi/unitSectorController";

const router: Router = Router();

router.get("/", UnitSectorController.getAll as RequestHandler);
router.get("/:id", UnitSectorController.getById as RequestHandler);
router.post("/", UnitSectorController.create as RequestHandler);
router.put("/:id", UnitSectorController.update as RequestHandler);
router.delete("/:id", UnitSectorController.delete as RequestHandler);

export default router;
