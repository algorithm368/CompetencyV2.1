import { Router } from "express";
import { RoleController } from "@/modules/admin/controllers/rbac/roleController";
import { withAuth } from "@/middlewares/withAuth";

const router = Router();

router.post("/roles", withAuth({ resource: "Role", action: "create" }, RoleController.create));

router.get("/roles", withAuth({ resource: "Role", action: "read" }, RoleController.getAll));

router.get("/roles/:roleId", withAuth({ resource: "Role", action: "read" }, RoleController.getById));

router.put("/roles/:roleId", withAuth({ resource: "Role", action: "update" }, RoleController.update));

// ลบ role เฉพาะ Admin
router.delete("/roles/:roleId", withAuth({ roles: "Admin" }, RoleController.delete));

export default router;
