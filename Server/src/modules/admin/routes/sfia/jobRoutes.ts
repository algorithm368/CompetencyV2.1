import { Router, RequestHandler } from "express";
import { JobsController } from "@Admin/controllers/sfia/jobController";

const router: Router = Router();

// Jobs routes
router.get("/", JobsController.getAll as RequestHandler);
router.get("/:code", JobsController.getById as RequestHandler);
router.post("/", JobsController.create as RequestHandler);
router.put("/:code", JobsController.update as RequestHandler);
router.delete("/:code", JobsController.delete as RequestHandler);

export default router;
