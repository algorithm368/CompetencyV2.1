import { Router, RequestHandler } from "express";
import { DescriptionController } from "@Admin/controllers/sfia/descriptionController";

const router: Router = Router();

// Description routes
router.get("/", DescriptionController.getAll as RequestHandler);
router.get("/:id", DescriptionController.getById as RequestHandler);
router.post("/", DescriptionController.create as RequestHandler);
router.put("/:id", DescriptionController.update as RequestHandler);
router.delete("/:id", DescriptionController.delete as RequestHandler);

export default router;
