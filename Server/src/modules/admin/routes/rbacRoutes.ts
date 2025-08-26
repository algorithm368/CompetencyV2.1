import express from "express";
import { AssetInstanceController } from "@/modules/admin/controllers/rbac/assetInstanceController";
import { AssetController } from "@/modules/admin/controllers/rbac/assetController";
import { LogController } from "@/modules/admin/controllers/rbac/logController";
import { OperationController } from "@/modules/admin/controllers/rbac/operationController";
import { PermissionController } from "@/modules/admin/controllers/rbac/permissionController";
import { RoleController } from "@/modules/admin/controllers/rbac/roleController";
import { RolePermissionController } from "@/modules/admin/controllers/rbac/rolePermissionController";
import { SessionController } from "@/modules/admin/controllers/rbac/sessionController";
import { UserController } from "@/modules/admin/controllers/rbac/userController";
import { UserRoleController } from "@/modules/admin/controllers/rbac/userRoleController ";

export const rbacRoutes = express.Router();

rbacRoutes.get("/", (req, res) => res.send("Hello from RBAC API"));

// --- AssetInstance routes ---
rbacRoutes.post("/asset-instances", AssetInstanceController.createInstance);
rbacRoutes.delete("/asset-instances/:id", AssetInstanceController.deleteInstanceById);
rbacRoutes.delete("/asset-instances", AssetInstanceController.deleteInstance);
rbacRoutes.get("/asset-instances/asset/:assetId", AssetInstanceController.getInstancesByAsset);
rbacRoutes.get("/asset-instances/:id", AssetInstanceController.getInstanceById);
rbacRoutes.put("/asset-instances/:id", AssetInstanceController.updateInstanceRecord);

// --- Asset routes ---
rbacRoutes.post("/assets", AssetController.createAsset);
rbacRoutes.get("/assets/name/:tableName", AssetController.getAssetByName);
rbacRoutes.put("/assets/:id", AssetController.updateAsset);
rbacRoutes.delete("/assets/:id", AssetController.deleteAsset);

// --- Log routes ---
rbacRoutes.post("/logs", LogController.createLog);
rbacRoutes.get("/logs", LogController.getLogs);
rbacRoutes.get("/logs/:id", LogController.getLogById);

// --- Operation routes ---
rbacRoutes.post("/operations", OperationController.createOperation);
rbacRoutes.get("/operations", OperationController.getOperations);
rbacRoutes.get("/operations/:id", OperationController.getOperationById);
rbacRoutes.put("/operations/:id", OperationController.updateOperation);
rbacRoutes.delete("/operations/:id", OperationController.deleteOperation);

// --- Permission routes ---
rbacRoutes.get("/permissions", PermissionController.getAll);
rbacRoutes.get("/permissions/:permissionId", PermissionController.getById);
rbacRoutes.post("/permissions", PermissionController.create);
rbacRoutes.put("/permissions/:permissionId", PermissionController.update);
rbacRoutes.delete("/permissions/:permissionId", PermissionController.delete);

// --- Role routes ---
rbacRoutes.get("/roles", RoleController.getAll);
rbacRoutes.get("/roles/:roleId", RoleController.getById);
rbacRoutes.post("/roles", RoleController.create);
rbacRoutes.put("/roles/:roleId", RoleController.update);
rbacRoutes.delete("/roles/:roleId", RoleController.delete);

// --- RolePermission routes ---
rbacRoutes.post("/role-permissions", RolePermissionController.assignPermission);
rbacRoutes.delete("/role-permissions", RolePermissionController.revokePermission);
rbacRoutes.get("/role-permissions/role/:roleId", RolePermissionController.getPermissionsByRole);

// --- Session routes ---
rbacRoutes.post("/sessions", SessionController.createSession);
rbacRoutes.get("/sessions/:id", SessionController.getSessionById);
rbacRoutes.get("/sessions/by-access-token", SessionController.getSessionByAccessToken);
rbacRoutes.get("/sessions/by-refresh-token", SessionController.getSessionByRefreshToken);
rbacRoutes.delete("/sessions/:id", SessionController.deleteSessionById);
rbacRoutes.delete("/sessions/user/:userId", SessionController.deleteSessionsByUserId);
rbacRoutes.get("/sessions/:id/expired", SessionController.isSessionExpired);

// --- User routes ---
rbacRoutes.get("/users", UserController.getAll);
rbacRoutes.get("/users/:id", UserController.getUserById);
rbacRoutes.get("/users/by-email", UserController.getUserByEmail);
rbacRoutes.post("/users", UserController.createUser);
rbacRoutes.put("/users/:id", UserController.updateUser);
rbacRoutes.delete("/users/:id", UserController.deleteUser);

rbacRoutes.post("/user-roles", UserRoleController.assignRole);
rbacRoutes.delete("/user-roles", UserRoleController.revokeRole);
rbacRoutes.get("/user-roles/user/:userId", UserRoleController.getRolesByUser);
rbacRoutes.get("/user-roles", UserRoleController.getAll);

export default rbacRoutes;
