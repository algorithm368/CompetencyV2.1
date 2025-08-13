import { AxiosResponse } from "axios";
import api from "@Services/api";
import {
  // Role
  Role,
  RolePageResult,
  CreateRoleDto,
  UpdateRoleDto,

  // Permission
  Permission,
  PermissionPageResult,
  CreatePermissionDto,
  UpdatePermissionDto,

  // Asset
  Asset,
  AssetPageResult,
  CreateAssetDto,
  UpdateAssetDto,

  // RolePermission
  RolePermission,

  // UserRole
  UserRoleAssignmentDto,

  // Session
  Session,

  // User
  User,

  // Log
  Log,
  LogAction,

  // Operation
  Operation,
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
  static async assignRoleToUser(userId: string, roleId: number): Promise<void> {
    await api.post("/competency/rbac/user-roles", { userId, roleId });
  }

  static async revokeRoleFromUser(userId: string, roleId: number): Promise<void> {
    await api.delete("/competency/rbac/user-roles", { data: { userId, roleId } });
  }

  static async getUserRoles(userId: string): Promise<Role[]> {
    const res: AxiosResponse<Role[]> = await api.get(`/competency/rbac/user-roles/user/${userId}`);
    return res.data;
  }

  // --- RolePermissions ---
  static async assignPermissionToRole(roleId: number, permissionId: number): Promise<void> {
    await api.post("/competency/rbac/role-permissions", { roleId, permissionId });
  }

  static async revokePermissionFromRole(roleId: number, permissionId: number): Promise<void> {
    await api.delete("/competency/rbac/role-permissions", { data: { roleId, permissionId } });
  }

  static async getRolePermissions(roleId: number): Promise<Permission[]> {
    const res: AxiosResponse<Permission[]> = await api.get(`/competency/rbac/role-permissions/role/${roleId}`);
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

  static async getAssetByName(name: string): Promise<Asset> {
    const res: AxiosResponse<Asset> = await api.get(`/competency/rbac/assets/name/${name}`);
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
  static async getRolePermissionsForAsset(assetId: number): Promise<RolePermission[]> {
    const res: AxiosResponse<RolePermission[]> = await api.get(`/competency/rbac/assets/${assetId}/role-permissions`);
    return res.data;
  }

  static async assignPermissionToAsset(assetId: number, permissionId: number): Promise<void> {
    await api.post(`/competency/rbac/assets/${assetId}/permissions`, { permissionId });
  }

  static async revokePermissionFromAsset(assetId: number, permissionId: number): Promise<void> {
    await api.delete(`/competency/rbac/assets/${assetId}/permissions`, { data: { permissionId } });
  }
  // --- Asset Instances ---
  static async createAssetInstance(payload: any): Promise<any> {
    const res: AxiosResponse<any> = await api.post("/competency/rbac/asset-instances", payload);
    return res.data;
  }

  static async deleteAssetInstanceById(id: number): Promise<void> {
    await api.delete(`/competency/rbac/asset-instances/${id}`);
  }

  static async deleteAssetInstance(payload: any): Promise<void> {
    await api.delete("/competency/rbac/asset-instances", { data: payload });
  }

  static async getAssetInstancesByAsset(assetId: number): Promise<any[]> {
    const res: AxiosResponse<any[]> = await api.get(`/competency/rbac/asset-instances/asset/${assetId}`);
    return res.data;
  }

  static async getAssetInstanceById(id: number): Promise<any> {
    const res: AxiosResponse<any> = await api.get(`/competency/rbac/asset-instances/${id}`);
    return res.data;
  }

  static async updateAssetInstance(id: number, payload: any): Promise<any> {
    const res: AxiosResponse<any> = await api.put(`/competency/rbac/asset-instances/${id}`, payload);
    return res.data;
  }

  // --- Logs ---
  static async createLog(payload: Log): Promise<Log> {
    const res: AxiosResponse<Log> = await api.post("/competency/rbac/logs", payload);
    return res.data;
  }

  static async getLogs(): Promise<Log[]> {
    const res: AxiosResponse<Log[]> = await api.get("/competency/rbac/logs");
    return res.data;
  }

  static async getLogById(id: number): Promise<Log> {
    const res: AxiosResponse<Log> = await api.get(`/competency/rbac/logs/${id}`);
    return res.data;
  }

  static async createOperation(payload: Operation): Promise<Operation> {
    const res: AxiosResponse<Operation> = await api.post("/competency/rbac/operations", payload);
    return res.data;
  }

  static async getOperations(): Promise<Operation[]> {
    const res: AxiosResponse<Operation[]> = await api.get("/competency/rbac/operations");
    return res.data;
  }

  static async getOperationById(id: number): Promise<Operation> {
    const res: AxiosResponse<Operation> = await api.get(`/competency/rbac/operations/${id}`);
    return res.data;
  }

  static async updateOperation(id: number, payload: Partial<Operation>): Promise<Operation> {
    const res: AxiosResponse<Operation> = await api.put(`/competency/rbac/operations/${id}`, payload);
    return res.data;
  }

  static async deleteOperation(id: number): Promise<void> {
    await api.delete(`/competency/rbac/operations/${id}`);
  }

  // --- Sessions ---
  static async createSession(payload: Session): Promise<Session> {
    const res: AxiosResponse<Session> = await api.post("/competency/rbac/sessions", payload);
    return res.data;
  }

  static async getSessionById(id: string): Promise<Session> {
    const res: AxiosResponse<Session> = await api.get(`/competency/rbac/sessions/${id}`);
    return res.data;
  }

  static async getSessionByAccessToken(): Promise<Session> {
    const res: AxiosResponse<Session> = await api.get("/competency/rbac/sessions/by-access-token");
    return res.data;
  }

  static async getSessionByRefreshToken(): Promise<Session> {
    const res: AxiosResponse<Session> = await api.get("/competency/rbac/sessions/by-refresh-token");
    return res.data;
  }

  static async deleteSessionById(id: string): Promise<void> {
    await api.delete(`/competency/rbac/sessions/${id}`);
  }

  static async deleteSessionsByUserId(userId: string): Promise<void> {
    await api.delete(`/competency/rbac/sessions/user/${userId}`);
  }

  static async isSessionExpired(id: string): Promise<boolean> {
    const res: AxiosResponse<{ expired: boolean }> = await api.get(`/competency/rbac/sessions/${id}/expired`);
    return res.data.expired;
  }

  // --- Users ---
  static async getAllUsers(): Promise<User[]> {
    const res: AxiosResponse<User[]> = await api.get("/competency/rbac/users");
    return res.data;
  }

  static async getUserById(id: string): Promise<User> {
    const res: AxiosResponse<User> = await api.get(`/competency/rbac/users/${id}`);
    return res.data;
  }

  static async getUserByEmail(email: string): Promise<User> {
    const res: AxiosResponse<User> = await api.get("/competency/rbac/users/by-email", { params: { email } });
    return res.data;
  }

  static async createUser(payload: User): Promise<User> {
    const res: AxiosResponse<User> = await api.post("/competency/rbac/users", payload);
    return res.data;
  }

  static async updateUser(id: string, payload: Partial<User>): Promise<User> {
    const res: AxiosResponse<User> = await api.put(`/competency/rbac/users/${id}`, payload);
    return res.data;
  }

  static async deleteUser(id: string): Promise<void> {
    await api.delete(`/competency/rbac/users/${id}`);
  }
}
