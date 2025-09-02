import { Router } from "express";
import { RolePermissionController } from "@/modules/admin/controllers/rbac/rolePermissionController";
import { withAuth } from "@/middlewares/withAuth";

const router = Router();

router.post("/role-permissions", withAuth({ resource: "RolePermission", action: "create" }, RolePermissionController.assignPermission));

router.delete("/role-permissions", withAuth({ resource: "RolePermission", action: "delete" }, RolePermissionController.revokePermission));

router.get("/role-permissions/role/:roleId", withAuth({ resource: "RolePermission", action: "read" }, RolePermissionController.getPermissionsByRole));

export default router;
