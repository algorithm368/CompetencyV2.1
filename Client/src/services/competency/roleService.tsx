import api from "@Services/api";
import { RoleEntity, RolePageResult, CreateRoleDto, UpdateRoleDto, UserEntity } from "@Types/competency/roleTypes";

export default class RoleService {
  static async getAll(search?: string, page?: number, perPage?: number): Promise<RolePageResult> {
    const params = new URLSearchParams();
    if (page !== undefined) params.append("page", String(page));
    if (perPage !== undefined) params.append("perPage", String(perPage));
    if (search) params.append("search", search);

    const response = await api.get<RolePageResult>("/competency/rbac/roles", { params });
    return response.data;
  }

  static async getById(id: number): Promise<RoleEntity> {
    const response = await api.get<RoleEntity>(`/competency/rbac/roles/${id}`);
    return response.data;
  }

  static async create(payload: CreateRoleDto): Promise<RoleEntity> {
    const cleanedPayload = {
      name: payload.name.trim(),
      description: payload.description?.trim() ?? null,
    };
    const response = await api.post<RoleEntity>("/competency/rbac/roles", cleanedPayload);
    return response.data;
  }

  static async update(id: number, payload: UpdateRoleDto): Promise<RoleEntity> {
    const cleanedPayload = {
      name: payload.name?.trim(),
      description: payload.description?.trim() ?? null,
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
    await api.delete("/competency/rbac/revoke-role", {
      data: { userId, roleId },
    });
  }

  static async getRolesForUser(userId: number): Promise<RoleEntity[]> {
    const response = await api.get<RoleEntity[]>(`/competency/rbac/user/${userId}/roles`);
    return response.data;
  }

  static async getAllRoles(): Promise<RoleEntity[]> {
    const response = await api.get<RoleEntity[]>("/competency/rbac/roles");
    return response.data;
  }

  static async getAllUsers(): Promise<UserEntity[]> {
    const response = await api.get<UserEntity[]>("/competency/rbac/users");
    return response.data;
  }
}
