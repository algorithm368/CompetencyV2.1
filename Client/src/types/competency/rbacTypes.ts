// --- Role ---
export interface Role {
  id: number;
  name: string;
  description?: string;
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
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
}

// --- Permission ---
export interface Permission {
  id: number;
  key: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionPageResult {
  data: Permission[];
  total: number;
}

export interface CreatePermissionDto {
  key: string;
  description?: string;
}

export interface UpdatePermissionDto {
  key?: string;
  description?: string;
}

// --- UserRole ---
export interface UserRoleAssignmentDto {
  userId: number;
  roles: Role[];
}

// --- Asset ---
export interface Asset {
  id: number;
  tableName: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssetPageResult {
  data: Asset[];
  total: number;
}

export interface CreateAssetDto {
  name: string;
  description?: string;
}

export interface UpdateAssetDto {
  name?: string;
  description?: string;
}

export interface AssetPermissionPagePageProps {
  initialSelectedAssetId?: number | null;
}

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
    key: string;
    description?: string | null;
  };
}
