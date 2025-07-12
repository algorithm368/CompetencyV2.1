import { RolePermissionsRepository } from "@Competency/repositories/RoleRepository";

export class RolePermissionService {
  private rolePermissionModel = new RolePermissionsRepository();

  /**
   * Assigns a permission to a role if not already assigned.
   * @param {number} roleId - The ID of the role to assign the permission to.
   * @param {number} permissionId - The ID of the permission to assign.
   * @param {string} [actor="system"] - The user or system performing the operation.
   * @throws Will throw an error if the permission is already assigned to the role.
   */
  async assignPermissionToRole(roleId: number, permissionId: number, actor: string = "system") {
    const existing = await this.rolePermissionModel.findFirst({
      where: { role_id: roleId, permission_id: permissionId },
    });
    if (existing) {
      throw new Error("Permission already assigned to role");
    }
    return this.rolePermissionModel.create({ roleId: roleId, permissionId: permissionId, grantedAt: new Date() }, actor);
  }

  /**
   * Revokes a permission from a role if it exists.
   * @param {number} roleId - The ID of the role to revoke the permission from.
   * @param {number} permissionId - The ID of the permission to revoke.
   * @param {string} [actor="system"] - The user or system performing the operation.
   * @throws Will throw an error if no such permission assignment exists.
   */
  async revokePermissionFromRole(roleId: number, permissionId: number, actor: string = "system") {
    const existing = await this.rolePermissionModel.findFirst({
      where: { role_id: roleId, permission_id: permissionId },
    });
    if (!existing) {
      throw new Error("No permission assignment found for role");
    }
    return this.rolePermissionModel.delete(existing.id, actor);
  }

  /**
   * Retrieves all permissions assigned to a given role.
   * @param {number} roleId - The ID of the role to retrieve permissions for.
   * @returns {Promise<any[]>} A list of permissions associated with the role.
   */
  async getPermissionsForRole(roleId: number) {
    return this.rolePermissionModel.findMany({
      where: { role_id: roleId },
      include: { Permissions: true },
    });
  }
}
