import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AssetService } from "@Competency/services/rbac/assetService";

const service = new AssetService();

interface AuthenticatedRequest extends Request {
  user?: { userId?: string };
}

export class AssetController {
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

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.assetId);
      if (isNaN(id)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid asset ID" });
        return;
      }
      const asset = await service.getById(id);
      if (!asset) {
        res.status(StatusCodes.NOT_FOUND).json({ message: `Asset with id ${id} not found` });
        return;
      }
      res.json(asset);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const actor = req.user?.userId ?? "system";
      const { tableName, description } = req.body;
      if (!tableName?.trim()) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "tableName is required" });
        return;
      }
      const newAsset = await service.createAsset(tableName.trim(), description, actor);
      res.status(StatusCodes.CREATED).json(newAsset);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const actor = req.user?.userId ?? "system";
      const id = Number(req.params.assetId);
      if (isNaN(id)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid asset ID" });
        return;
      }
      const { tableName, description } = req.body;
      const updated = await service.update(id, { tableName, description }, actor);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const actor = req.user?.userId ?? "system";
      const id = Number(req.params.assetId);
      if (isNaN(id)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid asset ID" });
        return;
      }
      await service.delete(id, actor);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (err) {
      next(err);
    }
  }
}
