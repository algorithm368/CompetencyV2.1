import { Router, RequestHandler } from "express";
import { DescriptionController } from "@Admin/controllers/sfia/descriptionController";
import { withAuth } from "@Middlewares/withAuth";

const router: Router = Router();

router.get("/", withAuth({ resource: "description", action: "view" }, DescriptionController.getAll as RequestHandler));
router.get("/:id", withAuth({ resource: "description", action: "view" }, DescriptionController.getById as RequestHandler));
router.post("/", withAuth({ resource: "description", action: "create" }, DescriptionController.create as RequestHandler));
router.put("/:id", withAuth({ resource: "description", action: "edit" }, DescriptionController.update as RequestHandler));
router.delete("/:id", withAuth({ resource: "description", action: "delete" }, DescriptionController.delete as RequestHandler));

export default router;
