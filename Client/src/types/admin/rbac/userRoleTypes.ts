import { Role } from "./roleTypes";

export interface UserRoleAssignmentDto {
  userId: string;
  roles: Role[];
}
export interface UserRole {
  id: number;
  userId: string;
  roleId: number;
  assignedAt: string;
  role?: Role;
}
