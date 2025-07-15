export interface Permission {
  id: number;
  key: string;
  description?: string | null;
  createdAt: string;
}
export interface PermissionPageResult {
  data: Permission[];
  total?: number;
}

export type CreatePermissionDto = Omit<Permission, "id" | "createdAt">;
export type UpdatePermissionDto = Partial<Omit<Permission, "id" | "createdAt">>;

export interface PermissionRow {
  id: number;
  key: string;
  description: string | null;
  assigned: boolean;
}

export interface State {
  selectedRole: number | null;
  permissions: PermissionRow[];
}
