import { Router, RequestHandler } from "express";
import { SummaryDataController } from "@Admin/controllers/sfia/summaryDataController";

const router: Router = Router();

// SummaryData routes
router.get("/", SummaryDataController.getAll as RequestHandler);
router.get("/:id", SummaryDataController.getById as RequestHandler);
router.post("/", SummaryDataController.create as RequestHandler);
router.put("/:id", SummaryDataController.update as RequestHandler);
router.delete("/:id", SummaryDataController.delete as RequestHandler);

export default router;
