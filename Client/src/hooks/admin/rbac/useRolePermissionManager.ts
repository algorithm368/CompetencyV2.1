import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RolePermissionsService } from "@Services/admin/rbac/rolePermissionsService";
import { Permission } from "@Types/competency/rbacTypes";

type ToastCallback = (message: string, type?: "success" | "error" | "info") => void;
export function useRolePermissionManager(roleId: number | null, onToast?: ToastCallback) {
  const queryClient = useQueryClient();

  const rolePermissionsQuery = useQuery<Permission[], Error>({
    queryKey: ["rolePermissions", roleId],
    queryFn: () => {
      if (roleId === null) return Promise.resolve([]);
      return RolePermissionsService.getRolePermissions(roleId);
    },
    enabled: roleId !== null,
  });

  const assignPermissionToRole = useMutation<void, Error, { roleId: number; permissionId: number }>({
    mutationFn: ({ roleId, permissionId }: { roleId: number; permissionId: number }) => RolePermissionsService.assignPermissionToRole(roleId, permissionId),
    onSuccess: ({ roleId }: { roleId: number }) => {
      queryClient.invalidateQueries({ queryKey: ["rolePermissions", roleId] });
      onToast?.("Permission assigned to role successfully", "success");
    },
    onError: () => {
      onToast?.("Failed to assign permission to role", "error");
    },
  });

  const revokePermissionFromRole = useMutation<void, Error, { roleId: number; permissionId: number }>({
    mutationFn: ({ roleId, permissionId }: { roleId: number; permissionId: number }) => RolePermissionsService.revokePermissionFromRole(roleId, permissionId),
    onSuccess: ({ roleId }: { roleId: number }) => {
      queryClient.invalidateQueries({ queryKey: ["rolePermissions", roleId] });
      onToast?.("Permission revoked from role successfully", "success");
    },
    onError: () => {
      onToast?.("Failed to revoke permission from role", "error");
    },
  });

  return {
    rolePermissionsQuery,
    assignPermissionToRole,
    revokePermissionFromRole,
  };
}
