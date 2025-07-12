export interface TableDataResponse {
  tableHead: string[];
  tableRows: Record<string, string | number | boolean | null>[];
}

export interface RoleEntity {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  userRoles?: {
    userId: string;
    assignedAt: string;
  }[];
}

export interface RolePayload {
  name: string;
  description?: string;
}

export interface RoleUpdatePayload extends RolePayload {
  id: number;
}

export type TabKey = "roles" | "permissions" | "assignPermissions" | "assignRoles";
