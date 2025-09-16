import { Router, RequestHandler } from "express";
import { DetailsController } from "@Admin/controllers/tpqi/detailsController";
import { withAuth } from "@Middlewares/withAuth";

const router: Router = Router();

router.get("/", withAuth({ resource: "details", action: "view" }, DetailsController.getAll as RequestHandler));

router.get("/:id", withAuth({ resource: "details", action: "view" }, DetailsController.getById as RequestHandler));

router.post("/", withAuth({ resource: "details", action: "create" }, DetailsController.create as RequestHandler));

router.put("/:id", withAuth({ resource: "details", action: "edit" }, DetailsController.update as RequestHandler));

router.delete("/:id", withAuth({ resource: "details", action: "delete" }, DetailsController.delete as RequestHandler));

export default router;
