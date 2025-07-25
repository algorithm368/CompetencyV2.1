import { UserRolesRepository } from "@Competency/repositories/RoleRepository";
import type { UserRole } from "@prisma/client_competency";
import { BaseService } from "@Utils/BaseService";

export class UserRoleService extends BaseService<UserRole, keyof UserRole> {
  constructor() {
    super(new UserRolesRepository(), ["userId", "roleId"], "id");
  }

  async assignRoleToUser(userId: string, roleId: number, actor: string = "system") {
    const existing = await this.repo.findFirst({
      where: { userId, roleId },
    });
    if (existing) {
      throw new Error("Role already assigned to user");
    }
    return this.repo.create({ userId, roleId, assignedAt: new Date() }, actor);
  }

  async revokeRoleFromUser(userId: string, roleId: number, actor: string = "system") {
    const existing = await this.repo.findFirst({
      where: { userId, roleId },
    });
    if (!existing) {
      throw new Error("Role not assigned to user");
    }
    return this.repo.delete(existing.id, actor);
  }

  async getRolesForUser(userId: string) {
    return this.repo.findMany({
      where: { userId },
      include: { role: true }, // include role entity
    });
  }
}
