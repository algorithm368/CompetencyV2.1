import { Router } from "express";
import { UserRoleController } from "@/modules/admin/controllers/rbac/userRoleController";
import { withAuth } from "@/middlewares/withAuth";

const router = Router();

router.post("/user-roles/assign-multiple", withAuth({ resource: "UserRole", action: "create" }, UserRoleController.assignRole));

router.delete("/user-roles", withAuth({ resource: "UserRole", action: "delete" }, UserRoleController.revokeRole));

router.get("/user-roles/user/:userId", withAuth({ resource: "UserRole", action: "read" }, UserRoleController.getRolesByUser));

router.get("/user-roles", withAuth({ resource: "UserRole", action: "read" }, UserRoleController.getAll));

export default router;
