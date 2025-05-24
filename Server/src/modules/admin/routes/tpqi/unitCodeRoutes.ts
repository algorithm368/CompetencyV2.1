import { Router, RequestHandler } from "express";
import { UnitCodeController } from "@Admin/controllers/tpqi/unitCodeController";

const router: Router = Router();

router.get("/", UnitCodeController.getAll as RequestHandler);
router.get("/:id", UnitCodeController.getById as RequestHandler);
router.post("/", UnitCodeController.create as RequestHandler);
router.put("/:id", UnitCodeController.update as RequestHandler);
router.delete("/:id", UnitCodeController.delete as RequestHandler);

export default router;
