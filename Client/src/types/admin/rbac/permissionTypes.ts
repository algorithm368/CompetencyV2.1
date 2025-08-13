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
