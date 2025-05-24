import { Router, RequestHandler } from "express";
import { CareerController } from "@Admin/controllers/tpqi/careerController";

const router: Router = Router();

router.get("/", CareerController.getAll as RequestHandler);
router.get("/:id", CareerController.getById as RequestHandler);
router.post("/", CareerController.create as RequestHandler);
router.put("/:id", CareerController.update as RequestHandler);
router.delete("/:id", CareerController.delete as RequestHandler);

export default router;
