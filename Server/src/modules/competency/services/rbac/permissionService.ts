import { PermissionRepository } from "@Competency/repositories/RoleRepository";

export class PermissionService {
  private permissionModel = new PermissionRepository();

  async createPermission(data: { permission_key: string; description?: string }, actor: string = "system") {
    const existingPermission = await this.permissionModel.findMany({
      where: { permission_key: data.permission_key },
    });
    if (existingPermission.length > 0) {
      throw new Error("Permission already exists");
    }
    return this.permissionModel.create(
      {
        key: data.permission_key,
        description: data.description ?? null,
        created_at: new Date(),
      },
      actor
    );
  }

  async getPermissions() {
    return this.permissionModel.findMany({});
  }

  async getPermissionById(permissionId: number) {
    return this.permissionModel.findUnique(permissionId);
  }

  async updatePermission(permissionId: number, data: Partial<{ permission_key: string; description: string }>, actor: string = "system") {
    if (data.permission_key) {
      const existingPermission = await this.permissionModel.findMany({
        where: {
          permission_key: data.permission_key,
          AND: [{ permission_id: { not: permissionId } }],
        },
      });
      if (existingPermission.length > 0) {
        throw new Error("Permission key already exists");
      }
    }

    const updateData = {
      ...(data.permission_key !== undefined ? { key: data.permission_key } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
    };

    return this.permissionModel.update(permissionId, updateData, actor);
  }

  async deletePermission(permissionId: number, actor: string = "system") {
    return this.permissionModel.delete(permissionId, actor);
  }
}
