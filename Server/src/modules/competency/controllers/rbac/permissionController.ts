import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { PermissionService } from "@Competency/services/rbac/permissionService";

const service = new PermissionService();

interface AuthenticatedRequest extends Request {
  user?: { userId?: string };
}

export const extractMessage = (err: unknown): string => (err instanceof Error ? err.message : "An unknown error occurred");

export class PermissionController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const search = typeof req.query.search === "string" ? req.query.search : undefined;
      const pageRaw = req.query.page;
      const perPageRaw = req.query.perPage;
      const page = pageRaw && !isNaN(+pageRaw) ? parseInt(pageRaw as string, 10) : undefined;
      const perPage = perPageRaw && !isNaN(+perPageRaw) ? parseInt(perPageRaw as string, 10) : undefined;

      const items = await service.getAll(search, page, perPage);
      res.json(items);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.permissionId);
      if (isNaN(id)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid permission ID" });
        return;
      }

      const permission = await service.getPermissionById(id);
      if (!permission) {
        res.status(StatusCodes.NOT_FOUND).json({ message: `Permission with id ${id} not found` });
        return;
      }

      res.status(StatusCodes.OK).json(permission);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const actor = req.user?.userId ?? "system";
      const { permissionKey, description } = req.body;

      if (!permissionKey?.trim()) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Permission key is required" });
        return;
      }

      const newPermission = await service.createPermission({ key: permissionKey.trim(), description }, actor);

      res.status(StatusCodes.CREATED).json(newPermission);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const actor = req.user?.userId ?? "system";
      const id = Number(req.params.permissionId);

      if (isNaN(id)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid permission ID" });
        return;
      }

      const { permissionKey, description } = req.body;

      const updated = await service.updatePermission(id, { key: permissionKey, description }, actor);

      res.status(StatusCodes.OK).json(updated);
    } catch (err: any) {
      next(err);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const actor = req.user?.userId ?? "system";
      const id = Number(req.params.permissionId);

      if (isNaN(id)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid permission ID" });
        return;
      }

      await service.deletePermission(id, actor);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (err: any) {
      next(err);
    }
  }
}
