import { Router, RequestHandler } from "express";
import { SectorController } from "@Admin/controllers/tpqi/sectorController";

const router: Router = Router();

router.get("/", SectorController.getAll as RequestHandler);
router.get("/:id", SectorController.getById as RequestHandler);
router.post("/", SectorController.create as RequestHandler);
router.put("/:id", SectorController.update as RequestHandler);
router.delete("/:id", SectorController.delete as RequestHandler);

export default router;
