import { RoleRepository } from "@Competency/repositories/RoleRepository";

export class RoleService {
  private roleModel = new RoleRepository();

  async createRole(data: { role_name: string; description?: string }, actor: string = "system") {
    const existingRole = await this.roleModel.findMany({
      where: { role_name: data.role_name },
    });
    if (existingRole.length > 0) {
      throw new Error("Role already exists");
    }
    return this.roleModel.create(
      {
        name: data.role_name,
        description: data.description ?? null,
        createdAt: new Date(),
      },
      actor
    );
  }

  async getRoles() {
    return this.roleModel.findMany({
      include: { UserRoles: true },
    });
  }

  async getRoleById(roleId: number) {
    return this.roleModel.findUnique(roleId);
  }

  async updateRole(roleId: number, data: Partial<{ role_name: string; description: string }>, actor: string = "system") {
    if (data.role_name) {
      const existingRole = await this.roleModel.findMany({
        where: {
          role_name: data.role_name,
          AND: [{ role_id: { not: roleId } }],
        },
      });
      if (existingRole.length > 0) {
        throw new Error("Role name already exists");
      }
    }

    const updateData = {
      ...(data.role_name !== undefined ? { role_name: data.role_name } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
    };
    return this.roleModel.update(roleId, updateData, actor);
  }

  async deleteRole(roleId: number, actor: string = "system") {
    return this.roleModel.delete(roleId, actor);
  }
}
