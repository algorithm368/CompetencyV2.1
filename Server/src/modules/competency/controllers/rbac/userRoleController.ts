import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserRoleService } from "@Competency/services/rbac/userRoleService";

const userRoleService = new UserRoleService();
interface AuthenticatedRequest extends Request {
  user?: { userId?: string };
}
export const extractMessage = (err: unknown) => (err instanceof Error ? err.message : "An unknown error occurred");
export const assignRoleToUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, roleId } = req.body;
    const assigned = await userRoleService.assignRoleToUser(userId, roleId, req.user?.userId?.toString());
    res.status(StatusCodes.CREATED).json(assigned);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: extractMessage(err) });
  }
};

export const revokeRoleFromUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, roleId } = req.body;
    await userRoleService.revokeRoleFromUser(userId, roleId, req.user?.userId?.toString());
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: extractMessage(err) });
  }
};

export const getRolesForUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const roles = await userRoleService.getRolesForUser(userId);
    res.status(StatusCodes.OK).json(roles);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: extractMessage(err) });
  }
};
