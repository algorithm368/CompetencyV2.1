import { Request, Response, NextFunction } from "express";
import { UserAssetInstanceService } from "@/modules/admin/services/rbac/userAssetInstanceService";
import type { UserAssetInstance } from "@prisma/client_competency";

const service = new UserAssetInstanceService();

interface AuthenticatedRequest extends Request {
  user?: { userId?: string };
}

interface UserAssetInstanceWithRelations extends UserAssetInstance {
  assetInstance?: {
    id: number;
    assetId: number;
    recordId: string;
    asset?: {
      id: number;
      tableName: string;
      description?: string | null;
    };
  };
}

function UserAssetInstanceView(uai: UserAssetInstanceWithRelations) {
  return {
    id: uai.id,
    userId: uai.userId,
    assetInstanceId: uai.assetInstanceId,
    assignedAt: uai.assignedAt.toISOString(),
    assetInstance: uai.assetInstance
      ? {
          id: uai.assetInstance.id,
          recordId: uai.assetInstance.recordId,
          assetId: uai.assetInstance.assetId,
          assetName: uai.assetInstance.asset?.tableName ?? "Unknown",
          asset: uai.assetInstance.asset
            ? {
                id: uai.assetInstance.asset.id,
                tableName: uai.assetInstance.asset.tableName,
                description: uai.assetInstance.asset.description,
              }
            : undefined,
        }
      : undefined,
  };
}

function UserAssetInstanceListView(list: UserAssetInstanceWithRelations[]) {
  return list.map(UserAssetInstanceView);
}

export class UserAssetInstanceController {
  // Assign AssetInstance to User
  static async assign(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { userId, assetInstanceIds } = req.body;
      const actor = req.user?.userId || "system";

      if (!userId || !Array.isArray(assetInstanceIds) || assetInstanceIds.length === 0) {
        return res.status(400).json({ error: "userId and assetInstanceIds are required" });
      }

      const assignedList: UserAssetInstanceWithRelations[] = [];
      for (const assetId of assetInstanceIds) {
        const assigned = await service.assignAssetToUser(userId, assetId, actor);
        assignedList.push(assigned as UserAssetInstanceWithRelations);
      }

      return res.status(201).json(UserAssetInstanceListView(assignedList));
    } catch (err) {
      console.error("[AssignAsset] Error:", err);
      next(err);
    }
  }

  // Revoke AssetInstance from User
  static async revoke(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { userId, assetInstanceId } = req.body;
      const actor = req.user?.userId || "system";

      if (!userId || !assetInstanceId) {
        return res.status(400).json({ error: "userId and assetInstanceId are required" });
      }

      const revoked = await service.revokeAssetFromUser(userId, assetInstanceId, actor);
      return res.status(200).json(UserAssetInstanceView(revoked as UserAssetInstanceWithRelations));
    } catch (err) {
      next(err);
    }
  }

  // Get all AssetInstances assigned to a user
  static async getForUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      if (!userId) return res.status(400).json({ error: "userId parameter is required" });

      const list = await service.getAssetsForUser(userId);
      return res.status(200).json(UserAssetInstanceListView(list as UserAssetInstanceWithRelations[]));
    } catch (err) {
      next(err);
    }
  }

  // Paginated search
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const search = typeof req.query.search === "string" ? req.query.search : undefined;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const perPage = req.query.perPage ? parseInt(req.query.perPage as string, 10) : undefined;

      const result = await service.getAll(search, page, perPage);
      return res.json({
        total: result.total,
        data: UserAssetInstanceListView(result.data as UserAssetInstanceWithRelations[]),
      });
    } catch (err) {
      next(err);
    }
  }
}
