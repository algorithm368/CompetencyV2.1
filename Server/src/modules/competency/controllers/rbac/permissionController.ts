import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { PermissionService } from "@Competency/services/rbac/permissionService";

const service = new PermissionService();

interface AuthenticatedRequest extends Request {
  user?: { userId?: string };
}

function PermissionView(permission: any) {
  return {
    id: permission.id,
    operationId: permission.operationId,
    assetId: permission.assetId,
    createdAt: permission.createdAt,
    updatedAt: permission.updatedAt,
  };
}

export class PermissionController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const search = typeof req.query.search === "string" ? req.query.search : undefined;
      const page = Number(req.query.page);
      const perPage = Number(req.query.perPage);

      const items = await service.getAll(search, Number.isNaN(page) ? undefined : page, Number.isNaN(perPage) ? undefined : perPage);
      res.json(items);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.permissionId);
      if (Number.isNaN(id)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid permission ID" });
        return;
      }
      const permission = await service.getById(id);
      if (!permission) {
        res.status(StatusCodes.NOT_FOUND).json({ message: `Permission with id ${id} not found` });
        return;
      }
      res.json(PermissionView(permission));
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const reqAuth = req as AuthenticatedRequest;
    try {
      const actor = reqAuth.user?.userId ?? "system";
      const { operationId, assetId } = req.body;

      if (typeof operationId !== "number" || typeof assetId !== "number") {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "operationId and assetId must be numbers" });
        return;
      }

      const newPermission = await service.createPermission(operationId, assetId, actor);
      res.status(StatusCodes.CREATED).json(PermissionView(newPermission));
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const reqAuth = req as AuthenticatedRequest;
    try {
      const actor = reqAuth.user?.userId ?? "system";
      const id = Number(req.params.permissionId);
      if (Number.isNaN(id)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid permission ID" });
        return;
      }
      const { operationId, assetId } = req.body;

      // อัปเดตต้องรองรับ field ที่ service อนุญาต
      const updates: Partial<{ operationId: number; assetId: number }> = {};
      if (typeof operationId === "number") updates.operationId = operationId;
      if (typeof assetId === "number") updates.assetId = assetId;

      const updated = await service.update(id, updates, actor);
      res.json(PermissionView(updated));
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    const reqAuth = req as AuthenticatedRequest;
    try {
      const actor = reqAuth.user?.userId ?? "system";
      const id = Number(req.params.permissionId);
      if (Number.isNaN(id)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid permission ID" });
        return;
      }
      await service.delete(id, actor);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (err) {
      next(err);
    }
  }
}
