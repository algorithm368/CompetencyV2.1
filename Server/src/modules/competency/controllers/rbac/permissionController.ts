import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { PermissionService } from "@Competency/services/rbac/permissionService";

const permissionService = new PermissionService();
interface AuthenticatedRequest extends Request {
  user?: { userId?: string };
}
export const extractMessage = (err: unknown) => (err instanceof Error ? err.message : "An unknown error occurred");
export const createPermission = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { permissionKey, description } = req.body;
    const permission = await permissionService.createPermission({ permission_key: permissionKey, description }, req.user?.userId?.toString());
    res.status(StatusCodes.CREATED).json(permission);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: extractMessage(err) });
  }
};

export const getPermissions = async (req: Request, res: Response) => {
  try {
    const permissions = await permissionService.getPermissions();
    res.status(StatusCodes.OK).json(permissions);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: extractMessage(err) });
  }
};

export const getPermissionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const permissionId = parseInt(req.params.permissionId, 10);
    const permission = await permissionService.getPermissionById(permissionId);
    if (!permission) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Permission not found" });
      return;
    }
    res.status(StatusCodes.OK).json(permission);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: extractMessage(err) });
  }
};

export const updatePermission = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const permissionId = parseInt(req.params.permissionId);
    const { permissionKey, description } = req.body;
    const updatedPermission = await permissionService.updatePermission(permissionId, { permission_key: permissionKey, description }, req.user?.userId?.toString());
    res.status(StatusCodes.OK).json(updatedPermission);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: extractMessage(err) });
  }
};

export const deletePermission = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const permissionId = parseInt(req.params.permissionId);
    await permissionService.deletePermission(permissionId, req.user?.userId?.toString());
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: extractMessage(err) });
  }
};
