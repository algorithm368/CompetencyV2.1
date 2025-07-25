import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { UserRoleService } from "@Competency/services/rbac/userRoleService";

const service = new UserRoleService();

interface AuthenticatedRequest extends Request {
  user?: { userId?: string };
}

export class UserRoleController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
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
  static async assignRole(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const actor = req.user?.userId ?? "system";
      const userId = req.params.userId;
      const roleId = Number(req.body.roleId);

      if (!userId || isNaN(roleId)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid userId or roleId" });
        return;
      }

      const result = await service.assignRoleToUser(userId, roleId, actor);
      res.status(StatusCodes.CREATED).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async revokeRole(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const actor = req.user?.userId ?? "system";
      const userId = req.params.userId;
      const roleId = Number(req.body.roleId);

      if (!userId || isNaN(roleId)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid userId or roleId" });
        return;
      }

      await service.revokeRoleFromUser(userId, roleId, actor);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (err) {
      next(err);
    }
  }

  static async getRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      if (!userId) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid userId" });
        return;
      }
      const roles = await service.getRolesForUser(userId);
      res.json(roles);
    } catch (err) {
      next(err);
    }
  }
}
