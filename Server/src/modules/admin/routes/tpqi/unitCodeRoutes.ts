import { Router, RequestHandler } from "express";
import { UnitCodeController } from "@Admin/controllers/tpqi/unitCodeController";
import { withAuth } from "@Middlewares/withAuth";

const router: Router = Router();

router.get("/", withAuth({ resource: "unitCode", action: "view" }, UnitCodeController.getAll as RequestHandler));

router.get("/:id", withAuth({ resource: "unitCode", action: "view" }, UnitCodeController.getById as RequestHandler));

router.post("/", withAuth({ resource: "unitCode", action: "create" }, UnitCodeController.create as RequestHandler));

router.put("/:id", withAuth({ resource: "unitCode", action: "edit" }, UnitCodeController.update as RequestHandler));

router.delete("/:id", withAuth({ resource: "unitCode", action: "delete" }, UnitCodeController.delete as RequestHandler));

export default router;
