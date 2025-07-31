import { AxiosResponse } from "axios";
import api from "@Services/api";
import {
  Role,
  RolePageResult,
  CreateRoleDto,
  UpdateRoleDto,
  Permission,
  PermissionPageResult,
  CreatePermissionDto,
  UpdatePermissionDto,
  UserRoleAssignmentDto,
  Asset,
  AssetPageResult,
  CreateAssetDto,
  UpdateAssetDto,
  RolePermission,
} from "@Types/competency/rbacTypes";

export default class RbacService {
  // --- Roles ---
  static async getAllRoles(search?: string, page?: number, perPage?: number): Promise<RolePageResult> {
    const params = new URLSearchParams();
    if (page !== undefined) params.append("page", String(page));
    if (perPage !== undefined) params.append("perPage", String(perPage));
    if (search) params.append("search", search);

    const res: AxiosResponse<RolePageResult> = await api.get("/competency/rbac/roles", { params });
    return res.data;
  }

  static async getRoleById(id: number): Promise<Role> {
    const res: AxiosResponse<Role> = await api.get(`/competency/rbac/roles/${id}`);
    return res.data;
  }

  static async createRole(payload: CreateRoleDto): Promise<Role> {
    const res: AxiosResponse<Role> = await api.post("/competency/rbac/roles", payload);
    return res.data;
  }

  static async updateRole(id: number, payload: UpdateRoleDto): Promise<Role> {
    const res: AxiosResponse<Role> = await api.put(`/competency/rbac/roles/${id}`, payload);
    return res.data;
  }

  static async deleteRole(id: number): Promise<void> {
    await api.delete(`/competency/rbac/roles/${id}`);
  }

  // --- Permissions ---
  static async getAllPermissions(search?: string, page?: number, perPage?: number): Promise<PermissionPageResult> {
    const params = new URLSearchParams();
    if (page !== undefined) params.append("page", String(page));
    if (perPage !== undefined) params.append("perPage", String(perPage));
    if (search) params.append("search", search);

    const res: AxiosResponse<PermissionPageResult> = await api.get("/competency/rbac/permissions", { params });
    return res.data;
  }

  static async getAllPermissionsFlat(): Promise<Permission[]> {
    const res: AxiosResponse<Permission[]> = await api.get("/competency/rbac/permissions");
    return res.data;
  }

  static async getPermissionById(id: number): Promise<Permission> {
    const res: AxiosResponse<Permission> = await api.get(`/competency/rbac/permissions/${id}`);
    return res.data;
  }

  static async createPermission(payload: CreatePermissionDto): Promise<Permission> {
    const res: AxiosResponse<Permission> = await api.post("/competency/rbac/permissions", payload);
    return res.data;
  }

  static async updatePermission(id: number, payload: UpdatePermissionDto): Promise<Permission> {
    const res: AxiosResponse<Permission> = await api.put(`/competency/rbac/permissions/${id}`, payload);
    return res.data;
  }

  static async deletePermission(id: number): Promise<void> {
    await api.delete(`/competency/rbac/permissions/${id}`);
  }

  // --- UserRoles ---
  static async assignRoleToUser(userId: number, roleId: number): Promise<void> {
    await api.post(`/competency/rbac/user/${userId}/assign-role`, { roleId });
  }

  static async revokeRoleFromUser(userId: number, roleId: number): Promise<void> {
    await api.delete(`/competency/rbac/user/${userId}/revoke-role`, { data: { roleId } });
  }

  static async getUserRoles(userId: number): Promise<Role[]> {
    const res: AxiosResponse<Role[]> = await api.get(`/competency/rbac/user/${userId}/roles`);
    return res.data;
  }

  static async getAllUsersRoles(): Promise<UserRoleAssignmentDto[]> {
    const res: AxiosResponse<UserRoleAssignmentDto[]> = await api.get("/competency/rbac/users");
    return res.data;
  }

  // --- RolePermissions ---
  static async assignPermissionToRole(roleId: number, permissionId: number): Promise<void> {
    await api.post(`/competency/rbac/role/${roleId}/assign-permission`, { permissionId });
  }

  static async revokePermissionFromRole(roleId: number, permissionId: number): Promise<void> {
    await api.delete(`/competency/rbac/role/${roleId}/revoke-permission`, { data: { permissionId } });
  }

  static async getRolePermissions(roleId: number): Promise<Permission[]> {
    const res: AxiosResponse<Permission[]> = await api.get(`/competency/rbac/role/${roleId}/permissions`);
    return res.data;
  }

  // --- Assets ---
  static async getAllAssets(search?: string, page?: number, perPage?: number): Promise<AssetPageResult> {
    const params = new URLSearchParams();
    if (page !== undefined) params.append("page", String(page));
    if (perPage !== undefined) params.append("perPage", String(perPage));
    if (search) params.append("search", search);

    const res: AxiosResponse<AssetPageResult> = await api.get("/competency/rbac/assets", { params });
    return res.data;
  }

  static async getAssetById(id: number): Promise<Asset> {
    const res: AxiosResponse<Asset> = await api.get(`/competency/rbac/assets/${id}`);
    return res.data;
  }

  static async createAsset(payload: CreateAssetDto): Promise<Asset> {
    const res: AxiosResponse<Asset> = await api.post("/competency/rbac/assets", payload);
    return res.data;
  }

  static async updateAsset(id: number, payload: UpdateAssetDto): Promise<Asset> {
    const res: AxiosResponse<Asset> = await api.put(`/competency/rbac/assets/${id}`, payload);
    return res.data;
  }

  static async deleteAsset(id: number): Promise<void> {
    await api.delete(`/competency/rbac/assets/${id}`);
  }

  // --- AssetPermissions ---
  static async getAssetPermissions(assetId: number): Promise<Permission[]> {
    const res: AxiosResponse<Permission[]> = await api.get(`/competency/rbac/assets/${assetId}/permissions`);
    return res.data;
  }

  static async assignPermissionToAsset(assetId: number, permissionId: number): Promise<void> {
    await api.post(`/competency/rbac/assets/${assetId}/permissions`, { permissionId });
  }

  static async revokePermissionFromAsset(assetId: number, permissionId: number): Promise<void> {
    await api.delete(`/competency/rbac/assets/${assetId}/permissions`, { data: { permissionId } });
  }

  static async getRolePermissionsForAsset(assetId: number): Promise<RolePermission[]> {
    const res: AxiosResponse<RolePermission[]> = await api.get(`/competency/rbac/assets/${assetId}/role-permissions`);
    return res.data;
  }
}
