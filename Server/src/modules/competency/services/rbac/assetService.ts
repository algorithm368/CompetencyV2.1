import { AssetRepository } from "@Competency/repositories/RoleRepository";
import type { Asset } from "@prisma/client_competency";
import { BaseService } from "@Utils/BaseService";

export class AssetService extends BaseService<Asset, keyof Asset> {
  constructor() {
    super(new AssetRepository(), ["id"], "id");
  }

  async createAsset(tableName: string, description?: string, actor: string = "system") {
    const existing = await this.repo.findFirst({ where: { tableName } });
    if (existing) throw new Error("Asset already exists");
    return this.repo.create({ tableName, description }, actor);
  }

  async getAssetByName(tableName: string) {
    return this.repo.findFirst({ where: { tableName } });
  }
}
