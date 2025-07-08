import { AxiosResponse } from "axios";
import api from "../api";
import { TableDataResponse, Permission, CreatePermissionPayload, UpdatePermissionPayload } from "@Types/competency/permissionTypes";
export default class PermissionService {
  // ---- Permissions CRUD ----
  static async getTableData(): Promise<TableDataResponse> {
    const res: AxiosResponse<Permission[]> = await api.get("/competency/rbac/permissions");
    const perms = res.data;

    const tableHead = ["Permission ID", "Key", "Description", "Created At"];
    const tableRows = perms.map((p) => ({
      "Permission ID": p.permission_id,
      Key: p.permission_key,
      Description: p.description ?? "",
      "Created At": new Date(p.created_at).toLocaleString(),
    }));

    return { tableHead, tableRows };
  }

  static async getAll(): Promise<Permission[]> {
    const res: AxiosResponse<Permission[]> = await api.get("/competency/rbac/permissions");
    return res.data;
  }

  static async getById(id: number): Promise<Permission> {
    const res: AxiosResponse<Permission> = await api.get(`/competency/rbac/permissions/${id}`);
    return res.data;
  }

  static async create(payload: CreatePermissionPayload): Promise<Permission> {
    const res: AxiosResponse<Permission> = await api.post("/competency/rbac/permissions", payload);
    return res.data;
  }

  static async update(id: number, payload: UpdatePermissionPayload): Promise<Permission> {
    const res: AxiosResponse<Permission> = await api.put(`/competency/rbac/permissions/${id}`, payload);
    return res.data;
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`/competency/rbac/permissions/${id}`);
  }

  // ---- Role ↔ Permission Assignment ----
  static async assignToRole(roleId: number, permissionId: number): Promise<void> {
    await api.post("/competency/rbac/assign-permission", { roleId, permissionId });
  }

  static async revokeFromRole(roleId: number, permissionId: number): Promise<void> {
    await api.delete("/competency/rbac/revoke-permission", { data: { roleId, permissionId } });
  }

  static async getForRole(roleId: number): Promise<Permission[]> {
    const res: AxiosResponse<Permission[]> = await api.get(`/competency/rbac/role/${roleId}/permissions`);
    return res.data;
  }
}
