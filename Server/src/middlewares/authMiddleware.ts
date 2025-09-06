import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client_competency";
import { verifyToken } from "@Utils/tokenUtils";

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    roles: string[];
    permissions: string[];
  };
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : req.cookies?.token;
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

    let payload;
    try {
      payload = verifyToken(token);
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: String(payload.userId) },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: { include: { asset: true, operation: true } } },
                },
              },
            },
          },
        },
      },
    });

    if (!user) return res.status(401).json({ message: "Unauthorized: User not found" });

    const permissions = user.userRoles.flatMap((ur) => ur.role?.rolePermissions?.map((rp) => `${rp.permission.asset.tableName}:${rp.permission.operation.name}`) || []);
    const roles = user.userRoles.map((ur) => ur.role?.name).filter(Boolean) as string[];

    (req as AuthenticatedRequest).user = { userId: user.id, email: user.email, roles, permissions };
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

export const authorizeRole = (allowedRoles: string | string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.roles.includes("Admin")) return next();

    const rolesToCheck = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!req.user.roles.some((r) => rolesToCheck.includes(r))) return res.status(403).json({ message: "Forbidden: insufficient role" });

    next();
  };
};

export const authorizePermission = (requiredPermissions: string | string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const required = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
    const hasPermission = required.some((perm) => user.permissions.includes(perm));

    if (!hasPermission) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };
};

export const authorizeInstance = (resource: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (user.roles.includes("Admin")) return next();
    try {
      const userAssetInstance = await prisma.userAssetInstance.findFirst({
        where: { userId: user.userId, assetInstance: { asset: { tableName: resource } } },
        include: { assetInstance: { include: { asset: true } } },
      });

      if (!userAssetInstance) {
        const permissionKey = `${resource}:${action}`;
        if (!user.permissions.includes(permissionKey)) return res.status(403).json({ message: "Forbidden: insufficient permissions (no instance + no role)" });

        return next();
      }

      const instance = userAssetInstance.assetInstance;
      const permissionKey = `${instance.asset.tableName}:${action}`;
      if (!user.permissions.includes(permissionKey)) return res.status(403).json({ message: "Forbidden: insufficient permission for this object" });

      (req as any).assetInstance = instance;
      next();
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  };
};
