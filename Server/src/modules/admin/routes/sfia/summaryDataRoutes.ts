import { Router, RequestHandler } from "express";
import { SummaryDataController } from "@Admin/controllers/sfia/summaryDataController";
import { withAuth } from "@Middlewares/withAuth";

const router: Router = Router();

router.get("/", withAuth({ resource: "summaryData", action: "view" }, SummaryDataController.getAll as RequestHandler));

router.get("/:id", withAuth({ resource: "summaryData", action: "view" }, SummaryDataController.getById as RequestHandler));

router.post("/", withAuth({ resource: "summaryData", action: "create" }, SummaryDataController.create as RequestHandler));

router.put("/:id", withAuth({ resource: "summaryData", action: "edit" }, SummaryDataController.update as RequestHandler));

router.delete("/:id", withAuth({ resource: "summaryData", action: "delete" }, SummaryDataController.delete as RequestHandler));

export default router;
