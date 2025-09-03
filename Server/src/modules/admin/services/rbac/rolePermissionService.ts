import { RolePermissionsRepository } from "@/modules/admin/repositories/RoleRepository";
import { PermissionRepository } from "@/modules/admin/repositories/RoleRepository";
import type { RolePermission } from "@prisma/client_competency";
import { BaseService } from "@Utils/BaseService";

export class RolePermissionService extends BaseService<RolePermission, keyof RolePermission> {
  private permissionRepo = new PermissionRepository();

  constructor() {
    super(new RolePermissionsRepository(), ["roleId", "permissionId"], "id");
  }

  // Assign permission by assetId + operationId
  async assignPermissionToRole(roleId: number, assetId: number, operationId: number, actor: string = "system") {
    const permission = await this.permissionRepo.findFirst({ where: { assetId, operationId } });
    if (!permission) throw new Error("Permission not found");

    const existing = await this.repo.findFirst({ where: { roleId, permissionId: permission.id } });
    if (existing) throw new Error("Permission already assigned to role");

    return this.repo.create({ roleId, permissionId: permission.id, grantedAt: new Date() }, actor);
  }

  // Revoke permission by assetId + operationId
  async revokePermissionFromRoleByAssetOperation(roleId: number, assetId: number, operationId: number, actor: string = "system") {
    const permission = await this.permissionRepo.findFirst({ where: { assetId, operationId } });
    if (!permission) throw new Error("Permission not found");

    const existing = await this.repo.findFirst({ where: { roleId, permissionId: permission.id } });
    if (!existing) throw new Error("No permission assignment found for role");

    return this.repo.delete(existing.id, actor);
  }

  async getPermissionsForRole(roleId: number) {
    return this.repo.findMany({
      where: { roleId },
      include: {
        permission: {
          include: {
            operation: true,
            asset: true,
          },
        },
      },
    });
  }
}
