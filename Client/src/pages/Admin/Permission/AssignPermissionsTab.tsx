import React, { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Switch, DataTable, Toast, Input } from "@Components/Common/ExportComponent";
import { PermissionRow } from "@Types/competency/permissionTypes";
import { usePermissionManager } from "@Hooks/admin/usePermissions";
import { useRoleManager } from "@Hooks/admin/useRoleManager";

type ToastType = "success" | "error" | "info";

const AssignPermissionsTab = () => {
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [permissions, setPermissions] = useState<PermissionRow[]>([]);
  const [resetTrigger, setResetTrigger] = useState(0);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<ToastType>("info");
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (message: string, type: ToastType = "info") => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const handleToastClose = () => setToastVisible(false);

  const { assignPermissionToRole, revokePermissionFromRole, getPermissionsForRole, permissionsQuery } = usePermissionManager(undefined, showToast);
  const { rolesQuery } = useRoleManager({}, showToast);

  // Log rolesQuery data
  useEffect(() => {
    if (!selectedRole && rolesQuery.data?.data?.length) {
      setSelectedRole(rolesQuery.data.data[0].id);
    }
  }, [rolesQuery.data, selectedRole]);

  // Load permissions for selectedRole
  useEffect(() => {
    if (!selectedRole) return;

    Promise.all([getPermissionsForRole(selectedRole), permissionsQuery.refetch()])
      .then(([assigned, allResult]) => {
        // ตรวจสอบ assigned มี permissionId หรือ permission.id
        const assignedIds = new Set(
          assigned
            .map((p) => {
              if (p.permissionId) return p.permissionId;
              if (p.permission?.id) return p.permission.id;
              return null;
            })
            .filter(Boolean) as number[]
        );

        const allPermissions = allResult.data?.data || [];

        const merged: PermissionRow[] = allPermissions.map((p) => {
          const isAssigned = assignedIds.has(p.id);

          return {
            ...p,
            assigned: isAssigned,
            description: p.description ?? "",
          };
        });

        setPermissions(merged);
        setResetTrigger((v) => v + 1);
      })
      .catch(() => {
        showToast("Failed to load permissions", "error");
      });
  }, [selectedRole]);

  const togglePermission = async (permissionId: number, assign: boolean) => {
    if (!selectedRole) {
      showToast("Select a role first", "error");
      return;
    }

    try {
      if (assign) {
        await assignPermissionToRole(selectedRole, permissionId);
        showToast("Permission assigned", "success");
      } else {
        await revokePermissionFromRole(selectedRole, permissionId);
        showToast("Permission revoked", "success");
      }
      setResetTrigger((v) => v + 1);
    } catch {
      showToast("Action failed", "error");
    }
  };

  const columns: ColumnDef<PermissionRow>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "key", header: "Key" },
    { accessorKey: "description", header: "Description" },
    {
      id: "assigned",
      header: "Assigned",
      cell: ({ row }) => <Switch checked={row.original.assigned} onChange={(checked) => togglePermission(row.original.id, checked)} aria-label={`Toggle permission ${row.original.key}`} />,
      meta: { align: "center" },
    },
  ];

  return (
    <div>
      <label className="block mb-2 font-semibold">Select Role ID:</label>
      <Input type="number" className="mb-4 p-2 border rounded" value={selectedRole ?? ""} onChange={(e) => setSelectedRole(e.target.value ? +e.target.value : null)} placeholder="Enter role ID" />

      {permissions.length === 0 ? (
        <p className="p-4 text-center text-gray-500">Loading permissions...</p>
      ) : (
        <DataTable
          fetchPage={async (pageIndex, pageSize) => {
            console.log("AssignPermissionsTab fetchPage called", { pageIndex, pageSize, permissionsLength: permissions.length });
            const start = pageIndex * pageSize;
            const pageData = permissions.slice(start, start + pageSize);
            console.log("Page data to show:", pageData);
            return { data: pageData, total: permissions.length };
          }}
          columns={columns}
          resetTrigger={resetTrigger}
        />
      )}

      {toastVisible && <Toast message={toastMessage} type={toastType} onClose={handleToastClose} />}
    </div>
  );
};

export default AssignPermissionsTab;
