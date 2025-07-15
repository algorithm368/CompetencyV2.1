import { RoleRepository } from "@Competency/repositories/RoleRepository";
import type { Role } from "@prisma/client_competency";
import { BaseService } from "@Utils/BaseService";

export class RoleService extends BaseService<Role, keyof Role> {
  constructor() {
    super(new RoleRepository(), ["name"], "id");
  }

  async createRole(data: { name: string; description?: string }, actor: string = "system") {
    const existingRole = await this.repo.findMany({
      where: { name: data.name },
    });
    if (existingRole.length > 0) {
      throw new Error("Role already exists");
    }
    return this.repo.create(
      {
        name: data.name,
        description: data.description ?? null,
        createdAt: new Date(),
      },
      actor
    );
  }

  async getRoles() {
    return this.repo.findMany({
      include: { userRoles: true },
    });
  }

  async getRoleById(roleId: number) {
    return this.repo.findUnique(roleId);
  }

  async updateRole(roleId: number, data: Partial<{ name: string; description: string }>, actor: string = "system") {
    if (data.name) {
      const existingRole = await this.repo.findMany({
        where: {
          name: data.name,
          AND: [{ id: { not: roleId } }],
        },
      });
      if (existingRole.length > 0) {
        throw new Error("Role name already exists");
      }
    }

    const updateData = {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
    };
    return this.repo.update(roleId, updateData, actor);
  }

  async deleteRole(roleId: number, actor: string = "system") {
    return this.repo.delete(roleId, actor);
  }
}
