import { Router } from "express";
import { PermissionController } from "@/modules/admin/controllers/rbac/permissionController";
import { withAuth } from "@/middlewares/withAuth";

const router = Router();

router.post("/permissions", withAuth({ resource: "Permission", action: "create" }, PermissionController.create));

router.get("/permissions", withAuth({ resource: "Permission", action: "read" }, PermissionController.getAll));

router.get("/permissions/:permissionId", withAuth({ resource: "Permission", action: "read" }, PermissionController.getById));

router.put("/permissions/:permissionId", withAuth({ resource: "Permission", action: "update" }, PermissionController.update));

router.delete("/permissions/:permissionId", withAuth({ resource: "Permission", action: "delete" }, PermissionController.delete));

export default router;
