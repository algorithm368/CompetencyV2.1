import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@Types/authTypes";

type PermissionKey = string;

/**
 * Creates middleware to authorize based on user role.
 *
 * @param {string | string[]} allowedRoles - A single role or an array of roles that are permitted to access the route.
 * @returns {(req: AuthenticatedRequest, res: Response, next: NextFunction) => void} Middleware that:
 *   - Checks if `req.user` exists; if not, responds with 401 Unauthorized.
 *   - Checks if `req.user.role` is included in `allowedRoles`; if not, responds with 403 Forbidden.
 *   - Otherwise, calls `next()` to proceed.
 *
 * @example
 * // Allow only users with the "admin" or "manager" roles:
 * app.get("/admin", authenticate, authorizeRole(["admin", "manager"]), (req, res) => {
 *   res.send("Welcome, admin or manager!");
 * });
 */
export function authorizeRole(allowedRoles: string | string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userRole = req.user.role;
    const rolesToCheck = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!rolesToCheck.includes(userRole)) {
      res.status(403).json({ message: "Forbidden: insufficient role" });
      return;
    }

    next();
  };
}

/**
 * Creates middleware to authorize based on user permissions.
 *
 * @param {PermissionKey | PermissionKey[]} requiredPermissions - A single permission key or an array of permission keys required to access the route.
 * @returns {(req: AuthenticatedRequest, res: Response, next: NextFunction) => void} Middleware that:
 *   - Checks if `req.user` exists; if not, responds with 401 Unauthorized.
 *   - If `req.user.permissions` is empty or undefined, responds with 403 Forbidden.
 *   - Checks if at least one of the `requiredPermissions` is included in `req.user.permissions`;
 *     if not, responds with 403 Forbidden.
 *   - Otherwise, calls `next()` to proceed.
 *
 * @example
 * // Allow users who have either "posts:create" or "posts:edit" permission:
 * app.post("/posts", authenticate, authorizePermission(["posts:create", "posts:edit"]), (req, res) => {
 *   res.send("You can create or edit posts");
 * });
 */
export function authorizePermission(requiredPermissions: PermissionKey | PermissionKey[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userPermissions = user.permissions ?? [];

    if (userPermissions.length === 0) {
      res.status(403).json({ message: "Forbidden: no permissions assigned" });
      return;
    }

    const required = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
    const hasPermission = required.some((perm) => userPermissions.includes(perm));

    if (!hasPermission) {
      res.status(403).json({ message: "Forbidden: insufficient permissions" });
      return;
    }

    next();
  };
}
