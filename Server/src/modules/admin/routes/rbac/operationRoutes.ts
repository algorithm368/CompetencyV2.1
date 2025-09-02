import { Router } from "express";
import { OperationController } from "@/modules/admin/controllers/rbac/operationController";
import { withAuth } from "@/middlewares/withAuth";

const router = Router();

router.post("/operations", withAuth({ resource: "Operation", action: "create" }, OperationController.createOperation));

router.get("/operations", withAuth({ resource: "Operation", action: "read" }, OperationController.getOperations));

router.get("/operations/:id", withAuth({ resource: "Operation", action: "read" }, OperationController.getOperationById));

router.put("/operations/:id", withAuth({ resource: "Operation", action: "update" }, OperationController.updateOperation));

router.delete("/operations/:id", withAuth({ resource: "Operation", action: "delete" }, OperationController.deleteOperation));

export default router;
