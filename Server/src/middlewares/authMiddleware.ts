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

/**
 * Middleware สำหรับยืนยันตัวตน
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 🔹 ตรวจสอบ header และ token
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : req.cookies?.token;

    if (!token) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return;
    }

    // 🔹 ตรวจสอบ payload
    let payload;
    try {
      payload = verifyToken(token);
    } catch (err) {
      console.error("Token verification failed:", err);
      res.status(401).json({ message: "Unauthorized: Invalid token" });
      return;
    }

    // 🔹 ดึง user จากฐานข้อมูล
    const user = await prisma.user.findUnique({
      where: { id: String(payload.userId) },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: {
                      include: { asset: true, operation: true },
                    },
                  },
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

    // สร้าง permission key
    const permissions = user.userRoles.flatMap((ur) => ur.role?.rolePermissions?.map((rp) => `${rp.permission.asset.tableName}:${rp.permission.operation.name}`) || []);

    const role = user.userRoles[0]?.role?.name || null;

    (req as AuthenticatedRequest).user = {
      userId: user.id,
      email: user.email,
      role,
      permissions,
    };

    next();
  } catch (error: any) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

/**
 * Middleware เช็คสิทธิ์ resource + action
 */
export const authorize = (resource: string, action: string) => {
  const required = `${resource}:${action}`;

  return (req: Request, res: Response, next: NextFunction): void => {
    const { user } = req as AuthenticatedRequest;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // ถ้าเป็น admin ให้ผ่านเลย
    if (user.role?.toLowerCase() === "admin") return next();

    if (!user.permissions.includes(required)) {
      res.status(403).json({ message: "Forbidden: insufficient permissions" });
      return;
    }

    next();
  };
};

/**
 * Middleware อนุญาตตาม Role
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
 * Middleware อนุญาตตาม Permission
 */
export function authorizePermission(requiredPermissions: string | string[]) {
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

/**
 * Middleware ตรวจสิทธิ์ object-level
 * resource = tableName ของ asset
 * action = operation name
 */
export const authorizeInstance = (resource: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🔹 Bypass admin
    if (user.role?.toLowerCase() === "admin") {
      return next();
    }

    try {
      // หา instance ของ user จาก UserAssetInstance
      const userAssetInstance = await prisma.userAssetInstance.findFirst({
        where: {
          userId: user.userId,
          assetInstance: {
            asset: { tableName: resource },
          },
        },
        include: {
          assetInstance: {
            include: { asset: true },
          },
        },
      });

      if (!userAssetInstance) {
        return res.status(404).json({ message: "No accessible asset instance found for this user" });
      }

      const instance = userAssetInstance.assetInstance;

      // สร้าง permission key
      const permissionKey = `${instance.asset.tableName}:${action}`;

      // เช็ค user permission
      if (!user.permissions.includes(permissionKey)) {
        return res.status(403).json({ message: "Forbidden: insufficient permission for this object" });
      }

      // attach instance ให้ req ใช้ต่อได้
      (req as any).assetInstance = instance;

      next();
    } catch (error) {
      console.error("authorizeInstance error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};

/**
 * ========================
 * Helper Functions (return true/false)
 * ========================
 */
export function checkRole(user: AuthenticatedRequest["user"], allowedRoles: string | string[]): boolean {
  if (!user) return false;
  const rolesToCheck = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return user.role !== null && rolesToCheck.includes(user.role);
}

export function checkPermission(user: AuthenticatedRequest["user"], requiredPermissions: string | string[]): boolean {
  if (!user) return false;
  const userPermissions = user.permissions ?? [];
  const required = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
  return required.some((perm) => userPermissions.includes(perm));
}

export function checkPermissionByAction(user: AuthenticatedRequest["user"], resource: string, action: string): boolean {
  return checkPermission(user, `${resource}:${action}`);
}
