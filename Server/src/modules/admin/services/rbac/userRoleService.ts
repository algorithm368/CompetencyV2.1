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
      include: {
        role: true,
      },
    });
  }

  async getAll(search?: string, page?: number, perPage?: number) {
    const where: any = {};
    if (search) {
      const userMatch = search.match(/user:(\w+)/);
      if (userMatch) where.userId = userMatch[1];

      const roleMatch = search.match(/role:(\d+)/);
      if (roleMatch) where.roleId = parseInt(roleMatch[1], 10);

      where.OR = this.searchFields.map((fieldPath) => {
        const parts = fieldPath.split(".");
        let nested: any = { contains: search.trim() };
        for (let i = parts.length - 1; i >= 1; i--) {
          nested = { [parts[i]]: nested };
        }
        return { [parts[0]]: nested };
      });
    }

    const commonQuery: any = {
      where,
      include: {
        role: { select: { id: true, name: true, description: true } }, // role info
        user: { select: { email: true } }, // user email
      },
    };

    if (page !== undefined && perPage !== undefined) {
      const data = await this.repo.findMany({
        ...commonQuery,
        skip: (page - 1) * perPage,
        take: perPage,
      });
      const total = await this.repo.manager.count({ where });
      return { data, total };
    }

    const data = await this.repo.findMany(commonQuery);
    return { data, total: data.length };
  }
}
