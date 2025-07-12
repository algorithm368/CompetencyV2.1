import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAutocompleteFilter } from "@Hooks/useAutocompleteFilter";
import { TableWithStripedRows, AutocompleteInput, Button, Spinner, ErrorMessage } from "@Components/ExportComponent";
import { PlusIcon } from "@heroicons/react/24/outline";
import PermissionService from "@Services/PermissionService";
import toast, { Toaster } from "react-hot-toast";
import { CreatePermissionModal } from "./CreatePermissionModal";
import { TableRow } from "@Types/tableTypes";

export function PermissionsTab() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery<{
    tableHead: string[];
    tableRows: Record<string, string | number | null>[];
  }>("permissions-table", PermissionService.getTableData);
  const { searchTerm, setSearchTerm, filteredRows } = useAutocompleteFilter(data?.tableRows || []);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 10;
  const totalPages = useMemo(() => Math.ceil(filteredRows.length / rowsPerPage), [filteredRows.length]);
  const paginatedRows = useMemo(() => filteredRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage), [filteredRows, currentPage]);
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredRows]);

  const [showModal, setShowModal] = useState(false);
  const updatePerm = useMutation(({ id, payload }: { id: number; payload: { permission_key: string; description?: string } }) => PermissionService.update(id, payload), {
    onSuccess: () => {
      queryClient.invalidateQueries("permissions-table");
      toast.success("Permission updated successfully!");
    },
    onError: () => {
      toast.error("Permission update failed");
    },
  });
  const deletePerm = useMutation((id: number) => PermissionService.delete(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("permissions-table");
      toast.success("Permission deleted successfully!");
    },
    onError: () => {
      toast.error("Permission deletion failed");
    },
  });
  const handleEditPermission = (row: TableRow) => {
    const rawId = row["Permission ID"];
    const id = Number(rawId);
    if (isNaN(id)) return toast.error("Invalid Permission ID");

    const permission_key = typeof row["Key"] === "string" ? row["Key"].trim() : undefined;
    const description = typeof row["Description"] === "string" ? row["Description"].trim() : undefined;

    if (!permission_key) {
      return toast.error("Permission key is required");
    }

    updatePerm.mutate({
      id,
      payload: {
        permission_key,
        description,
      },
    });
  };
  const handleDelete = (row: TableRow) => {
    const id = Number(row["Permission ID"]);
    if (isNaN(id)) return toast.error("Invalid Permission ID");
    deletePerm.mutate(id);
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-4">
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 transition-colors">
          <PlusIcon className="h-4 w-4" />
          Add Permission
        </Button>

        <AutocompleteInput
          rows={filteredRows.map((row) => Object.fromEntries(Object.entries(row).map(([key, value]) => [key, value ?? false])))}
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search permissions..."
          className="w-64"
        />
      </div>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <ErrorMessage retry={refetch} />
      ) : (
        <TableWithStripedRows
          tableHead={data?.tableHead || []}
          tableRows={paginatedRows}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          nonEditableFields={["Permission ID", "Key", "Created At"]}
          onEdit={(row) => handleEditPermission(row as TableRow)}
          onDelete={(row) => handleDelete(row as TableRow)}
        />
      )}

      {showModal && <CreatePermissionModal onClose={() => setShowModal(false)} />}
    </>
  );
}

export default PermissionsTab;
