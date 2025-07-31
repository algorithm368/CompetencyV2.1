import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import RbacService from "@Services/competency/rbacService";
import { Permission, RolePermission } from "@Types/competency/rbacTypes";

type ToastCallback = (message: string, type?: "success" | "error" | "info") => void;

export function useAssetPermissionManager(assetId: number | null, onToast?: ToastCallback) {
  const queryClient = useQueryClient();

  const assetPermissionsQuery = useQuery<Permission[], Error>({
    queryKey: ["assetPermissions", assetId],
    queryFn: () => {
      if (assetId === null) return Promise.resolve([]);
      return RbacService.getAssetPermissions(assetId);
    },
    enabled: assetId !== null,
  });

  const rolePermissionsQuery = useQuery<RolePermission[], Error>({
    queryKey: ["assetRolePermissions", assetId],
    queryFn: () => {
      if (assetId === null) return Promise.resolve([]);
      return RbacService.getRolePermissionsForAsset(assetId);
    },
    enabled: assetId !== null,
  });

  const assignPermissionToAsset = useMutation<void, Error, { assetId: number; permissionId: number }>({
    mutationFn: ({ assetId, permissionId }: { assetId: number; permissionId: number }) => RbacService.assignPermissionToAsset(assetId, permissionId),
    onSuccess: ({ assetId }: { assetId: number }) => {
      queryClient.invalidateQueries({ queryKey: ["assetPermissions", assetId] });
      queryClient.invalidateQueries({ queryKey: ["assetRolePermissions", assetId] });
      onToast?.("Permission assigned to asset successfully", "success");
    },
    onError: () => {
      onToast?.("Failed to assign permission to asset", "error");
    },
  });

  const revokePermissionFromAsset = useMutation<void, Error, { assetId: number; permissionId: number }>({
    mutationFn: ({ assetId, permissionId }: { assetId: number; permissionId: number }) => RbacService.revokePermissionFromAsset(assetId, permissionId),
    onSuccess: ({ assetId }: { assetId: number }) => {
      queryClient.invalidateQueries({ queryKey: ["assetPermissions", assetId] });
      queryClient.invalidateQueries({ queryKey: ["assetRolePermissions", assetId] });
      onToast?.("Permission revoked from asset successfully", "success");
    },
    onError: () => {
      onToast?.("Failed to revoke permission from asset", "error");
    },
  });

  return {
    assetPermissionsQuery,
    rolePermissionsQuery,
    assignPermissionToAsset,
    revokePermissionFromAsset,
  };
}
