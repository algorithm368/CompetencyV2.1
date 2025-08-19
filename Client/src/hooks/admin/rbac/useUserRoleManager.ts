import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserRoleService } from "@Services/admin/rbac/userRoleService";
import { UserRole } from "@Types/admin/rbac/userRoleTypes";
import { Role } from "@Types/admin/rbac/roleTypes";
import { UserRoleAssignmentDto } from "@Types/admin/rbac/userRoleTypes";

type ToastCallback = (message: string, type?: "success" | "error" | "info") => void;

export function useUserRoleManager(userId: string, onToast?: ToastCallback) {
  const queryClient = useQueryClient();

  // ดึง roles ของ user ตาม userId (UserRole[])
  const userRolesQuery = useQuery<UserRole[], Error>({
    queryKey: ["userRoles", userId],
    queryFn: () => UserRoleService.getUserRoles(userId),
    enabled: !!userId,
  });

  // assign roles (รองรับหลาย role)
  const assignRolesToUser = useMutation<void, Error, Role[]>({
    mutationFn: (roles: Role[]) => UserRoleService.assignRolesToUser({ userId, roles } as UserRoleAssignmentDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userRoles", userId] });
      onToast?.("Roles assigned to user successfully", "success");
    },
    onError: () => onToast?.("Failed to assign roles to user", "error"),
  });

  // revoke role (เฉพาะ role เดียว)
  const revokeRoleFromUser = useMutation<void, Error, number>({
    mutationFn: (roleId: number) => UserRoleService.revokeRoleFromUser(userId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userRoles", userId] });
      onToast?.("Role revoked from user successfully", "success");
    },
    onError: () => onToast?.("Failed to revoke role from user", "error"),
  });

  return {
    userRolesQuery,
    assignRolesToUser,
    revokeRoleFromUser,
  };
}
