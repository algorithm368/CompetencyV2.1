import express from "express";
import { PermissionController } from "@Competency/controllers/rbac/permissionController";
import { RoleController } from "@Competency/controllers/rbac/roleController";
import { RolePermissionController } from "@Competency/controllers/rbac/rolePermissionController";
import { UserRoleController } from "@Competency/controllers/rbac/userRoleController";
import { AssetController } from "@Competency/controllers/rbac/assetController";
import { AssetPermissionController } from "@Competency/controllers/rbac/assetPermissionController";
// import { authenticate } from "@Middlewares/authMiddleware";

export const rbacRoutes = express.Router();

rbacRoutes.get("/", (req, res) => {
  res.send("Hello from RBAC API");
});

// Roles routes
rbacRoutes.post("/roles" /*, authenticate*/, RoleController.create);
rbacRoutes.get("/roles", RoleController.getAll);
rbacRoutes.get("/roles/:roleId", RoleController.getById);
rbacRoutes.put("/roles/:roleId" /*, authenticate*/, RoleController.update);
rbacRoutes.delete("/roles/:roleId" /*, authenticate*/, RoleController.delete);

// Permissions routes
rbacRoutes.post("/permissions" /*, authenticate*/, PermissionController.create);
rbacRoutes.get("/permissions" /*, authenticate*/, PermissionController.getAll);
rbacRoutes.get("/permissions/:permissionId" /*, authenticate*/, PermissionController.getById);
rbacRoutes.put("/permissions/:permissionId" /*, authenticate*/, PermissionController.update);
rbacRoutes.delete("/permissions/:permissionId" /*, authenticate*/, PermissionController.delete);

// UserRoles routes
rbacRoutes.post("/user/:userId/assign-role" /*, authenticate */, UserRoleController.assignRole);
rbacRoutes.delete("/user/:userId/revoke-role" /*, authenticate */, UserRoleController.revokeRole);
rbacRoutes.get("/user/:userId/roles", UserRoleController.getRoles);
rbacRoutes.get("/users", UserRoleController.getAll);

// RolePermissions routes
rbacRoutes.post("/role/:roleId/assign-permission" /*, authenticate*/, RolePermissionController.assignPermission);
rbacRoutes.delete("/role/:roleId/revoke-permission" /*, authenticate*/, RolePermissionController.revokePermission);
rbacRoutes.get("/role/:roleId/permissions" /*, authenticate*/, RolePermissionController.getPermissions);

// Assets routes
rbacRoutes.post("/assets" /*, authenticate*/, AssetController.create);
rbacRoutes.get("/assets", AssetController.getAll);
rbacRoutes.get("/assets/:assetId", AssetController.getById);
rbacRoutes.put("/assets/:assetId" /*, authenticate*/, AssetController.update);
rbacRoutes.delete("/assets/:assetId" /*, authenticate*/, AssetController.delete);

// AssetPermissions routes
rbacRoutes.get("/assets/:assetId/permissions", AssetPermissionController.getPermissions);
rbacRoutes.post("/assets/:assetId/permissions", AssetPermissionController.assignPermission);
rbacRoutes.delete("/assets/:assetId/permissions", AssetPermissionController.revokePermission);

export default rbacRoutes;
