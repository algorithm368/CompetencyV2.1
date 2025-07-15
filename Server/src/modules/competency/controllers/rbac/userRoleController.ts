import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { UserRoleService } from "@Competency/services/rbac/userRoleService";

const service = new UserRoleService();

interface AuthenticatedRequest extends Request {
  user?: { userId?: string };
}

export const extractMessage = (err: unknown) => (err instanceof Error ? err.message : "An unknown error occurred");

export class UserRoleController {
  static async assign(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const actor = req.user?.userId ?? "system";
      const { userId, roleId } = req.body;

      if (!userId || !roleId) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Missing userId or roleId" });
        return;
      }

      const assigned = await service.assignRoleToUser(userId, roleId, actor);
      res.status(StatusCodes.CREATED).json(assigned);
    } catch (err) {
      next(err);
    }
  }

  static async revoke(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const actor = req.user?.userId ?? "system";
      const { userId, roleId } = req.body;

      if (!userId || !roleId) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Missing userId or roleId" });
        return;
      }

      await service.revokeRoleFromUser(userId, roleId, actor);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (err) {
      next(err);
    }
  }

  static async getByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.userId;
      if (!userId) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Missing userId parameter" });
        return;
      }

      const roles = await service.getRolesForUser(userId);

      res.status(StatusCodes.OK).json(roles);
    } catch (err) {
      next(err);
    }
  }

  static async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await service.getAllUsers();
      res.status(StatusCodes.OK).json({ data: users, total: users.length });
    } catch (err) {
      next(err);
    }
  }

  static async getAllRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const roles = await service.getAllRoles();
      res.status(StatusCodes.OK).json({ data: roles, total: roles.length });
    } catch (err) {
      next(err);
    }
  }
}
