import { UserRolesRepository } from "@/modules/admin/repositories/RoleRepository";
import type { UserRole } from "@prisma/client_competency";
import { BaseService } from "@Utils/BaseService";

export class UserRoleService extends BaseService<UserRole, keyof UserRole> {
  constructor() {
    super(new UserRolesRepository(), ["userId"], "id");
  }

  async assignRoleToUser(userId: string, roleId: number, actor: string = "system") {
    try {
      console.log(`[RBAC] assignRoleToUser called`, { userId, roleId, actor });

      const existing = await this.repo.findFirst({ where: { userId, roleId } });
      if (existing) {
        console.log(`[RBAC] Role already assigned to user`, { userId, roleId });
        throw new Error("Role already assigned to user");
      }

      // log ก่อน create
      console.log(`[RBAC] Creating UserRole...`, { userId, roleId, assignedAt: new Date() });

      const result = await this.repo.create({ userId, roleId, assignedAt: new Date() }, actor);

      // log หลัง create
      console.log(`[RBAC] UserRole created successfully`, { result });

      return result;
    } catch (error) {
      console.error(`[RBAC] Failed to assign role ${roleId} to user ${userId}:`, error);
      throw error;
    }
  }

  async revokeRoleFromUser(userId: string, roleId: number, actor: string = "system") {
    const existing = await this.repo.findFirst({ where: { userId, roleId } });
    if (!existing) throw new Error("Role not assigned to user");
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

    if (search && search.trim()) {
      const trimmed = search.trim();
      where.user = { email: { contains: trimmed } };
    }

    const commonQuery: any = {
      where,
      include: {
        role: { select: { id: true, name: true, description: true } },
        user: { select: { id: true, email: true } },
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
