import React, { FC, useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAutocompleteFilter } from "@Hooks/useAutocompleteFilter";
import RoleService from "@Services/RoleService";
import PermissionService from "@Services/PermissionService";
import { RoleEntity } from "@Types/roleTypes";
import { Permission, State } from "@Types/permissionTypes";
import { Spinner, ErrorMessage, AutocompleteInput, TableWithStripedRows, Switch, Select } from "@Components/ExportComponent";
import toast, { Toaster } from "react-hot-toast";

export const AssignPermissionsTab: FC = () => {
  const queryClient = useQueryClient();
  const [state, setState] = useState<State>({ selectedRole: null, permissions: [] });
  const { data: roles, isLoading: loadingRoles, isError: errorRoles, refetch: refetchRoles } = useQuery<RoleEntity[]>("roles-list", RoleService.getAll);
  const { data: allPerms, isLoading: loadingPerms, isError: errorPerms, refetch: refetchPerms } = useQuery<Permission[]>("permissions-list", PermissionService.getAll);
  const {
    data: assignedPerms,
    isLoading: loadingAssigned,
    isError: errorAssigned,
    refetch: refetchAssigned,
  } = useQuery<Permission[]>({
    queryKey: ["role-permissions", state.selectedRole],
    queryFn: () => PermissionService.getForRole(state.selectedRole!),
    enabled: state.selectedRole !== null,
  });

  const assignMutation = useMutation((permissionId: number) => PermissionService.assignToRole(state.selectedRole as number, permissionId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["role-permissions", state.selectedRole]);
      toast.success("Permission assigned");
    },
    onError: () => {
      toast.error("Failed to assign permission");
    },
    onSettled: () => {
      refetchRoles();
      refetchPerms();
      refetchAssigned();
      const c = document.querySelector("#scroll-container");
      if (c) c.scrollTop = c.scrollTop;
    },
  });

  const revokeMutation = useMutation((permissionId: number) => PermissionService.revokeFromRole(state.selectedRole as number, permissionId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["role-permissions", state.selectedRole]);
      toast.success("Permission revoked");
    },
    onError: () => {
      toast.error("Failed to revoke permission");
    },
    onSettled: () => {
      refetchRoles();
      refetchPerms();
      refetchAssigned();
      const c = document.querySelector("#scroll-container");
      if (c) c.scrollTop = c.scrollTop;
    },
  });

  const togglePermission = (permissionId: number, assign: boolean) => {
    if (!state.selectedRole) return toast.error("Please select a role first.");
    assign ? assignMutation.mutate(permissionId) : revokeMutation.mutate(permissionId);
  };

  useEffect(() => {
    if (allPerms && assignedPerms !== undefined) {
      const assignedIds = new Set(assignedPerms.map((p) => p.permission_id));
      const perms = allPerms.map((p) => ({
        permission_id: p.permission_id,
        key: p.permission_key,
        description: p.description || "",
        assigned: assignedIds.has(p.permission_id),
      }));
      setState((prev) => ({ ...prev, permissions: perms }));
    }
  }, [allPerms, assignedPerms]);

  useEffect(() => {
    if (roles && roles.length > 0) {
      const valid = roles.some((r) => r.role_id === state.selectedRole);
      if (!valid) setState((prev) => ({ ...prev, selectedRole: roles[0].role_id }));
    }
  }, [roles, state.selectedRole]);

  const rows = useMemo(
    () =>
      state.permissions.map((p) => ({
        permission_id: p.permission_id,
        key: p.key,
        description: p.description,
        assigned: p.assigned,
      })),
    [state.permissions]
  );
  const { searchTerm, setSearchTerm, filteredRows } = useAutocompleteFilter(rows);

  const tableHead = ["Permission ID", "Key", "Description", "Assigned"];
  const fullTableRows = useMemo(
    () =>
      filteredRows.map((p) => ({
        "Permission ID": p.permission_id,
        Key: p.key,
        Description: p.description,
        Assigned: <Switch checked={p.assigned} onChange={(checked) => togglePermission(p.permission_id, checked)} ariaLabel={`Toggle permission ${p.key}`} />,
      })),
    [filteredRows]
  );

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;
  const totalPages = useMemo(() => Math.ceil(fullTableRows.length / rowsPerPage), [fullTableRows.length]);
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = currentPage * rowsPerPage;
    return fullTableRows.slice(start, end);
  }, [fullTableRows, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredRows]);

  return (
    <div className="p-4 dark:bg-neutral-700 rounded-lg transition-colors">
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex flex-col">
          <label htmlFor="roleSelect" className="mb-1 font-semibold text-neutral-800 dark:text-neutral-100">
            Select Role
          </label>
          {loadingRoles ? (
            <Spinner />
          ) : errorRoles ? (
            <ErrorMessage retry={refetchRoles} />
          ) : (
            <Select
              id="roleSelect"
              className="border border-neutral-300 dark:border-neutral-700 rounded p-2 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 transition-colors"
              value={state.selectedRole ?? ""}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  selectedRole: e.target.value ? Number(e.target.value) : null,
                }))
              }
            >
              <option value="">-- Choose a role --</option>
              {roles!.map((role) => (
                <option key={role.role_id} value={role.role_id}>
                  {role.role_name}
                </option>
              ))}
            </Select>
          )}
        </div>

        <AutocompleteInput rows={rows} value={searchTerm} onChange={setSearchTerm} placeholder="Search permissions..." className="w-64" />
      </div>

      {state.selectedRole === null ? (
        <p className="text-neutral-500">Please select a role to manage permissions.</p>
      ) : loadingAssigned || loadingPerms ? (
        <Spinner />
      ) : errorAssigned || errorPerms ? (
        <ErrorMessage
          retry={() => {
            refetchAssigned();
            refetchPerms();
          }}
        />
      ) : fullTableRows.length === 0 ? (
        <p className="text-neutral-500">No matching permissions found.</p>
      ) : (
        <TableWithStripedRows tableHead={tableHead} tableRows={paginatedRows} page={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} rowsPerPage={rowsPerPage} />
      )}
    </div>
  );
};

export default AssignPermissionsTab;
