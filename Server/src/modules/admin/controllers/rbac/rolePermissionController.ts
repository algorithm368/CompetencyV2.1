import { Request, Response, NextFunction } from "express";
import { RolePermissionService } from "@/modules/admin/services/rbac/rolePermissionService";
import type { RolePermission } from "@prisma/client_competency";

const service = new RolePermissionService();

interface AuthenticatedRequest extends Request {
  user?: { userId?: string };
}

// ปรับฟังก์ชันนี้เพื่อ map ข้อมูลให้สอดคล้องกับข้อมูลที่ต้องการ
function RolePermissionView(rp: RolePermission & { permission?: any }) {
  return {
    id: rp.id,
    roleId: rp.roleId,
    permissionId: rp.permissionId,
    grantedAt: rp.grantedAt,
    permission: rp.permission
      ? {
          id: rp.permission.id,
          operationId: rp.permission.operationId,
          assetId: rp.permission.assetId,
          operation: rp.permission.operation
            ? {
                id: rp.permission.operation.id,
                name: rp.permission.operation.name,
              }
            : undefined,
          asset: rp.permission.asset
            ? {
                id: rp.permission.asset.id,
                tableName: rp.permission.asset.tableName,
              }
            : undefined,
        }
      : undefined,
  };
}

// ฟังก์ชันที่ใช้ map ข้อมูลทั้งหมด
function RolePermissionListView(items: (RolePermission & { permission?: any })[]) {
  return items.map(RolePermissionView);
}

export class RolePermissionController {
  // มอบสิทธิ์ให้ role
  static async assignPermission(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { roleId, assetId, operationId } = req.body;
      const actor = req.user?.userId || "system";

      if (typeof roleId !== "number" || typeof assetId !== "number" || typeof operationId !== "number") {
        return res.status(400).json({ error: "roleId, assetId, and operationId must be numbers" });
      }

      const assigned = await service.assignPermissionToRole(roleId, assetId, operationId, actor);
      return res.status(201).json(RolePermissionView(assigned));
    } catch (error) {
      next(error);
    }
  }

  // ยกเลิกสิทธิ์ของ role
  static async revokePermission(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { roleId, assetId, operationId } = req.body;
      const actor = req.user?.userId || "system";

      if (typeof roleId !== "number" || typeof assetId !== "number" || typeof operationId !== "number") {
        return res.status(400).json({ error: "roleId, assetId and operationId must be numbers" });
      }

      const revoked = await service.revokePermissionFromRoleByAssetOperation(roleId, assetId, operationId, actor);
      return res.status(200).json(RolePermissionView(revoked));
    } catch (error) {
      next(error);
    }
  }

  // ดึงสิทธิ์ทั้งหมดของ role
  static async getPermissionsByRole(req: Request, res: Response, next: NextFunction) {
    try {
      const roleId = Number(req.params.roleId);
      if (isNaN(roleId)) {
        return res.status(400).json({ error: "Invalid roleId" });
      }

      const permissions = await service.getPermissionsForRole(roleId);

      return res.status(200).json(RolePermissionListView(permissions));
    } catch (error) {
      next(error);
    }
  }
}
