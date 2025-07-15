import express from "express";
import { PermissionController } from "@Competency/controllers/rbac/permissionController";
import { RoleController } from "@Competency/controllers/rbac/roleController";
import { RolePermissionController } from "@Competency/controllers/rbac/rolePermissionController";
import { UserRoleController } from "@Competency/controllers/rbac/userRoleController";
// import { authenticate } from "@Middlewares/authMiddleware";

export const rbacRoutes = express.Router();

rbacRoutes.get("/", (req, res) => {
  res.send("Hello from Rbac API");
});

// Roles
rbacRoutes.post("/roles", RoleController.create);
rbacRoutes.get("/roles", RoleController.getAll);
rbacRoutes.get("/roles/:roleId", RoleController.getById);
rbacRoutes.put("/roles/:roleId", RoleController.update);
rbacRoutes.delete("/roles/:roleId", RoleController.delete);

// Permissions
rbacRoutes.post("/permissions", PermissionController.create);
rbacRoutes.get("/permissions", PermissionController.getAll);
rbacRoutes.get("/permissions/:permissionId", PermissionController.getById);
rbacRoutes.put("/permissions/:permissionId", PermissionController.update);
rbacRoutes.delete("/permissions/:permissionId", PermissionController.delete);

// UserRoles
rbacRoutes.post("/assign-role", UserRoleController.assign);
rbacRoutes.delete("/revoke-role", UserRoleController.revoke);
rbacRoutes.get("/user/:userId/roles", UserRoleController.getByUser);
rbacRoutes.get("/users", UserRoleController.getAllUsers);
rbacRoutes.get("/roles", UserRoleController.getAllRoles);

// RolePermissions
rbacRoutes.post("/assign-permission", RolePermissionController.assign);
rbacRoutes.delete("/revoke-permission", RolePermissionController.revoke);
rbacRoutes.get("/role/:roleId/permissions", RolePermissionController.getByRole);

export default rbacRoutes;
