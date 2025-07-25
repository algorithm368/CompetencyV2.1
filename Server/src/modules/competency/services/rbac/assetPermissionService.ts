import { AssetPermissionRepository } from "@Competency/repositories/RoleRepository";
import type { AssetPermission } from "@prisma/client_competency";
import { BaseService } from "@Utils/BaseService";

export class AssetPermissionService extends BaseService<AssetPermission, keyof AssetPermission> {
  constructor() {
    super(new AssetPermissionRepository(), ["permissionId", "assetId"], "id");
  }

  async assignPermissionToAsset(permissionId: number, assetId: number, actor: string = "system") {
    const existing = await this.repo.findFirst({
      where: { permissionId, assetId },
    });
    if (existing) {
      throw new Error("Permission already assigned to asset");
    }
    return this.repo.create({ permissionId, assetId }, actor);
  }

  async revokePermissionFromAsset(permissionId: number, assetId: number, actor: string = "system") {
    const existing = await this.repo.findFirst({
      where: { permissionId, assetId },
    });
    if (!existing) {
      throw new Error("Permission assignment to asset not found");
    }
    return this.repo.delete(existing.id, actor);
  }

  async getPermissionsForAsset(assetId: number) {
    return this.repo.findMany({
      where: { assetId },
      include: { permission: true },
    });
  }
}
