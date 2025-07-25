import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import RbacService from "@Services/competency/rbacService";
import { UserRoleAssignmentDto } from "@Types/competency/rbacTypes";

type ToastCallback = (message: string, type?: "success" | "error" | "info") => void;
export function useUserRoleManager(onToast?: ToastCallback) {
  const queryClient = useQueryClient();

  const getUserRoles = useQuery<UserRoleAssignmentDto[], Error>({
    queryKey: ["userRoles"],
    queryFn: () => RbacService.getAllUsersRoles(),
  });

  const assignRoleToUser = useMutation<void, Error, { userId: number; roleId: number }>({
    mutationFn: ({ userId, roleId }: { userId: number; roleId: number }) => RbacService.assignRoleToUser(userId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userRoles"] });
      onToast?.("Role assigned to user successfully", "success");
    },
    onError: () => {
      onToast?.("Failed to assign role to user", "error");
    },
  });

  const revokeRoleFromUser = useMutation<void, Error, { userId: number; roleId: number }>({
    mutationFn: ({ userId, roleId }: { userId: number; roleId: number }) => RbacService.revokeRoleFromUser(userId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userRoles"] });
      onToast?.("Role revoked from user successfully", "success");
    },
    onError: () => {
      onToast?.("Failed to revoke role from user", "error");
    },
  });

  return {
    getUserRoles,
    assignRoleToUser,
    revokeRoleFromUser,
  };
}
