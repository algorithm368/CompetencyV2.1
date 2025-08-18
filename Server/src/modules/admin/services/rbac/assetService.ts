import { AssetRepository } from "@Competency/repositories/RoleRepository";
import type { Asset } from "@prisma/client_competency";
import { BaseService } from "@Utils/BaseService";

export class AssetService extends BaseService<Asset, "id"> {
  constructor() {
    super(new AssetRepository(), ["tableName", "description"], "id");
  }

  // สร้าง Asset ใหม่ (ชื่อ table ต้องไม่ซ้ำ)
  async createAsset(tableName: string, description?: string, actor: string = "system"): Promise<Asset> {
    const existing = await this.repo.findFirst({ where: { tableName } });
    if (existing) throw new Error("Asset already exists");
    return this.repo.create({ tableName, description }, actor);
  }

  // ดึง Asset ตามชื่อ tableName
  async getAssetByName(tableName: string): Promise<Asset | null> {
    return this.repo.findFirst({ where: { tableName } });
  }

  // อัปเดต Asset ตาม id
  async updateAsset(id: number, updates: Partial<Omit<Asset, "id">>, actor: string = "system"): Promise<Asset> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new Error("Asset not found");
    // หากมีการอัปเดตชื่อ tableName ตรวจสอบซ้ำ
    if (updates.tableName && updates.tableName !== existing.tableName) {
      const duplicate = await this.repo.findFirst({ where: { tableName: updates.tableName } });
      if (duplicate) throw new Error("Another Asset with this tableName already exists");
    }
    return this.repo.update(id, updates, actor);
  }

  // ลบ Asset ตาม id
  async deleteAsset(id: number, actor: string = "system"): Promise<Asset> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new Error("Asset not found");
    return this.repo.delete(id, actor);
  }
}
