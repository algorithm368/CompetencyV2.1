import { Router, RequestHandler } from "express";
import { AllDetailsController } from "@Admin/controllers/tpqi/allDetailsController";
import { withAuth } from "@Middlewares/withAuth";

const router: Router = Router();

router.get("/", withAuth({ resource: "allDetails", action: "view" }, AllDetailsController.getAll as RequestHandler));

router.get("/:id", withAuth({ resource: "allDetails", action: "view" }, AllDetailsController.getById as RequestHandler));

router.post("/", withAuth({ resource: "allDetails", action: "create" }, AllDetailsController.create as RequestHandler));

router.put("/:id", withAuth({ resource: "allDetails", action: "edit" }, AllDetailsController.update as RequestHandler));

router.delete("/:id", withAuth({ resource: "allDetails", action: "delete" }, AllDetailsController.delete as RequestHandler));

export default router;
