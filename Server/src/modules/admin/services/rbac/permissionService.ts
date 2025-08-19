import { PermissionRepository } from "@Competency/repositories/RoleRepository";
import type { Permission } from "@prisma/client_competency";
import { BaseService } from "@Utils/BaseService";

export class PermissionService extends BaseService<Permission, keyof Permission> {
  constructor() {
    super(new PermissionRepository(), ["id"], "id");
  }

  // สร้าง Permission ใหม่ โดยต้องระบุ operationId และ assetId
  async createPermission(operationId: number, assetId: number, actor: string = "system") {
    const existing = await this.repo.findFirst({ where: { operationId, assetId } });
    if (existing) {
      console.error(`[PermissionService] Error: Permission for operationId=${operationId} and assetId=${assetId} already exists.`);
      throw new Error("Permission already exists for this operation and asset");
    }

    const dataToCreate = { operationId, assetId, createdAt: new Date() };
    const newPermission = await this.repo.create(dataToCreate, actor);
    return newPermission;
  }

  // ดึง Permission ตาม operationId และ assetId
  async getPermission(operationId: number, assetId: number) {
    return this.repo.findFirst({ where: { operationId, assetId } });
  }
}
