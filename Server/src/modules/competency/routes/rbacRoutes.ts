import express from "express";
import { createPermission, getPermissions, getPermissionById, updatePermission, deletePermission } from "@Competency/controllers/rbac/permissionController";
import { createRole, getRoles, getRoleById, updateRole, deleteRole } from "@Competency/controllers/rbac/roleController";
import { assignPermissionToRole, revokePermissionFromRole, getPermissionsForRole } from "@Competency/controllers/rbac/rolePermissionController";
import { assignRoleToUser, revokeRoleFromUser, getRolesForUser } from "@Competency/controllers/rbac/userRoleController";
import { authenticate } from "@Middlewares/authMiddleware";

export const rbacRoutes = express.Router();

// === Roles =============================================================================================
/**
 * @swagger
 * tags:
 *   name: RBAC
 *   description: Role-Based Access Control APIs
 */

/**
 * @swagger
 * /api/rbac/roles:
 *   post:
 *     summary: Create a new role
 *     tags: [RBAC]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleName
 *             properties:
 *               roleName:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Role created
 *       500:
 *         description: Internal server error
 */
rbacRoutes.post("/roles", authenticate, createRole);

/**
 * @swagger
 * /api/rbac/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [RBAC]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles
 *       500:
 *         description: Internal server error
 */
rbacRoutes.get("/roles", getRoles);

/**
 * @swagger
 * /api/rbac/roles/{roleId}:
 *   get:
 *     summary: Get role by ID
 *     tags: [RBAC]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Role found
 *       404:
 *         description: Role not found
 */
rbacRoutes.get("/roles/:roleId", authenticate, getRoleById);

/**
 * @swagger
 * /api/rbac/roles/{roleId}:
 *   put:
 *     summary: Update a role
 *     tags: [RBAC]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleName:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role updated
 */
rbacRoutes.put("/roles/:roleId", authenticate, updateRole);

/**
 * @swagger
 * /api/rbac/roles/{roleId}:
 *   delete:
 *     summary: Delete a role
 *     tags: [RBAC]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Role deleted
 */
rbacRoutes.delete("/roles/:roleId", authenticate, deleteRole);

// === Permissions =================================================================================
/**
 * @swagger
 * /api/rbac/permissions:
 *   post:
 *     summary: Create a new permission
 *     tags: [RBAC]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissionName
 *             properties:
 *               permissionName:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Permission created
 *       500:
 *         description: Internal server error
 */
rbacRoutes.post("/permissions", createPermission);

/**
 * @swagger
 * /api/rbac/permission/{permissionId}:
 *   get:
 *     summary: Get a permission by ID
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: permissionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the permission
 *     responses:
 *       200:
 *         description: The permission details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the permission
 *                 name:
 *                   type: string
 *                   description: The name of the permission
 *                 description:
 *                   type: string
 *                   description: A detailed description of the permission
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Server error
 */
rbacRoutes.post("/permission/:permissionId", authenticate, getPermissionById);

/**
 * @swagger
 * /api/rbac/permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [RBAC]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of permissions
 *       500:
 *         description: Internal server error
 */
rbacRoutes.get("/permissions", getPermissions);

/**
 * @swagger
 * /api/rbac/permissions/{permissionId}:
 *   put:
 *     summary: Update a permission
 *     tags: [RBAC]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: permissionId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               permissionName:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Permission updated
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Internal server error
 */
rbacRoutes.put("/permissions/:permissionId", authenticate, updatePermission);

/**
 * @swagger
 * /api/rbac/permissions/{permissionId}:
 *   delete:
 *     summary: Delete a permission
 *     tags: [RBAC]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: permissionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Permission deleted
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Internal server error
 */
rbacRoutes.delete("/permissions/:permissionId", authenticate, deletePermission);

// === UserRoles (Assign/Revoke Roles to Users) =============================================================
/**
 * @swagger
 * /api/rbac/assign-role:
 *   post:
 *     summary: Assign a role to a user
 *     tags: [UserRoles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - roleId
 *             properties:
 *               userId:
 *                 type: integer
 *               roleId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Role assigned successfully
 *       500:
 *         description: Server error
 */
rbacRoutes.post("/assign-role", authenticate, assignRoleToUser);

/**
 * @swagger
 * /api/rbac/revoke-role:
 *   delete:
 *     summary: Revoke a role from a user
 *     tags: [UserRoles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - roleId
 *             properties:
 *               userId:
 *                 type: integer
 *               roleId:
 *                 type: integer
 *     responses:
 *       204:
 *         description: Role revoked successfully
 *       500:
 *         description: Server error
 */
rbacRoutes.delete("/revoke-role", authenticate, revokeRoleFromUser);
/**
 * @swagger
 * /api/rbac/user/{userId}/roles:
 *   get:
 *     summary: Get all roles assigned to a user
 *     tags: [UserRoles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of roles
 *       500:
 *         description: Server error
 */
rbacRoutes.get("/user/:userId/roles", authenticate, getRolesForUser);

// === RolePermissions (Assign/Revoke Permissions to Roles) =============================================
/**
 * @swagger
 * /api/rbac/assign-permission:
 *   post:
 *     summary: Assign a permission to a role
 *     tags: [RolePermissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleId
 *               - permissionId
 *             properties:
 *               roleId:
 *                 type: integer
 *               permissionId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Permission assigned successfully
 *       500:
 *         description: Server error
 */
rbacRoutes.post("/assign-permission", authenticate, assignPermissionToRole);
/**
 * @swagger
 * /api/rbac/revoke-permission:
 *   delete:
 *     summary: Revoke a permission from a role
 *     tags: [RolePermissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleId
 *               - permissionId
 *             properties:
 *               roleId:
 *                 type: integer
 *               permissionId:
 *                 type: integer
 *     responses:
 *       204:
 *         description: Permission revoked successfully
 *       500:
 *         description: Server error
 */
rbacRoutes.delete("/revoke-permission", authenticate, revokePermissionFromRole);
/**
 * @swagger
 * /api/rbac/role/{roleId}/permissions:
 *   get:
 *     summary: Get all permissions assigned to a role
 *     tags: [RolePermissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the role
 *     responses:
 *       200:
 *         description: List of permissions
 *       500:
 *         description: Server error
 */
rbacRoutes.get("/role/:roleId/permissions", authenticate, getPermissionsForRole);

export default rbacRoutes;
