// --- UserRole ---
import { Role } from "./roleTypes";

export interface UserRoleAssignmentDto {
  userId: string;
  roles: Role[];
}
