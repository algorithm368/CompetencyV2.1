import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { RoleService } from "@Competency/services/rbac/roleService";

const service = new RoleService();

interface AuthenticatedRequest extends Request {
  user?: { userId?: string };
}

export const extractMessage = (err: unknown): string => (err instanceof Error ? err.message : "An unknown error occurred");

export class RoleController {
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
      const id = Number(req.params.roleId);
      if (isNaN(id)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid role ID" });
        return;
      }

      const role = await service.getRoleById(id);
      if (!role) {
        res.status(StatusCodes.NOT_FOUND).json({ message: `Role with id ${id} not found` });
        return;
      }

      res.status(StatusCodes.OK).json(role);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const actor = req.user?.userId ?? "system";
      const { roleName, description } = req.body;

      if (!roleName?.trim()) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Role name is required" });
        return;
      }

      const newRole = await service.createRole({ name: roleName.trim(), description }, actor);

      res.status(StatusCodes.CREATED).json(newRole);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const actor = req.user?.userId ?? "system";
      const id = Number(req.params.roleId);

      if (isNaN(id)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid role ID" });
        return;
      }

      const { roleName, description } = req.body;

      const updated = await service.updateRole(id, { name: roleName, description }, actor);

      res.status(StatusCodes.OK).json(updated);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const actor = req.user?.userId ?? "system";
      const id = Number(req.params.roleId);

      if (isNaN(id)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid role ID" });
        return;
      }

      await service.deleteRole(id, actor);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (err) {
      next(err);
    }
  }
}
