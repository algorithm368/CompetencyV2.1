// --- Role ---
export interface Role {
  id: number;
  name: string;
  description?: string | null;
  parentRoleId?: number | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface RolePageResult {
  data: Role[];
  total: number;
}

export interface CreateRoleDto {
  name: string;
  description?: string;
  parentRoleId?: number;
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
  parentRoleId?: number;
}

// --- Permission ---
export interface Permission {
  id: number;
  operationId: number;
  assetId: number;
  createdAt: string;
  updatedAt: string;
  operation?: {
    id: number;
    name: string;
    description?: string | null;
  };
  asset?: {
    id: number;
    tableName: string;
    description?: string | null;
  };
}

export interface PermissionPageResult {
  data: Permission[];
  total: number;
}

export interface CreatePermissionDto {
  operationId: number;
  assetId: number;
}

export interface UpdatePermissionDto {
  operationId?: number;
  assetId?: number;
}

// --- UserRole ---
export interface UserRoleAssignmentDto {
  userId: string;
  roles: Role[];
}

// --- Asset ---
export interface Asset {
  id: number;
  tableName: string;
  description?: string | null;
  updatedAt: string;
}

export interface AssetPageResult {
  data: Asset[];
  total: number;
}

export interface CreateAssetDto {
  tableName: string;
  description?: string;
}

export interface UpdateAssetDto {
  tableName?: string;
  description?: string;
}

// --- RolePermission ---
export interface RolePermission {
  id: number;
  roleId: number;
  permissionId: number;
  grantedAt: string;

  role?: {
    id: number;
    name: string;
    description?: string | null;
  };

  permission?: {
    id: number;
    operationId: number;
    assetId: number;
    createdAt: string;
    updatedAt: string;
  };
}

// --- Session ---
export interface Session {
  id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// --- User ---
export interface User {
  id: string;
  email: string;
  profileImage?: string;
  firstNameTH?: string;
  lastNameTH?: string;
  firstNameEN?: string;
  lastNameEN?: string;
  phone?: string;
  line?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Log ---
export enum LogAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
}

export interface Log {
  id: number;
  action: LogAction;
  databaseName: string;
  tableName: string;
  recordId?: string;
  userId?: string;
  timestamp?: string;
  parameters?: string;
}
