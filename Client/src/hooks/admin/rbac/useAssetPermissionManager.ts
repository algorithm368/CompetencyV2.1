import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import RbacService from "@Services/admin/rbacService";
import { RolePermission } from "@Types/competency/rbacTypes";

type ToastCallback = (message: string, type?: "success" | "error" | "info") => void;

export function useAssetPermissionManager(assetId: number | null, onToast?: ToastCallback) {
  const queryClient = useQueryClient();

  const rolePermissionsQuery = useQuery<RolePermission[], Error>({
    queryKey: ["assetRolePermissions", assetId],
    queryFn: async () => {
      if (assetId === null) return [];
      return RbacService.getRolePermissionsForAsset(assetId);
    },
    enabled: assetId !== null,
  });

  const assignPermissionToAsset = useMutation<void, Error, number>({
    mutationFn: async (permissionId: number) => {
      if (assetId === null) throw new Error("Asset ID is required");
      return RbacService.assignPermissionToAsset(assetId, permissionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assetRolePermissions", assetId] });
      onToast?.("Permission assigned to asset successfully", "success");
    },
    onError: () => {
      onToast?.("Failed to assign permission to asset", "error");
    },
  });

  const revokePermissionFromAsset = useMutation<void, Error, number>({
    mutationFn: async (permissionId: number) => {
      if (assetId === null) throw new Error("Asset ID is required");
      return RbacService.revokePermissionFromAsset(assetId, permissionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assetRolePermissions", assetId] });
      onToast?.("Permission revoked from asset successfully", "success");
    },
    onError: () => {
      onToast?.("Failed to revoke permission from asset", "error");
    },
  });

  return {
    rolePermissionsQuery,
    assignPermissionToAsset,
    revokePermissionFromAsset,
  };
}
