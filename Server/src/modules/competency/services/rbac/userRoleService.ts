import { UserRolesRepository } from "@Competency/repositories/RoleRepository";

export class UserRoleService {
  private userRoleModel = new UserRolesRepository();

  /**
   * Assigns a role to a user if not already assigned.
   * @param {string} userId - The ID of the user to assign the role to.
   * @param {number} roleId - The ID of the role to assign.
   * @param {string} [actor="system"] - The user or system performing the action.
   * @throws Will throw an error if the user already has the specified role.
   */
  async assignRoleToUser(userId: string, roleId: number, actor: string = "system") {
    const existing = await this.userRoleModel.findFirst({
      where: { user_id: userId, role_id: roleId },
    });
    if (existing) {
      throw new Error("User already has this role");
    }
    return this.userRoleModel.create({ userId: userId, roleId: roleId, assignedAt: new Date() }, actor);
  }

  /**
   * Revokes a role from a user if it exists.
   * @param {string} userId - The ID of the user to revoke the role from.
   * @param {number} roleId - The ID of the role to revoke.
   * @param {string} [actor="system"] - The user or system performing the action.
   * @throws Will throw an error if the user does not have the specified role assigned.
   */
  async revokeRoleFromUser(userId: string, roleId: number, actor: string = "system") {
    const existing = await this.userRoleModel.findFirst({
      where: { user_id: userId, role_id: roleId },
    });
    if (!existing) {
      throw new Error("No role assignment found for user");
    }
    return this.userRoleModel.delete(existing.id, actor);
  }

  /**
   * Retrieves all roles assigned to a specific user.
   * @param {string} userId - The ID of the user to retrieve roles for.
   * @returns {Promise<any[]>} A list of roles assigned to the user.
   */
  async getRolesForUser(userId: string) {
    return this.userRoleModel.findMany({
      where: { user_id: userId },
      include: { Roles: true },
    });
  }
}
