import React, { useState, useEffect } from "react";
import { useRolePermissionManager } from "@Hooks/admin/rbac/useRolePermissionManager";
import { usePermissionManager } from "@Hooks/admin/rbac/usePermissionManager";
import { Role, Permission } from "@Types/competency/rbacTypes";
import { Checkbox, Spinner, Toast } from "@Components/Common/ExportComponent";

interface RolePermissionManagerProps {
  role: Role | null;
}

export const RolePermissionManager: React.FC<RolePermissionManagerProps> = ({ role }) => {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "permissions">("info");
  const [togglingPermissionId, setTogglingPermissionId] = useState<number | null>(null);
  const handleToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
  };

  const { rolePermissionsQuery, assignPermissionToRole, revokePermissionFromRole } = useRolePermissionManager(role?.id ?? null, handleToast);

  const {
    permissionsQuery: { data: allPermissions = [], isLoading: isLoadingAllPermissions, isError: isErrorAllPermissions },
  } = usePermissionManager({ page: 1, perPage: 100 });

  const rolePermissions = rolePermissionsQuery.data || [];
  const isLoadingRolePermissions = rolePermissionsQuery.isLoading;
  const isErrorRolePermissions = rolePermissionsQuery.isError;

  // Effect to refetch role permissions and reset toggling state after mutation success
  useEffect(() => {
    if (assignPermissionToRole.isSuccess || revokePermissionFromRole.isSuccess) {
      rolePermissionsQuery.refetch();
      setTogglingPermissionId(null);
    }
    if (assignPermissionToRole.isError || revokePermissionFromRole.isError) {
      setTogglingPermissionId(null);
    }
  }, [assignPermissionToRole.isSuccess, revokePermissionFromRole.isSuccess, assignPermissionToRole.isError, revokePermissionFromRole.isError, rolePermissionsQuery]);

  // Function to handle toggling a permission
  const handleTogglePermission = (permission: Permission, checked: boolean) => {
    if (!role) {
      handleToast("No role selected to assign permissions to.", "info");
      return;
    }

    setTogglingPermissionId(permission.id);

    const mutationOptions = {
      onSuccess: () => {},
      onError: (error: any) => {
        handleToast(`Failed to ${checked ? "assign" : "revoke"} permission: ${error.message || "Unknown error"}`, "error");
      },
    };

    if (checked) {
      assignPermissionToRole.mutate({ roleId: role.id, permissionId: permission.id }, mutationOptions);
    } else {
      revokePermissionFromRole.mutate({ roleId: role.id, permissionId: permission.id }, mutationOptions);
    }
  };

  if (!role) {
    return <p className="text-gray-500 italic mt-4">Select a role from the list to manage its permissions.</p>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto border rounded-lg shadow-sm mt-6 bg-white">
      {/* Tab headers */}
      <div className="flex border-b mb-4 space-x-6">
        <button className={`pb-2 border-b-4 ${activeTab === "info" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600"} font-semibold`} onClick={() => setActiveTab("info")}>
          Role Info
        </button>
        <button
          className={`pb-2 border-b-4 ${activeTab === "permissions" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600"} font-semibold`}
          onClick={() => setActiveTab("permissions")}
        >
          Permissions
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "info" && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Role Information</h2>
          <p className="mb-2">
            <strong>Role Name:</strong> <span className="font-mono text-lg">{role.name}</span>
          </p>
          <p className="mb-2">
            <strong>Description:</strong> <span className="text-gray-700">{role.description || "No description provided."}</span>
          </p>
          {/* You might add other role details here, e.g., creation date, etc. */}
        </section>
      )}

      {activeTab === "permissions" && (
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Manage Permissions for Role: <span className="font-mono">{role.name}</span>
          </h2>

          {/* Combined loading and error handling for permissions */}
          {isLoadingAllPermissions || isLoadingRolePermissions ? (
            <Spinner />
          ) : isErrorAllPermissions ? (
            <p className="text-red-500">Error loading all permissions. Please try again.</p>
          ) : isErrorRolePermissions ? (
            <p className="text-red-500">Error loading role's permissions. Please try again.</p>
          ) : allPermissions.length === 0 ? (
            <p className="text-gray-500 italic">No permissions available to assign.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[400px] overflow-auto pr-2">
              {" "}
              {/* Added max-height and overflow */}
              {allPermissions.map((permission) => {
                const isAssigned = rolePermissions.some((p) => p.id === permission.id);
                const isTogglingThisPermission = togglingPermissionId === permission.id;
                const isAnyMutationPending = assignPermissionToRole.isPending || revokePermissionFromRole.isPending;

                return (
                  <label key={permission.id} className="flex items-center gap-2 cursor-pointer select-none">
                    <Checkbox checked={isAssigned} onCheckedChange={(checked) => handleTogglePermission(permission, checked as boolean)} disabled={isTogglingThisPermission || isAnyMutationPending} />

                    <span>{permission.key}</span>
                    {isTogglingThisPermission && <Spinner />}
                  </label>
                );
              })}
            </div>
          )}
        </section>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};
