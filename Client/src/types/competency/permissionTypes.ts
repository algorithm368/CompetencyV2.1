export interface Permission {
  permission_id: number;
  permission_key: string;
  description?: string;
  created_at: string;
}

export interface TableDataResponse {
  tableHead: string[];
  tableRows: Record<string, string | number | null>[];
}

export interface CreatePermissionPayload {
  permissionKey: string;
  description?: string;
}

export interface UpdatePermissionPayload {
  permission_key?: string;
  description?: string;
}

export interface PermissionRow {
  permission_id: number;
  key: string;
  description: string;
  assigned: boolean;
}

export interface State {
  selectedRole: number | null;
  permissions: PermissionRow[];
}
