import { Router, RequestHandler } from "express";
import { TpqiSummaryDataController } from "@Admin/controllers/tpqi/tpqiSummaryDataController";
import { withAuth } from "@Middlewares/withAuth";

const router: Router = Router();

router.get("/", withAuth({ resource: "tpqiSummaryData", action: "view" }, TpqiSummaryDataController.getAll as RequestHandler));

router.get("/:id", withAuth({ resource: "tpqiSummaryData", action: "view" }, TpqiSummaryDataController.getById as RequestHandler));

router.post("/", withAuth({ resource: "tpqiSummaryData", action: "create" }, TpqiSummaryDataController.create as RequestHandler));

router.put("/:id", withAuth({ resource: "tpqiSummaryData", action: "edit" }, TpqiSummaryDataController.update as RequestHandler));

router.delete("/:id", withAuth({ resource: "tpqiSummaryData", action: "delete" }, TpqiSummaryDataController.delete as RequestHandler));

export default router;
