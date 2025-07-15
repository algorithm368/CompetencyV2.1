import { PermissionRepository } from "@Competency/repositories/RoleRepository";
import type { Permission } from "@prisma/client_competency";
import { BaseService } from "@Utils/BaseService";

export class PermissionService extends BaseService<Permission, keyof Permission> {
  constructor() {
    super(new PermissionRepository(), ["description"], "id");
  }

  async createPermission(data: { key: string; description?: string }, actor: string = "system") {
    const existingPermission = await this.repo.findMany({
      where: { key: data.key },
    });
    if (existingPermission.length > 0) {
      throw new Error("Permission already exists");
    }
    return this.repo.create(
      {
        key: data.key,
        description: data.description ?? null,
        createdAt: new Date(),
      },
      actor
    );
  }

  async getPermissions() {
    return this.repo.findMany({});
  }

  async getPermissionById(permissionId: number) {
    return this.repo.findUnique(permissionId);
  }

  async updatePermission(permissionId: number, data: Partial<{ key: string; description: string }>, actor: string = "system") {
    if (data.key) {
      const existingPermission = await this.repo.findMany({
        where: {
          key: data.key,
          AND: [{ id: { not: permissionId } }],
        },
      });
      if (existingPermission.length > 0) {
        throw new Error("Permission key already exists");
      }
    }

    const updateData = {
      ...(data.key !== undefined ? { key: data.key } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
    };

    return this.repo.update(permissionId, updateData, actor);
  }

  async deletePermission(permissionId: number, actor: string = "system") {
    return this.repo.delete(permissionId, actor);
  }
}
