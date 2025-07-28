import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client_competency";
import { verifyToken } from "@Utils/tokenUtils";

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string | null;
    permissions: string[];
  };
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : req.cookies?.token;

    if (!token) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return;
    }

    const payload = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: String(payload.userId) },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }

    // ดึง permissions keys
    const permissions = user.userRoles.flatMap((ur) => ur.role?.rolePermissions?.map((rp) => rp.permission.key) || []);

    const role = user.userRoles[0]?.role?.name || null;

    (req as AuthenticatedRequest).user = {
      userId: user.id,
      email: user.email,
      role,
      permissions,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

export const authorize = (resource: string, action: string) => {
  const required = `${resource}:${action}`;

  return (req: Request, res: Response, next: NextFunction): void => {
    const { user } = req as AuthenticatedRequest;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!user.permissions.includes(required)) {
      res.status(403).json({ message: "Forbidden: insufficient permissions" });
      return;
    }

    next();
  };
};

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

    if (!userRole || !rolesToCheck.includes(userRole)) {
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
