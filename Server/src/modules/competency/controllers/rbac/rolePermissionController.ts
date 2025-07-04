import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { RolePermissionService } from "@Competency/services/rbac/rolePermissionService";

const rolePermissionService = new RolePermissionService();
interface AuthenticatedRequest extends Request {
  user?: { userId?: string };
}
export const extractMessage = (err: unknown) => (err instanceof Error ? err.message : "An unknown error occurred");

export const assignPermissionToRole = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { roleId, permissionId } = req.body;
    const assigned = await rolePermissionService.assignPermissionToRole(roleId, permissionId, req.user?.userId?.toString());
    res.status(StatusCodes.CREATED).json(assigned);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: extractMessage(err) });
  }
};

export const revokePermissionFromRole = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { roleId, permissionId } = req.body;
    await rolePermissionService.revokePermissionFromRole(roleId, permissionId, req.user?.userId?.toString());
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: extractMessage(err) });
  }
};

export const getPermissionsForRole = async (req: Request, res: Response) => {
  try {
    const roleId = parseInt(req.params.roleId);
    const permissions = await rolePermissionService.getPermissionsForRole(roleId);
    res.status(StatusCodes.OK).json(permissions);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: extractMessage(err) });
  }
};
