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

export interface RolePageResult {
  data: RoleEntity[];
  total?: number;
}

export type CreateRoleDto = {
  name: string;
  description?: string | null;
};

export type UpdateRoleDto = Partial<CreateRoleDto> & {
  id: number;
};

export type TabKey = "roles" | "permissions" | "assignPermissions" | "assignRoles";
export interface UserEntity {
  id: string;
  username: string;
  email?: string;
}
