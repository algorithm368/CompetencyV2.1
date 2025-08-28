import { UserAssetInstanceRepository } from "@/modules/admin/repositories/RoleRepository";
import type { UserAssetInstance } from "@prisma/client_competency";
import { BaseService } from "@Utils/BaseService";

export class UserAssetInstanceService extends BaseService<UserAssetInstance, keyof UserAssetInstance> {
  constructor() {
    super(new UserAssetInstanceRepository(), ["userId", "assetInstanceId"], "id");
  }

  // Assign AssetInstance to a user
  async assignAssetToUser(userId: string, assetInstanceId: number, actor: string = "system") {
    const existing = await this.repo.findFirst({
      where: { userId, assetInstanceId },
    });
    if (existing) {
      throw new Error("AssetInstance already assigned to user");
    }
    return this.repo.create({ userId, assetInstanceId, assignedAt: new Date() }, actor);
  }

  // Revoke AssetInstance from a user
  async revokeAssetFromUser(userId: string, assetInstanceId: number, actor: string = "system") {
    const existing = await this.repo.findFirst({
      where: { userId, assetInstanceId },
    });
    if (!existing) {
      throw new Error("AssetInstance not assigned to user");
    }
    return this.repo.delete(existing.id, actor);
  }

  // Get all AssetInstances assigned to a user
  async getAssetsForUser(userId: string) {
    return this.repo.findMany({
      where: { userId },
      include: {
        assetInstance: {
          include: {
            asset: true,
          },
        },
      },
    });
  }

  // Paginated search
  async getAll(search?: string, page?: number, perPage?: number) {
    const where: any = {};
    if (search) {
      const userMatch = search.match(/user:(\w+)/);
      if (userMatch) where.userId = userMatch[1];

      const assetMatch = search.match(/asset:(\d+)/);
      if (assetMatch) where.assetInstanceId = parseInt(assetMatch[1], 10);

      // OR search across fields
      where.OR = this.searchFields.map((fieldPath) => {
        const parts = fieldPath.split(".");
        let nested: any = { contains: search.trim() };
        for (let i = parts.length - 1; i >= 1; i--) {
          nested = { [parts[i]]: nested };
        }
        return { [parts[0]]: nested };
      });
    }

    const commonQuery: any = {
      where,
      include: {
        assetInstance: {
          include: {
            asset: true,
          },
        },
        user: {
          select: { email: true },
        },
      },
    };

    if (page !== undefined && perPage !== undefined) {
      const data = await this.repo.findMany({
        ...commonQuery,
        skip: (page - 1) * perPage,
        take: perPage,
      });
      const total = await this.repo.manager.count({ where });
      return { data, total };
    }

    const data = await this.repo.findMany(commonQuery);
    return { data, total: data.length };
  }
}
