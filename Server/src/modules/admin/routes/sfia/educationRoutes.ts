import { Router, RequestHandler } from "express";
import { EducationController } from "@Admin/controllers/sfia/educationController";

const router: Router = Router();

// Education routes
router.get("/", EducationController.getAll as RequestHandler);
router.get("/:id", EducationController.getById as RequestHandler);
router.post("/", EducationController.create as RequestHandler);
router.put("/:id", EducationController.update as RequestHandler);
router.delete("/:id", EducationController.delete as RequestHandler);

export default router;
