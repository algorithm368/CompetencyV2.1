export interface Permission {
  id: number;
  key: string;
  description?: string | null;
  createdAt: string;
}

export interface TableDataResponse {
  tableHead: string[];
  tableRows: Record<string, string | number | null>[];
}

export interface CreatePermissionPayload {
  key: string;
  description?: string;
}

export interface UpdatePermissionPayload {
  key?: string;
  description?: string;
}

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
