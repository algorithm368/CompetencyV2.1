import React, { useState, useEffect, useMemo } from "react";
import { DataTable, Spinner, Toast, Checkbox, Select } from "@Components/Common/ExportComponent";
import { useAssetManager } from "@Hooks/competency/rbac/useAssetManager";
import { usePermissionManager } from "@Hooks/competency/rbac/usePermissionManager";
import { useRoleManager } from "@Hooks/competency/rbac/useRoleManager";
import RbacService from "@Services/competency/rbacService";
import type { Permission, Role } from "@Types/competency/rbacTypes";

interface Asset {
  id: number;
  tableName: string;
}

export const AssetPermissionPage: React.FC = () => {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const handleToast = (message: string, type: "success" | "error" | "info" = "info") => setToast({ message, type });

  // Load roles
  const { rolesQuery } = useRoleManager({ page: 1, perPage: 1000 }, handleToast);
  const roles: Role[] = rolesQuery.data?.data || [];

  // Selected Role
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  // Load assets and permissions
  const perPage = 1000;
  const { assetsQuery } = useAssetManager({ page: 1, perPage }, handleToast);
  const assets: Asset[] = assetsQuery.data?.data || [];

  const {
    permissionsQuery: { data: allPermissionsPageResult, isLoading: isLoadingAllPermissions, isError: isErrorAllPermissions },
  } = usePermissionManager({ page: 1, perPage: 1000 });
  const allPermissions: Permission[] = allPermissionsPageResult?.data || [];

  // Permissions assigned to selected role per asset
  const [roleAssetPermissions, setRoleAssetPermissions] = useState<Record<number, Permission[]>>({});

  useEffect(() => {
    async function loadPermissionsForRole() {
      if (!selectedRoleId || !assets.length) {
        setRoleAssetPermissions({});
        return;
      }

      try {
        const results = await Promise.all(
          assets.map(async (asset) => {
            try {
              const rolePermissions = await RbacService.getRolePermissionsForAsset(selectedRoleId, asset.id);
              // แปลง RolePermission[] เป็น Permission[]
              const permissions = rolePermissions.map((rp) => rp.permission);
              return { assetId: asset.id, permissions };
            } catch {
              return { assetId: asset.id, permissions: [] };
            }
          })
        );

        const map: Record<number, Permission[]> = {};
        results.forEach(({ assetId, permissions }) => {
          map[assetId] = permissions;
        });
        setRoleAssetPermissions(map);
      } catch (err) {
        setRoleAssetPermissions({});
        handleToast("Failed to load role permissions per asset", "error");
      }
    }

    loadPermissionsForRole();
  }, [selectedRoleId, assets]);

  // Columns for DataTable
  const columns = useMemo(() => {
    const permissionColumns = allPermissions.map((perm) => ({
      id: perm.key,
      header: perm.key.charAt(0).toUpperCase() + perm.key.slice(1),
      cell: ({ row }: { row: { original: Asset } }) => {
        const asset = row.original;
        const permsForAsset = roleAssetPermissions[asset.id] || [];
        const isAssigned = permsForAsset.some((p) => p.id === perm.id);
        return <Checkbox checked={isAssigned} disabled onCheckedChange={() => {}} />;
      },
      size: 80,
      meta: { align: "center" as const },
    }));

    return [
      {
        accessorKey: "tableName",
        header: "Asset Name",
        size: 250,
      },
      ...permissionColumns,
    ];
  }, [allPermissions, roleAssetPermissions]);

  if (assetsQuery.isLoading || isLoadingAllPermissions || rolesQuery.isLoading) return <Spinner />;
  if (assetsQuery.isError) return <p className="text-red-500">Error loading assets.</p>;
  if (isErrorAllPermissions) return <p className="text-red-500">Error loading permissions.</p>;
  if (rolesQuery.isError) return <p className="text-red-500">Error loading roles.</p>;

  return (
    <div className="p-4 mx-auto">
      <h1 className="text-2xl font-bold mb-6">Asset Permissions by Role</h1>

      <div className="mb-6 max-w-sm">
        <label htmlFor="role-select" className="block mb-1 font-semibold">
          Select Role
        </label>
        <Select
          id="role-select"
          options={roles.map((r) => ({ label: r.name, value: r.id }))}
          value={selectedRoleId ?? ""}
          onChange={(val) => setSelectedRoleId(val === "" ? null : Number(val))}
          placeholder="Select a role..."
        />
      </div>

      {!selectedRoleId ? (
        <p className="text-gray-600 italic">Please select a role to see asset permissions.</p>
      ) : (
        <DataTable<Asset>
          columns={columns}
          fetchPage={async (pageIndex, pageSize) => {
            const start = pageIndex * pageSize;
            const paginated = assets.slice(start, start + pageSize);
            return {
              data: paginated,
              total: assets.length,
            };
          }}
          pageSizes={[10, 20, 50]}
          initialPageSize={20}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};
