import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { RoleService } from "@/modules/admin/services/rbac/roleService";

const service = new RoleService();

interface AuthenticatedRequest extends Request {
  user?: { userId?: string };
}

function RoleView(role: any) {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    parentRoleId: role.parentRoleId,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  };
}

function RoleListView(roles: any[]) {
  return roles.map(RoleView);
}

export class RoleController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const search = typeof req.query.search === "string" ? req.query.search : undefined;
      const pageRaw = req.query.page;
      const perPageRaw = req.query.perPage;
      const page = pageRaw && !isNaN(+pageRaw) ? parseInt(pageRaw as string, 10) : undefined;
      const perPage = perPageRaw && !isNaN(+perPageRaw) ? parseInt(perPageRaw as string, 10) : undefined;

      const result = await service.getAll(search, page, perPage);
      res.json({
        total: result.total,
        data: RoleListView(result.data),
      });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.roleId);
      if (isNaN(id)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid role ID" });
        return;
      }
      const role = await service.getById(id);
      if (!role) {
        res.status(StatusCodes.NOT_FOUND).json({ message: `Role with id ${id} not found` });
        return;
      }
      res.json(RoleView(role));
    } catch (err) {
      next(err);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const actor = req.user?.userId ?? "system";
      const { name, description } = req.body;
      if (!name?.trim()) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Role name is required" });
        return;
      }
      const newRole = await service.createRole(name.trim(), description, actor);
      res.status(StatusCodes.CREATED).json(RoleView(newRole));
    } catch (err) {
      next(err);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const actor = req.user?.userId ?? "system";
      const id = Number(req.params.roleId);
      if (isNaN(id)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid role ID" });
        return;
      }
      const { name, description } = req.body;
      const updated = await service.update(id, { name, description }, actor);
      res.json(RoleView(updated));
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const actor = req.user?.userId ?? "system";
      const id = Number(req.params.roleId);
      if (isNaN(id)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid role ID" });
        return;
      }
      await service.delete(id, actor);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (err) {
      next(err);
    }
  }
}
