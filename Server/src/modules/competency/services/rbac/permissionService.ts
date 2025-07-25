import { PermissionRepository } from "@Competency/repositories/RoleRepository";
import type { Permission } from "@prisma/client_competency";
import { BaseService } from "@Utils/BaseService";

export class PermissionService extends BaseService<Permission, keyof Permission> {
  constructor() {
    super(new PermissionRepository(), ["id"], "id");
  }

  async createPermission(key: string, description?: string, actor: string = "system") {
    const existing = await this.repo.findFirst({ where: { key } });
    if (existing) {
      console.error(`[PermissionService] Error: Permission key "${key}" already exists.`);
      throw new Error("Permission key already exists");
    }

    const dataToCreate = { key, description, createdAt: new Date() };
    const newPermission = await this.repo.create(dataToCreate, actor);
    return newPermission;
  }

  async getPermissionByKey(key: string) {
    return this.repo.findFirst({ where: { key } });
  }
}
