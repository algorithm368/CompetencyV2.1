import { UserRolesRepository } from "@Competency/repositories/RoleRepository";
import { RoleRepository } from "@Competency/repositories/RoleRepository";
import type { UserRole } from "@prisma/client_competency";
import { BaseService } from "@Utils/BaseService";

export class UserRoleService extends BaseService<UserRole, keyof UserRole> {
  private roleRepo: RoleRepository;

  constructor() {
    super(new UserRolesRepository(), ["userId"], "id");
    this.roleRepo = new RoleRepository(); // สร้าง instance สำหรับ role repository
  }

  /**
   * Assigns a role to a user if not already assigned.
   */
  async assignRoleToUser(userId: string, roleId: number, actor: string = "system") {
    const existing = await this.repo.findFirst({
      where: { userId, roleId },
    });
    if (existing) {
      throw new Error("User already has this role");
    }
    return this.repo.create({ userId, roleId, assignedAt: new Date() }, actor);
  }

  /**
   * Revokes a role from a user if it exists.
   */
  async revokeRoleFromUser(userId: string, roleId: number, actor: string = "system") {
    const existing = await this.repo.findFirst({
      where: { userId, roleId },
    });
    if (!existing) {
      throw new Error("No role assignment found for user");
    }
    return this.repo.delete(existing.id, actor);
  }

  /**
   * Retrieves all roles assigned to a specific user.
   */
  async getRolesForUser(userId: string) {
    return this.repo.findMany({
      where: { userId },
      include: { role: true },
    });
  }

  /**
   * Retrieves all users.
   */
  async getAllUsers() {
    return (await this.repo.findUsers?.()) ?? [];
  }

  /**
   * Retrieves all roles.
   */
  async getAllRoles() {
    return await this.roleRepo.findMany();
  }
}
