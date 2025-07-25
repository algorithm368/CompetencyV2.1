import { AxiosResponse } from "axios";
import api from "@Services/api";
import { Permission, PermissionPageResult, CreatePermissionDto, UpdatePermissionDto } from "@Types/competency/permissionTypes";

export default class PermissionService {
  static async getAll(search?: string, page?: number, perPage?: number): Promise<PermissionPageResult> {
    const params = new URLSearchParams();
    if (page !== undefined) params.append("page", String(page));
    if (perPage !== undefined) params.append("perPage", String(perPage));
    if (search) params.append("search", search);

    const res: AxiosResponse<PermissionPageResult> = await api.get("/competency/rbac/permissions", { params });
    return res.data;
  }

  static async getAllFlat(): Promise<Permission[]> {
    const res: AxiosResponse<Permission[]> = await api.get("/competency/rbac/permissions");
    return res.data;
  }

  static async getById(id: number): Promise<Permission> {
    const res: AxiosResponse<Permission> = await api.get(`/competency/rbac/permissions/${id}`);
    return res.data;
  }

  static async create(payload: CreatePermissionDto): Promise<Permission> {
    const res: AxiosResponse<Permission> = await api.post("/competency/rbac/permissions", payload);
    return res.data;
  }

  static async update(id: number, payload: UpdatePermissionDto): Promise<Permission> {
    const res: AxiosResponse<Permission> = await api.put(`/competency/rbac/permissions/${id}`, payload);
    return res.data;
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`/competency/rbac/permissions/${id}`);
  }

  static async assignToRole(roleId: number, permissionId: number): Promise<void> {
    await api.post("/competency/rbac/assign-permission", { roleId, permissionId });
  }

  static async revokeFromRole(roleId: number, permissionId: number): Promise<void> {
    await api.delete("/competency/rbac/revoke-permission", {
      data: { roleId, permissionId },
    });
  }

  static async getForRole(roleId: number): Promise<Permission[]> {
    const res: AxiosResponse<Permission[]> = await api.get(`/competency/rbac/role/${roleId}/permissions`);
    return res.data;
  }
}
