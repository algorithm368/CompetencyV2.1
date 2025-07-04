import api from "../api";
import { TableDataResponse, RoleEntity, RolePayload } from "@Types/competency/roleTypes";

export default class RoleService {
  static async getTableData(): Promise<TableDataResponse> {
    const response = await api.get<RoleEntity[]>("/competency/rbac/roles");
    const data = response.data;

    const tableHead = ["Role ID", "Role name", "Description", "Created At"];
    const tableRows = data.map((role) => ({
      "Role ID": role.role_id,
      "Role name": role.role_name,
      Description: role.description,
      "Created At": new Date(role.created_at).toLocaleString(),
    }));

    return { tableHead, tableRows };
  }

  static async getAll(): Promise<RoleEntity[]> {
    const response = await api.get<RoleEntity[]>("/competency/rbac/roles");
    return response.data;
  }

  static async getById(id: number): Promise<RoleEntity> {
    const response = await api.get<RoleEntity>(`/competency/rbac/roles/${id}`);
    return response.data;
  }

  static async create(payload: RolePayload): Promise<RoleEntity> {
    const response = await api.post<RoleEntity>("/competency/rbac/roles", payload);
    return response.data;
  }

  static async update(id: number, payload: RolePayload): Promise<RoleEntity> {
    const cleanedPayload = {
      roleName: payload.roleName.trim(),
      description: payload.description?.trim(),
    };
    const response = await api.put<RoleEntity>(`/competency/rbac/roles/${id}`, cleanedPayload);
    return response.data;
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`/competency/rbac/roles/${id}`);
  }

  static async assignToUser(userId: string, roleId: number): Promise<void> {
    await api.post("/competency/rbac/assign-role", { userId, roleId });
  }

  static async revokeFromUser(userId: string, roleId: number): Promise<void> {
    await api.delete("/competency/rbac/revoke-role", { data: { userId, roleId } });
  }

  static async getRolesForUser(userId: number): Promise<RoleEntity[]> {
    const response = await api.get<RoleEntity[]>(`/competency/rbac/user/${userId}/roles`);
    return response.data;
  }
}
