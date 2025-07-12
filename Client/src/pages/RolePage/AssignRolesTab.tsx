import React, { FC, useMemo, useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import EmployeeService from "@Services/EmployeeService";
import RoleService from "@Services/RoleService";
import { Spinner, ErrorMessage, TableWithStripedRows, AutocompleteInput, Select, Button, Modal } from "@Components/ExportComponent";
import { useAutocompleteFilter } from "@Hooks/useAutocompleteFilter";
import toast, { Toaster } from "react-hot-toast";
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import { RoleEntity } from "@Types/roleTypes";
import { Employee } from "@Types/employeeTypes";

export const AssignRolesTab: FC = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading: usersLoading, isError: usersError, refetch: refetchUsers } = useQuery<Employee[]>("users", EmployeeService.getAllUsers);
  const { data: roles = [], isLoading: rolesLoading, isError: rolesError, refetch: refetchRoles } = useQuery<RoleEntity[]>("roles", RoleService.getAll);
  const rawRows = useMemo(
    () =>
      users.map((u) => ({
        user_id: u.user_id,
        username: u.username,
        email: u.email,
      })),
    [users]
  );

  const { searchTerm, setSearchTerm, filteredRows } = useAutocompleteFilter(rawRows);
  const userRolesMap = useMemo(() => {
    return roles.reduce<Record<string, RoleEntity[]>>((map, role) => {
      role.UserRoles?.forEach(({ user_id }) => {
        if (!map[user_id]) map[user_id] = [];
        map[user_id].push(role);
      });
      return map;
    }, {});
  }, [roles]);

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries("users");
    queryClient.invalidateQueries("roles");
  }, [queryClient]);

  const assignRole = useMutation(({ userId, roleId }: { userId: string; roleId: number }) => RoleService.assignToUser(userId, roleId), {
    onSuccess: () => {
      invalidate();
      toast.success("Role assigned successfully");
      setSelectedRoleId(0);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error assigning role");
    },
  });

  const removeRole = useMutation(({ userId, roleId }: { userId: string; roleId: number }) => RoleService.revokeFromUser(userId, roleId), {
    onSuccess: () => {
      invalidate();
      toast.success("Role removed successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error removing role");
    },
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<number>(0);

  const openModal = useCallback((userId: string) => {
    setCurrentUserId(userId);
    setSelectedRoleId(0);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setCurrentUserId(null);
  }, []);

  const handleAdd = useCallback(() => {
    if (!currentUserId || !selectedRoleId) {
      toast.error("Select a role");
      return;
    }
    assignRole.mutate({ userId: currentUserId, roleId: selectedRoleId });
  }, [currentUserId, selectedRoleId, assignRole]);

  const handleRemove = useCallback(
    (roleId: number) => {
      if (!currentUserId) return;
      removeRole.mutate({ userId: currentUserId, roleId });
    },
    [currentUserId, removeRole]
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 15;
  const totalPages = useMemo(() => Math.ceil(filteredRows.length / rowsPerPage), [filteredRows.length]);
  const fullTableRows = useMemo(() => {
    return filteredRows.map((row) => ({
      "User ID": row.user_id,
      Username: row.username,
      Email: row.email,
      Roles: (
        <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
          {userRolesMap[row.user_id]?.map((r) => (
            <li key={r.role_id}>{r.role_name}</li>
          ))}
        </ul>
      ),
      Actions: (
        <Button className="bg-neutral-800 hover:bg-neutral-700 text-neutral-100 transition-colors" onClick={() => openModal(row.user_id)}>
          Manage Roles
        </Button>
      ),
    }));
  }, [filteredRows, userRolesMap, openModal]);
  const paginatedTableRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = currentPage * rowsPerPage;
    return fullTableRows.slice(start, end);
  }, [fullTableRows, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredRows]);

  // --------------------------------

  if (usersLoading || rolesLoading) {
    return <Spinner />;
  }

  if (usersError || rolesError) {
    return (
      <ErrorMessage
        retry={() => {
          refetchUsers();
          refetchRoles();
        }}
      />
    );
  }

  if (users.length === 0) {
    return <p className="text-neutral-500 dark:text-neutral-400">No users available.</p>;
  }

  const tableHead = ["User ID", "Username", "Email", "Roles", "Actions"];

  return (
    <div className="p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg transition-colors">
      <Toaster position="top-right" />

      <div className="flex justify-end mb-4">
        <AutocompleteInput rows={rawRows} value={searchTerm} onChange={setSearchTerm} placeholder="Search users..." className="w-64" />
      </div>

      <TableWithStripedRows tableHead={tableHead} tableRows={paginatedTableRows} page={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} rowsPerPage={rowsPerPage} />

      {modalOpen && currentUserId && (
        <Modal onClose={closeModal} className="bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button onClick={closeModal} className="absolute top-4 right-4 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-colors" aria-label="Close modal">
              <FaTimes size={20} />
            </button>
            <h2 className="text-2xl font-bold">Manage Roles</h2>
          </div>

          {/* Assigned Roles */}
          <section className="space-y-3 mt-6">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Assigned Roles</h3>
            {userRolesMap[currentUserId]?.length ? (
              <ul className="flex flex-wrap gap-2">
                {userRolesMap[currentUserId].map((r) => (
                  <li key={r.role_id} className="flex items-center bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-3 py-1 rounded-full space-x-2">
                    <span className="text-sm">{r.role_name}</span>
                    <button
                      onClick={() => handleRemove(r.role_id)}
                      disabled={removeRole.isLoading}
                      className="hover:bg-red-200 dark:hover:bg-red-700 p-1 rounded-full transition-colors text-red-600 dark:text-red-400"
                      aria-label={`Remove ${r.role_name}`}
                    >
                      <FaTrash size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-neutral-500 dark:text-neutral-400 italic">No roles assigned.</p>
            )}
          </section>

          {/* Add New Role */}
          <section className="mt-6">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Add New Role</h3>
            <div className="flex gap-3 items-center mt-2">
              <Select
                className="flex-1 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 transition-colors"
                value={selectedRoleId || ""}
                onChange={(e) => setSelectedRoleId(+e.target.value)}
              >
                <option value="">-- Select Role --</option>
                {roles
                  .filter((r) => !(userRolesMap[currentUserId] || []).some((uR) => uR.role_id === r.role_id))
                  .map((r) => (
                    <option key={r.role_id} value={r.role_id}>
                      {r.role_name}
                    </option>
                  ))}
              </Select>
              <Button
                onClick={handleAdd}
                disabled={assignRole.isLoading || !selectedRoleId}
                className="flex items-center space-x-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 transition-colors"
                aria-label="Add selected role"
              >
                <FaPlus size={16} />
                <span>Add</span>
              </Button>
            </div>
          </section>
        </Modal>
      )}
    </div>
  );
};

export default AssignRolesTab;
