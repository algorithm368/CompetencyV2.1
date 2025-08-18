import { AssetInstanceRepository } from "@Competency/repositories/RoleRepository";
import type { AssetInstance } from "@prisma/client_competency";
import { BaseService } from "@Utils/BaseService";

export class AssetInstanceService extends BaseService<AssetInstance, "id"> {
  constructor() {
    super(new AssetInstanceRepository(), ["assetId", "recordId"], "id");
  }

  // สร้าง AssetInstance ใหม่ (object-level permission)
  async createInstance(assetId: number, recordId: string, actor: string = "system"): Promise<AssetInstance> {
    const existing = await this.repo.findFirst({
      where: { assetId, recordId },
    });
    if (existing) {
      throw new Error("AssetInstance for this asset and record already exists");
    }
    return this.repo.create({ assetId, recordId }, actor);
  }

  // ลบ AssetInstance ตาม id
  async deleteInstanceById(id: number, actor: string = "system"): Promise<AssetInstance> {
    return this.repo.delete(id, actor);
  }

  // ลบ AssetInstance ตาม assetId และ recordId
  async deleteInstance(assetId: number, recordId: string, actor: string = "system"): Promise<AssetInstance> {
    const existing = await this.repo.findFirst({
      where: { assetId, recordId },
    });
    if (!existing) {
      throw new Error("AssetInstance not found");
    }
    return this.repo.delete(existing.id, actor);
  }

  // ดึงรายการ AssetInstance ทั้งหมดของ asset ใด asset หนึ่ง
  async getInstancesByAsset(assetId: number): Promise<AssetInstance[]> {
    return this.repo.findMany({
      where: { assetId },
    });
  }

  // ดึง AssetInstance ตาม id
  async getInstanceById(id: number): Promise<AssetInstance | null> {
    return this.repo.findById(id);
  }

  // อัปเดต recordId ของ AssetInstance (ถ้าต้องการ)
  async updateInstanceRecord(id: number, newRecordId: string, actor: string = "system"): Promise<AssetInstance> {
    const existing = await this.repo.findFirst({
      where: { id },
    });
    if (!existing) {
      throw new Error("AssetInstance not found");
    }

    const duplicate = await this.repo.findFirst({
      where: {
        assetId: existing.assetId,
        recordId: newRecordId,
        NOT: { id },
      },
    });

    if (duplicate) {
      throw new Error("Another AssetInstance with this recordId already exists");
    }

    return this.repo.update(id, { recordId: newRecordId }, actor);
  }
}
