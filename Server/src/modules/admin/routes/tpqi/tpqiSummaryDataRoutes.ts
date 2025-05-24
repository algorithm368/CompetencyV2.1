import { Router, RequestHandler } from "express";
import { TpqiSummaryDataController } from "@Admin/controllers/tpqi/tpqiSummaryDataController";

const router: Router = Router();

router.get("/", TpqiSummaryDataController.getAll as RequestHandler);
router.get("/:id", TpqiSummaryDataController.getById as RequestHandler);
router.post("/", TpqiSummaryDataController.create as RequestHandler);
router.put("/:id", TpqiSummaryDataController.update as RequestHandler);
router.delete("/:id", TpqiSummaryDataController.delete as RequestHandler);

export default router;
