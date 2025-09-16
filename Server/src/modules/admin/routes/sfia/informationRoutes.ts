import { Router, RequestHandler } from "express";
import { InformationController } from "@Admin/controllers/sfia/informationController";
import { withAuth } from "@Middlewares/withAuth";

const router: Router = Router();

// Information routes
router.get("/", withAuth({ resource: "information", action: "view" }, InformationController.getAll as RequestHandler));
router.get("/:id", withAuth({ resource: "information", action: "view" }, InformationController.getById as RequestHandler));
router.post("/", withAuth({ resource: "information", action: "create" }, InformationController.create as RequestHandler));
router.put("/:id", withAuth({ resource: "information", action: "edit" }, InformationController.update as RequestHandler));
router.delete("/:id", withAuth({ resource: "information", action: "delete" }, InformationController.delete as RequestHandler));

export default router;
