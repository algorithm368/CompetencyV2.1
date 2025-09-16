import { Router, RequestHandler } from "express";
import { UnitSectorController } from "@Admin/controllers/tpqi/unitSectorController";
import { withAuth } from "@Middlewares/withAuth";

const router: Router = Router();

router.get("/", withAuth({ resource: "unitSector", action: "view" }, UnitSectorController.getAll as RequestHandler));

router.get("/:id", withAuth({ resource: "unitSector", action: "view" }, UnitSectorController.getById as RequestHandler));

router.post("/", withAuth({ resource: "unitSector", action: "create" }, UnitSectorController.create as RequestHandler));

router.put("/:id", withAuth({ resource: "unitSector", action: "edit" }, UnitSectorController.update as RequestHandler));

router.delete("/:id", withAuth({ resource: "unitSector", action: "delete" }, UnitSectorController.delete as RequestHandler));

export default router;
