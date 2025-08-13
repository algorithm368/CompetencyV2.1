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
