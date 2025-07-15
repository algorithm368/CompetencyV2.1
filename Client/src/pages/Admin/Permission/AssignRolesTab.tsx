import React, { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, Switch, Toast, Input } from "@Components/Common/ExportComponent";
import { RoleEntity } from "@Types/competency/roleTypes";
import { useRoleManager } from "@Hooks/admin/useRoleManager";

type ToastType = "success" | "error" | "info";

const AssignRolesTab = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [roles, setRoles] = useState<(RoleEntity & { assigned?: boolean })[]>([]);
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

  const { getRolesForUser, assignRoleToUser, revokeRoleFromUser, rolesQuery } = useRoleManager({}, showToast);

  useEffect(() => {
    if (!selectedUser) return;

    const userId = Number(selectedUser);
    if (isNaN(userId)) {
      showToast("Invalid user ID", "error");
      return;
    }

    Promise.all([getRolesForUser(userId), rolesQuery.refetch()])
      .then(([userRoles, allRolesResult]) => {
        const assignedIds = new Set(userRoles.map((r) => r.id));
        const allRoles = allRolesResult.data?.data ?? [];

        const merged = allRoles.map((r) => ({
          ...r,
          assigned: assignedIds.has(r.id),
          description: r.description ?? "",
        }));

        setRoles(merged);
        setResetTrigger((v) => v + 1);
      })
      .catch(() => {
        showToast("Failed to load roles", "error");
      });
  }, [selectedUser]);

  const toggleRole = async (roleId: number, assign: boolean) => {
    if (!selectedUser) {
      showToast("Select user first", "error");
      return;
    }

    const userId = selectedUser;

    try {
      if (assign) {
        await assignRoleToUser(userId, roleId);
        showToast("Role assigned", "success");
      } else {
        await revokeRoleFromUser(userId, roleId);
        showToast("Role revoked", "success");
      }
      // Refresh data after change
      setResetTrigger((v) => v + 1);
    } catch {
      showToast("Action failed", "error");
    }
  };

  const columns: ColumnDef<RoleEntity & { assigned?: boolean }>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "description", header: "Description" },
    {
      id: "assigned",
      header: "Assigned",
      cell: ({ row }) => <Switch checked={!!row.original.assigned} onChange={(checked) => toggleRole(row.original.id, checked)} aria-label={`Toggle role ${row.original.name}`} />,
      meta: { align: "center" },
    },
  ];

  return (
    <div>
      <label className="block mb-2 font-semibold">Select User ID:</label>
      <Input type="text" className="mb-4 p-2 border rounded" value={selectedUser ?? ""} onChange={(e) => setSelectedUser(e.target.value || null)} placeholder="Enter user ID" />

      <DataTable
        fetchPage={async (pageIndex, pageSize) => {
          const start = pageIndex * pageSize;
          const pageData = roles.slice(start, start + pageSize);
          return { data: pageData, total: roles.length };
        }}
        columns={columns}
        resetTrigger={resetTrigger}
      />

      {toastVisible && <Toast message={toastMessage} type={toastType} onClose={handleToastClose} />}
    </div>
  );
};

export default AssignRolesTab;
