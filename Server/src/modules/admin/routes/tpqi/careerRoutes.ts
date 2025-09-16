import { Router, RequestHandler } from "express";
import { CareerController } from "@Admin/controllers/tpqi/careerController";
import { withAuth } from "@Middlewares/withAuth";

const router: Router = Router();

router.get("/", withAuth({ resource: "career", action: "view" }, CareerController.getAll as RequestHandler));

router.get("/:id", withAuth({ resource: "career", action: "view" }, CareerController.getById as RequestHandler));

router.post("/", withAuth({ resource: "career", action: "create" }, CareerController.create as RequestHandler));

router.put("/:id", withAuth({ resource: "career", action: "edit" }, CareerController.update as RequestHandler));

router.delete("/:id", withAuth({ resource: "career", action: "delete" }, CareerController.delete as RequestHandler));

export default router;
