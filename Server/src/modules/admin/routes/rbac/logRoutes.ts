import { Router } from "express";
import { LogController } from "@/modules/admin/controllers/rbac/logController";
import { withAuth } from "@/middlewares/withAuth";

const router = Router();

router.post("/logs", withAuth({ resource: "Log", action: "create" }, LogController.createLog));

router.get("/logs", withAuth({ resource: "Log", action: "read" }, LogController.getLogs));

router.get("/logs/:id", withAuth({ resource: "Log", action: "read" }, LogController.getLogById));

export default router;
