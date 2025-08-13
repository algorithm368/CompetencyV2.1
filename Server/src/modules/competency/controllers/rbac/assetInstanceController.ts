import { Request, Response, NextFunction } from "express";
import { AssetInstanceService } from "@Competency/services/rbac/assetInstanceService";
import type { AssetInstance } from "@prisma/client_competency";

const service = new AssetInstanceService();
interface AuthenticatedRequest extends Request {
  user?: { userId?: string };
}

function AssetInstanceView(instance: AssetInstance) {
  return {
    id: instance.id,
    assetId: instance.assetId,
    recordId: instance.recordId,
  };
}

function AssetInstanceListView(instances: AssetInstance[]) {
  return instances.map(AssetInstanceView);
}

export class AssetInstanceController {
  static async createInstance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { assetId, recordId } = req.body;
      const actor = req.user?.userId || "system";

      if (!assetId || !recordId) {
        return res.status(400).json({ error: "assetId and recordId are required" });
      }

      const instance = await service.createInstance(assetId, recordId, actor);
      return res.status(201).json(AssetInstanceView(instance));
    } catch (error) {
      next(error);
    }
  }

  static async deleteInstanceById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid id" });
      }
      const actor = req.user?.userId || "system";
      const deleted = await service.deleteInstanceById(id, actor);
      return res.status(200).json(AssetInstanceView(deleted));
    } catch (error) {
      next(error);
    }
  }

  static async deleteInstance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { assetId, recordId } = req.body;
      if (!assetId || !recordId) {
        return res.status(400).json({ error: "assetId and recordId are required" });
      }
      const actor = req.user?.userId || "system";
      const deleted = await service.deleteInstance(assetId, recordId, actor);
      return res.status(200).json(AssetInstanceView(deleted));
    } catch (error) {
      next(error);
    }
  }

  static async getInstancesByAsset(req: Request, res: Response, next: NextFunction) {
    try {
      const assetId = Number(req.params.assetId);
      if (isNaN(assetId)) {
        return res.status(400).json({ error: "Invalid assetId" });
      }
      const instances = await service.getInstancesByAsset(assetId);
      return res.status(200).json(AssetInstanceListView(instances));
    } catch (error) {
      next(error);
    }
  }

  static async getInstanceById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid id" });
      }
      const instance = await service.getInstanceById(id);
      if (!instance) {
        return res.status(404).json({ error: "AssetInstance not found" });
      }
      return res.status(200).json(AssetInstanceView(instance));
    } catch (error) {
      next(error);
    }
  }

  static async updateInstanceRecord(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { newRecordId } = req.body;
      if (isNaN(id) || !newRecordId) {
        return res.status(400).json({ error: "Invalid id or missing newRecordId" });
      }
      const actor = req.user?.userId || "system";
      const updated = await service.updateInstanceRecord(id, newRecordId, actor);
      return res.status(200).json(AssetInstanceView(updated));
    } catch (error) {
      next(error);
    }
  }
}
