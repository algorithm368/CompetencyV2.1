import { Router, RequestHandler } from "express";
import { SectorController } from "@Admin/controllers/tpqi/sectorController";
import { withAuth } from "@/middlewares/withAuth";
const router: Router = Router();

router.get("/", withAuth({ resource: "Sector", action: "read" }, SectorController.getAll as RequestHandler));
router.get("/:id", withAuth({ resource: "Sector", action: "read" }, SectorController.getById as RequestHandler));
router.post("/", withAuth({ resource: "Sector", action: "create" }, SectorController.create as RequestHandler));
router.put("/:id", withAuth({ resource: "Sector", action: "update" }, SectorController.update as RequestHandler));
router.delete("/:id", withAuth({ resource: "Sector", action: "delete" }, SectorController.delete as RequestHandler));

export default router;
