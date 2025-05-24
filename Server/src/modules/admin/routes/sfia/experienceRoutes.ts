import { Router, RequestHandler } from "express";
import { ExperienceController } from "@Admin/controllers/sfia/experienceController";

const router: Router = Router();

// Experience routes
router.get("/", ExperienceController.getAll as RequestHandler);
router.get("/:id", ExperienceController.getById as RequestHandler);
router.post("/", ExperienceController.create as RequestHandler);
router.put("/:id", ExperienceController.update as RequestHandler);
router.delete("/:id", ExperienceController.delete as RequestHandler);

export default router;
