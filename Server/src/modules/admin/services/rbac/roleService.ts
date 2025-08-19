import { RoleRepository } from "@Competency/repositories/RoleRepository";
import type { Role } from "@prisma/client_competency";
import { BaseService } from "@Utils/BaseService";

export class RoleService extends BaseService<Role, keyof Role> {
  constructor() {
    super(new RoleRepository(), ["id"], "id");
  }

  async createRole(name: string, description?: string, actor: string = "system") {
    const existing = await this.repo.findFirst({ where: { name } });
    if (existing) throw new Error("Role already exists");
    return this.repo.create({ name, description, createdAt: new Date() }, actor);
  }

  async getRoleByName(name: string) {
    return this.repo.findFirst({ where: { name } });
  }
}
