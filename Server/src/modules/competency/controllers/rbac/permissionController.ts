import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { PermissionService } from "@Competency/services/rbac/permissionService";

const service = new PermissionService();

interface AuthenticatedRequest extends Request {
  user?: { userId?: string };
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
      res.json(permission);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const reqAuth = req as AuthenticatedRequest;
    try {
      const actor = reqAuth.user?.userId ?? "system";
      const { key: permissionKey, description } = req.body;
      if (!permissionKey?.trim()) {
        console.warn(`[PermissionController][create] Validation failed: Permission key is missing or empty.`);
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Permission key is required" });
        return;
      }
      const newPermission = await service.createPermission(permissionKey.trim(), description, actor);
      res.status(StatusCodes.CREATED).json(newPermission);
    } catch (err) {
      console.error(`[PermissionController][create] Error during permission creation:`, err);
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
      const { permissionKey, description } = req.body;
      const updated = await service.update(id, { key: permissionKey, description }, actor);
      res.json(updated);
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
