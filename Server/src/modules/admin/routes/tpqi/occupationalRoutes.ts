import { Router, RequestHandler } from "express";
import { OccupationalController } from "@Admin/controllers/tpqi/occupationalController";
import { withAuth } from "@Middlewares/withAuth";

const router: Router = Router();

router.get("/", withAuth({ resource: "occupational", action: "view" }, OccupationalController.getAll as RequestHandler));

router.get("/:id", withAuth({ resource: "occupational", action: "view" }, OccupationalController.getById as RequestHandler));

router.post("/", withAuth({ resource: "occupational", action: "create" }, OccupationalController.create as RequestHandler));

router.put("/:id", withAuth({ resource: "occupational", action: "edit" }, OccupationalController.update as RequestHandler));

router.delete("/:id", withAuth({ resource: "occupational", action: "delete" }, OccupationalController.delete as RequestHandler));

export default router;
