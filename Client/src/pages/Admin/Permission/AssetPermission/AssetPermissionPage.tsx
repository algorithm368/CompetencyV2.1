import React, { useState, useEffect } from "react";
import { useAssetManager } from "@Hooks/competency/rbac/useAssetManager";
import { useAssetPermissionManager } from "@Hooks/competency/rbac/useAssetPermissionManager";
import { usePermissionManager } from "@Hooks/competency/rbac/usePermissionManager";
import { Permission, AssetPermissionPagePageProps } from "@Types/competency/rbacTypes";
import { Spinner, Toast, Checkbox } from "@Components/Common/ExportComponent";

export const AssetPermissionPage: React.FC<AssetPermissionPagePageProps> = ({ initialSelectedAssetId = null }) => {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(initialSelectedAssetId);
  const [togglingPermissionId, setTogglingPermissionId] = useState<number | null>(null);

  const handleToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
  };

  const { assetQuery } = useAssetManager({ id: selectedAssetId }, handleToast);
  const { assetPermissionsQuery, assignPermissionToAsset, revokePermissionFromAsset } = useAssetPermissionManager(selectedAssetId, handleToast);

  const {
    permissionsQuery: { data: allPermissions = [], isLoading: isLoadingAllPermissions, isError: isErrorAllPermissions },
  } = usePermissionManager({ page: 1, perPage: 100 });

  const assetPermissions = assetPermissionsQuery.data || [];
  const isLoadingAssetPermissions = assetPermissionsQuery.isLoading;
  const isErrorAssetPermissions = assetPermissionsQuery.isError;

  useEffect(() => {
    if (assignPermissionToAsset.isSuccess || revokePermissionFromAsset.isSuccess) {
      assetPermissionsQuery.refetch();
      setTogglingPermissionId(null);
    }
    if (assignPermissionToAsset.isError || revokePermissionFromAsset.isError) {
      setTogglingPermissionId(null);
    }
  }, [assignPermissionToAsset.isSuccess, revokePermissionFromAsset.isSuccess, assignPermissionToAsset.isError, revokePermissionFromAsset.isError, assetPermissionsQuery]);

  useEffect(() => {
    setSelectedAssetId(initialSelectedAssetId);
  }, [initialSelectedAssetId]);

  const handleTogglePermission = (permission: Permission, checked: boolean) => {
    if (!selectedAssetId) {
      handleToast("Please select an asset first.", "info");
      return;
    }

    setTogglingPermissionId(permission.id);

    const mutationOptions = {
      onSuccess: () => {},
      onError: (error: any) => {
        handleToast(`Failed to ${checked ? "assign" : "revoke"} permission: ${error.message || "Unknown error"}`, "error");
        setTogglingPermissionId(null);
      },
    };

    if (checked) {
      assignPermissionToAsset.mutate({ assetId: selectedAssetId, permissionId: permission.id }, mutationOptions);
    } else {
      revokePermissionFromAsset.mutate({ assetId: selectedAssetId, permissionId: permission.id }, mutationOptions);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <section>
        {selectedAssetId === null ? (
          <p className="text-gray-500 italic">Select an asset to manage permissions.</p>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-2">
              Manage Permissions for Asset: <span className="font-mono">{assetQuery.isLoading ? "Loading..." : assetQuery.data?.name || "N/A"}</span>
            </h2>

            {/* Combined loading and error handling for permissions */}
            {isLoadingAllPermissions || isLoadingAssetPermissions ? (
              <Spinner />
            ) : isErrorAllPermissions ? (
              <p className="text-red-500">Error loading all permissions. Please try again.</p>
            ) : isErrorAssetPermissions ? (
              <p className="text-red-500">Error loading asset's permissions. Please try again.</p>
            ) : allPermissions.length === 0 ? (
              <p className="text-gray-500 italic">No permissions available to assign.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[400px] overflow-auto border rounded p-3">
                {allPermissions.map((permission) => {
                  const isAssigned = assetPermissions.some((p) => p.id === permission.id);
                  const isTogglingThisPermission = togglingPermissionId === permission.id;
                  const isAnyMutationPending = assignPermissionToAsset.isPending || revokePermissionFromAsset.isPending;

                  return (
                    <label key={permission.id} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={isAssigned}
                        onCheckedChange={(checked) => handleTogglePermission(permission, checked as boolean)}
                        disabled={isTogglingThisPermission || isAnyMutationPending}
                      />
                      <span>{permission.key}</span>
                      {isTogglingThisPermission && <Spinner size="small" />}
                    </label>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};
