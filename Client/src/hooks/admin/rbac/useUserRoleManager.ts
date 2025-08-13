import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import RbacService from "@Services/admin/rbacService";
import { Role } from "@Types/competency/rbacTypes";

type ToastCallback = (message: string, type?: "success" | "error" | "info") => void;

export function useUserRoleManager(userId: string, onToast?: ToastCallback) {
  const queryClient = useQueryClient();

  // ดึง roles ของ user ตาม userId
  const userRolesQuery = useQuery<Role[], Error>({
    queryKey: ["userRoles", userId] as const,
    queryFn: () => RbacService.getUserRoles(userId),
    enabled: !!userId,
  });

  // assign role
  const assignRoleToUser = useMutation<void, Error, number>({
    mutationFn: (roleId: number) => RbacService.assignRoleToUser(userId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userRoles", userId] });
      onToast?.("Role assigned to user successfully", "success");
    },
    onError: () => onToast?.("Failed to assign role to user", "error"),
  });

  // revoke role
  const revokeRoleFromUser = useMutation<void, Error, number>({
    mutationFn: (roleId: number) => RbacService.revokeRoleFromUser(userId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userRoles", userId] });
      onToast?.("Role revoked from user successfully", "success");
    },
    onError: () => onToast?.("Failed to revoke role from user", "error"),
  });

  return {
    userRolesQuery,
    assignRoleToUser,
    revokeRoleFromUser,
  };
}
