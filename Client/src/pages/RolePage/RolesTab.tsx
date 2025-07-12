import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAutocompleteFilter } from "@Hooks/useAutocompleteFilter";
import { TableWithStripedRows, AutocompleteInput, Button, Spinner, ErrorMessage } from "@Components/ExportComponent";
import { PlusIcon } from "@heroicons/react/24/outline";
import RoleService from "@Services/RoleService";
import toast from "react-hot-toast";
import { CreateRoleModal } from "./CreateRoleModal";
import { TableRow } from "@Types/tableTypes";
import { RoleEntity } from "@Types/roleTypes";

export function RolesTab() {
  const queryClient = useQueryClient();

  const fetchRoleTable = async () => {
    const roles: RoleEntity[] = await RoleService.getAll();

    const tableHead = ["Role ID", "Role Name", "Description", "Created At"];
    const tableRows = roles.map((role) => ({
      "Role ID": role.role_id,
      "Role Name": role.role_name,
      Description: role.description,
      "Created At": role.created_at,
    }));

    return { tableHead, tableRows };
  };

  const { data: tableData, isLoading, isError, refetch } = useQuery("roles-table", fetchRoleTable);
  const rows = tableData?.tableRows || [];
  const tableHead = tableData?.tableHead || [];
  const { searchTerm, setSearchTerm, filteredRows } = useAutocompleteFilter(rows);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 10;
  const totalPages = useMemo(() => Math.ceil(filteredRows.length / rowsPerPage), [filteredRows.length]);
  const paginatedRows = useMemo(() => filteredRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage), [filteredRows, currentPage]);

  const [showModal, setShowModal] = useState(false);

  const updateRole = useMutation(
    ({ id, payload }: { id: number; payload: { roleName: string; description?: string } }) =>
      RoleService.update(id, {
        roleName: payload.roleName,
        description: payload.description,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("roles-table");
        toast.success("Role updated successfully!");
        setShowModal(false);
      },
      onError: () => {
        toast.error("Role update failed");
      },
    }
  );

  const deleteRole = useMutation((id: number) => RoleService.delete(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("roles-table");
      toast.success("Role deleted successfully!");
    },
    onError: () => {
      toast.error("Role deletion failed");
    },
  });

  const handleEdit = (row: TableRow) => {
    const rawId = row["Role ID"];
    const id = Number(rawId);
    if (isNaN(id)) return toast.error("Invalid Role ID");

    const roleName = typeof row["Role Name"] === "string" ? row["Role Name"].trim() : "";
    const description = typeof row.Description === "string" ? row.Description.trim() : undefined;

    updateRole.mutate({
      id,
      payload: {
        roleName,
        description,
      },
    });
  };

  const handleDelete = (row: TableRow) => {
    const rawId = row["Role ID"];
    const id = Number(rawId);
    if (isNaN(id)) {
      toast.error("Invalid Role ID");
      return;
    }
    deleteRole.mutate(id);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 transition-colors">
          <PlusIcon className="h-4 w-4" /> Add Role
        </Button>
        <AutocompleteInput rows={filteredRows} value={searchTerm} onChange={setSearchTerm} placeholder="Search suppliers..." className="w-64" />
      </div>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <ErrorMessage retry={refetch} />
      ) : (
        <TableWithStripedRows
          tableHead={tableHead}
          tableRows={paginatedRows}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          nonEditableFields={["Role ID", "Created At"]}
          onEdit={(row) => handleEdit(row as TableRow)}
          onDelete={(row) => handleDelete(row as TableRow)}
        />
      )}

      {showModal && <CreateRoleModal onClose={() => setShowModal(false)} />}
    </>
  );
}

export default RolesTab;
