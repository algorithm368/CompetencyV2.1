import React, { useState } from "react";
import { useUserRoleManager } from "@Hooks/admin/rbac/useUserRoleManager";
import { useUsers } from "@Hooks/competency/rbac/useUsers";
import { useRoles } from "@Hooks/competency/rbac";
import { User, Role } from "@Types/competency/rbacTypes";
import { Spinner, Toast, Button, Select } from "@Components/Common/ExportComponent";

export const UserRoleAssignment: React.FC = () => {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const { data: users = [], isLoading: isLoadingUsers } = useUsers({ page: 1, perPage: 100 });
  const { data: roles = [], isLoading: isLoadingRoles } = useRoles({ page: 1, perPage: 100 });

  const { userRolesQuery, assignRoleToUser, revokeRoleFromUser } = useUserRoleManager(handleToast);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  function handleToast(message: string, type: "success" | "error" | "info" = "info") {
    setToast({ message, type });
  }

  if (isLoadingUsers || isLoadingRoles || userRolesQuery.isLoading) {
    return <Spinner />;
  }

  const userRoles = userRolesQuery.data || [];

  const handleAssignRole = () => {
    if (!selectedUserId || !selectedRoleId) {
      handleToast("Please select both User and Role.", "error");
      return;
    }
    assignRoleToUser.mutate({ userId: selectedUserId, roleId: selectedRoleId });
  };

  const handleRevokeRole = (userId: string, roleId: string) => {
    revokeRoleFromUser.mutate({ userId, roleId });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">User Role Assignment</h2>

      {/* Form Assign Role */}
      <div className="flex gap-4 items-center">
        <Select value={selectedUserId ?? ""} onChange={(e) => setSelectedUserId(e.target.value)} className="w-1/3" aria-label="Select User">
          <option value="" disabled>
            Select User
          </option>
          {users.map((user: User) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </Select>

        <Select value={selectedRoleId ?? ""} onChange={(e) => setSelectedRoleId(e.target.value)} className="w-1/3" aria-label="Select Role">
          <option value="" disabled>
            Select Role
          </option>
          {roles.map((role: Role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </Select>

        <Button onClick={handleAssignRole} disabled={assignRoleToUser.isPending}>
          Assign Role
        </Button>
      </div>

      {/* Table User + Assigned Roles */}
      <table className="w-full border-collapse border border-gray-300 text-left">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">User</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Roles Assigned</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const assignedRoles = userRoles
              .filter((ur) => ur.userId === user.id)
              .map((ur) => {
                const role = roles.find((r) => r.id === ur.roleId);
                return role ? { ...role, userRoleId: ur.id } : null;
              })
              .filter(Boolean);

            return (
              <tr key={user.id} className="even:bg-gray-50">
                <td className="border border-gray-300 p-2">{user.name}</td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">
                  {assignedRoles.length === 0 ? (
                    <span className="italic text-gray-500">No roles assigned</span>
                  ) : (
                    assignedRoles.map((role: Role & { userRoleId?: string }) => (
                      <span key={role.id} className="inline-flex items-center bg-blue-100 text-blue-800 rounded px-2 py-1 mr-2 mb-1">
                        {role.name}
                        <button
                          className="ml-2 text-red-500 hover:text-red-700"
                          onClick={() => handleRevokeRole(user.id, role.id)}
                          disabled={revokeRoleFromUser.isPending}
                          aria-label={`Revoke role ${role.name} from user ${user.name}`}
                        >
                          &times;
                        </button>
                      </span>
                    ))
                  )}
                </td>
                <td className="border border-gray-300 p-2">{/* อาจเพิ่ม action อื่น ๆ ในอนาคต */}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};
