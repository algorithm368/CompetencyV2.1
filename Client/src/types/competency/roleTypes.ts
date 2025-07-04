export interface TableDataResponse {
  tableHead: string[];
  tableRows: Record<string, string | number | boolean | null>[];
}

export interface RoleEntity {
  role_id: number;
  role_name: string;
  description: string;
  created_at: string;
  UserRoles?: {
    user_id: string;
    assigned_at: string;
  }[];
}

export interface RolePayload {
  roleName: string;
  description?: string;
}

export interface RoleUpdatePayload extends RolePayload {
  role_id: number;
}

export type TabKey = "roles" | "permissions" | "assignPermissions" | "assignRoles";
