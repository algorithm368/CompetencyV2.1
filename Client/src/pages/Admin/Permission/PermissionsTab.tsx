import React, { useState, useEffect, useMemo } from "react";
import { FiPlus, FiSearch, FiSettings } from "react-icons/fi";
import { Button, Input, Toast, DataTable } from "@Components/Common/ExportComponent";
import CreatePermissionModal from "./CreatePermissionModal";
import { usePermissionManager } from "@Hooks/admin/usePermissions";
import type { ColumnDef } from "@tanstack/react-table";
import type { Permission } from "@Types/competency/permissionTypes";

const PermissionsTab = () => {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchText(searchText), 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  // reset page when search changes
  useEffect(() => setPage(1), [debouncedSearchText]);

  // toast handler
  const handleToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
  };

  // use custom hook to manage permissions
  const { permissionsQuery, fetchPage, createPermission, updatePermission, deletePermission } = usePermissionManager({ search: debouncedSearchText, page, perPage }, handleToast);

  const columns = useMemo<ColumnDef<Permission>[]>(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "key", header: "Key" },
      { accessorKey: "description", header: "Description" },
      {
        id: "actions",
        header: () => (
          <span style={{ float: "right" }}>
            <FiSettings />
          </span>
        ),
        cell: ({ row }) => <div className="text-right"></div>,
      },
    ],
    []
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 z-10">
        <h2 className="text-xl font-semibold mb-2 sm:mb-0">Permissions</h2>
        <div className="flex flex-col items-end space-y-2">
          <Button size="md" onClick={() => setShowCreateModal(true)} className="flex items-center">
            <FiPlus className="mr-2" /> Add Permission
          </Button>
          <div className="relative">
            <Input placeholder="Search permissions..." className="pl-3 pr-10 py-1 text-sm" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            <FiSearch className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      <DataTable<Permission>
        key={debouncedSearchText + page}
        resetTrigger={debouncedSearchText + page}
        fetchPage={fetchPage}
        columns={columns}
        pageSizes={[5, 10, 20]}
        initialPageSize={perPage}
        onPageChange={(newPage) => setPage(newPage + 1)}
      />

      {showCreateModal && (
        <CreatePermissionModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            handleToast("Permission created successfully", "success");
            permissionsQuery.refetch();
          }}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
};

export default PermissionsTab;
