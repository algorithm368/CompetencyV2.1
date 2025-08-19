import { Request, Response, NextFunction } from "express";
import { AssetService } from "@/modules/admin/services/rbac/assetService";
import type { Asset } from "@prisma/client_competency";
import { assetEditableFields } from "@Configs/assetFields";
const service = new AssetService();

type AllowedField = (typeof assetEditableFields)[number];
interface AuthenticatedRequest extends Request {
  user?: { userId?: string };
}

// แปลงข้อมูล Asset ก่อนส่ง response
function AssetView(asset: Asset) {
  return {
    id: asset.id,
    tableName: asset.tableName,
    description: asset.description,
    updatedAt: asset.updatedAt,
  };
}

function AssetListView(assets: Asset[]) {
  return assets.map(AssetView);
}

export class AssetController {
  // สร้าง Asset ใหม่
  static async createAsset(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { tableName, description } = req.body;
      const actor = req.user?.userId || "system";

      if (!tableName) {
        return res.status(400).json({ error: "tableName is required" });
      }

      const asset = await service.createAsset(tableName, description, actor);
      return res.status(201).json(AssetView(asset));
    } catch (error) {
      next(error);
    }
  }

  // ดึง Asset ตามชื่อ tableName
  static async getAssetByName(req: Request, res: Response, next: NextFunction) {
    try {
      const tableName = req.params.tableName;
      if (!tableName) {
        return res.status(400).json({ error: "tableName parameter is required" });
      }

      const asset = await service.getAssetByName(tableName);
      if (!asset) {
        return res.status(404).json({ error: "Asset not found" });
      }
      return res.status(200).json(AssetView(asset));
    } catch (error) {
      next(error);
    }
  }

  // อัปเดต Asset ตาม id
  static async updateAsset(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const updates = req.body;
      const actor = req.user?.userId || "system";

      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid id" });
      }

      const filteredUpdates: Partial<Omit<Asset, "id" | "updatedAt">> = {};
      for (const key of assetEditableFields) {
        if (key in updates) {
          filteredUpdates[key] = updates[key as AllowedField];
        }
      }
      const updatedAsset = await service.updateAsset(id, filteredUpdates, actor);
      return res.status(200).json(AssetView(updatedAsset));
    } catch (error) {
      next(error);
    }
  }

  // ลบ Asset ตาม id
  static async deleteAsset(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const actor = req.user?.userId || "system";

      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid id" });
      }

      const deleted = await service.deleteAsset(id, actor);
      return res.status(200).json(AssetView(deleted));
    } catch (error) {
      next(error);
    }
  }
}
