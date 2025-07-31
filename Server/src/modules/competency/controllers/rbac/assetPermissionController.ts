import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AssetPermissionService } from "@Competency/services/rbac/assetPermissionService";

const service = new AssetPermissionService();

interface AuthenticatedRequest extends Request {
  user?: { userId?: string };
}

export class AssetPermissionController {
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

  static async assignPermission(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const actor = req.user?.userId ?? "system";
      const assetId = Number(req.params.assetId);
      const permissionId = Number(req.body.permissionId);

      if (isNaN(assetId) || isNaN(permissionId)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid assetId or permissionId" });
        return;
      }

      const result = await service.assignPermissionToAsset(permissionId, assetId, actor);
      res.status(StatusCodes.CREATED).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async revokePermission(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const actor = req.user?.userId ?? "system";
      const assetId = Number(req.params.assetId);
      const permissionId = Number(req.body.permissionId);

      if (isNaN(assetId) || isNaN(permissionId)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid assetId or permissionId" });
        return;
      }

      await service.revokePermissionFromAsset(permissionId, assetId, actor);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (err) {
      next(err);
    }
  }

  static async getPermissions(req: Request, res: Response, next: NextFunction) {
    try {
      const assetId = Number(req.params.assetId);
      if (isNaN(assetId)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid asset ID" });
        return;
      }
      const permissions = await service.getPermissionsForAsset(assetId);
      res.json(permissions);
    } catch (err) {
      next(err);
    }
  }

  static async getRolePermissionsForAsset(req: Request, res: Response, next: NextFunction) {
    try {
      const assetId = Number(req.params.assetId);
      if (isNaN(assetId)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid asset ID" });
        return;
      }
      const rolePermissions = await service.getRolePermissionsForAsset(assetId);
      res.json(rolePermissions);
    } catch (err) {
      next(err);
    }
  }
}
