import { Router, RequestHandler } from "express";
import { UnitOccupationalController } from "@Admin/controllers/tpqi/unitOccupationalController";
import { withAuth } from "@Middlewares/withAuth";

const router: Router = Router();

router.get("/", withAuth({ resource: "unitOccupational", action: "view" }, UnitOccupationalController.getAll as RequestHandler));

router.get("/:id", withAuth({ resource: "unitOccupational", action: "view" }, UnitOccupationalController.getById as RequestHandler));

router.post("/", withAuth({ resource: "unitOccupational", action: "create" }, UnitOccupationalController.create as RequestHandler));

router.put("/:id", withAuth({ resource: "unitOccupational", action: "edit" }, UnitOccupationalController.update as RequestHandler));

router.delete("/:id", withAuth({ resource: "unitOccupational", action: "delete" }, UnitOccupationalController.delete as RequestHandler));

export default router;
