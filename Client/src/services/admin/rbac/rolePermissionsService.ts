import { AxiosResponse } from "axios";
import api from "@Services/api";
import { RolePermission } from "@Types/admin/rbac/rolePermissionTypes";
import { Permission } from "@Types/admin/rbac/permissionTypes";

export const RolePermissionsService = {
  assignPermissionToRole: async (roleId: number, permissionId: number): Promise<RolePermission> => {
    const res: AxiosResponse<RolePermission> = await api.post("/admin/rbac/role-permissions", { roleId, permissionId });
    return res.data;
  },

  revokePermissionFromRole: async (roleId: number, permissionId: number): Promise<void> => {
    await api.delete("/admin/rbac/role-permissions", { data: { roleId, permissionId } });
  },

  getRolePermissions: async (roleId: number): Promise<Permission[]> => {
    const res: AxiosResponse<Permission[]> = await api.get(`/admin/rbac/role-permissions/role/${roleId}`);
    return res.data;
  },
};
