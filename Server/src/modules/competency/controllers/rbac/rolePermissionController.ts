import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { RolePermissionService } from "@Competency/services/rbac/rolePermissionService";

const service = new RolePermissionService();

interface AuthenticatedRequest extends Request {
  user?: { userId?: string };
}

export const extractMessage = (err: unknown): string => (err instanceof Error ? err.message : "An unknown error occurred");

export class RolePermissionController {
  static async assign(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const actor = req.user?.userId ?? "system";
      const { roleId, permissionId } = req.body;

      if (!roleId || !permissionId) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Missing roleId or permissionId" });
        return;
      }

      const assigned = await service.assignPermissionToRole(roleId, permissionId, actor);
      res.status(StatusCodes.CREATED).json(assigned);
    } catch (err) {
      next(err);
    }
  }

  static async revoke(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const actor = req.user?.userId ?? "system";
      const { roleId, permissionId } = req.body;

      if (!roleId || !permissionId) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Missing roleId or permissionId" });
        return;
      }

      await service.revokePermissionFromRole(roleId, permissionId, actor);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (err) {
      next(err);
    }
  }

  static async getByRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const roleId = Number(req.params.roleId);
      if (isNaN(roleId)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid role ID" });
        return;
      }

      const permissions = await service.getPermissionsForRole(roleId);
      res.status(StatusCodes.OK).json(permissions);
    } catch (err) {
      next(err);
    }
  }
}
