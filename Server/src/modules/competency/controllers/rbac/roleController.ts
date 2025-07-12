import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { RoleService } from "@Competency/services/rbac/roleService";

const roleService = new RoleService();
interface AuthenticatedRequest extends Request {
  user?: { userId?: string };
}
export const extractMessage = (err: unknown) => (err instanceof Error ? err.message : "An unknown error occurred");

export const createRole = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { roleName, description } = req.body;
    const role = await roleService.createRole({ role_name: roleName, description }, req.user?.userId?.toString());
    res.status(StatusCodes.CREATED).json(role);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: extractMessage(err) });
  }
};

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await roleService.getRoles();
    res.status(StatusCodes.OK).json(roles);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: extractMessage(err) });
  }
};

export const getRoleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const roleId = parseInt(req.params.roleId, 10);
    const role = await roleService.getRoleById(roleId);
    if (!role) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Role not found" });
      return;
    }
    res.status(StatusCodes.OK).json(role);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: extractMessage(err) });
  }
};

export const updateRole = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const roleId = parseInt(req.params.roleId);
    const { roleName, description } = req.body;
    const updatedRole = await roleService.updateRole(roleId, { role_name: roleName, description }, req.user?.userId?.toString());
    res.status(StatusCodes.OK).json(updatedRole);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: extractMessage(err) });
  }
};

export const deleteRole = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const roleId = parseInt(req.params.roleId);
    await roleService.deleteRole(roleId, req.user?.userId?.toString());
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: extractMessage(err) });
  }
};
