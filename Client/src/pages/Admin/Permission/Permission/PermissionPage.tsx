import React, { useState, useMemo, useEffect } from "react";
import { FiPlus, FiSearch, FiSettings } from "react-icons/fi";
import { RowActions, Button, Input, Toast, DataTable } from "@Components/Common/ExportComponent";
import { usePermissionManager } from "@Hooks/competency/rbac/usePermissionManager";
import { Permission, CreatePermissionDto, UpdatePermissionDto } from "@Types/competency/rbacTypes";
import { AddEditPermissionModal, DeletePermissionModal } from "./PermissionModals";

export default function PermissionPage() {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [modalType, setModalType] = useState<"add" | "edit" | "delete" | null>(null);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchText(searchText), 500);
    return () => clearTimeout(handler);
  }, [searchText]);

  useEffect(() => setPage(1), [debouncedSearchText]);

  const handleToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
  };

  const { fetchPage, permissionsQuery, createPermission, updatePermission, deletePermission } = usePermissionManager({ search: debouncedSearchText, page, perPage }, handleToast);

  // Modal handlers
  const openAddModal = () => {
    setSelectedPermission(null);
    setModalType("add");
  };

  const openEditModal = (permission: Permission) => {
    setSelectedPermission(permission);
    setModalType("edit");
  };

  const openDeleteModal = (permission: Permission) => {
    setSelectedPermission(permission);
    setModalType("delete");
  };

  const closeModal = () => {
    setSelectedPermission(null);
    setModalType(null);
  };

  // Confirmation handlers for CUD operations
  const confirmAdd = (text: string, key: string) => {
    const dto: CreatePermissionDto = { key, description: text || undefined };
    createPermission.mutate(dto, {
      onSuccess: () => {
        handleToast("Permission created successfully!", "success");
        closeModal();
        permissionsQuery.refetch();
      },
    });
  };

  const confirmEdit = (text: string, key: string) => {
    if (!selectedPermission) return;
    const dto: UpdatePermissionDto = { key, description: text || undefined };
    updatePermission.mutate(
      { id: selectedPermission.id, data: dto },
      {
        onSuccess: () => {
          handleToast("Permission updated successfully!", "success");
          closeModal();
          permissionsQuery.refetch();
        },
      }
    );
  };

  const confirmDelete = () => {
    if (!selectedPermission) return;
    deletePermission.mutate(selectedPermission.id, {
      onSuccess: () => {
        handleToast("Permission deleted successfully!", "success");
        closeModal();
        permissionsQuery.refetch();
      },
    });
  };

  // Define columns for the DataTable
  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "key", header: "Permission Key" },
      { accessorKey: "description", header: "Description" },
      {
        id: "actions",
        header: () => (
          <span className="float-right">
            <FiSettings />
          </span>
        ),
        cell: ({ row }: { row: { original: Permission } }) => (
          <div className="text-right">
            <RowActions onEdit={() => openEditModal(row.original)} onDelete={() => openDeleteModal(row.original)} />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 z-10">
        <h1 className="text-3xl font-Poppins mb-2 sm:mb-0">Permissions</h1>
        <div className="flex flex-col items-end space-y-2">
          <Button size="md" onClick={openAddModal} className="flex items-center">
            <FiPlus className="mr-2" /> Add Permission
          </Button>
          <div className="relative">
            <Input type="text" placeholder="Search permissions..." className="pl-3 pr-30 py-1 text-sm" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            <FiSearch className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      <DataTable<Permission>
        key={debouncedSearchText}
        resetTrigger={debouncedSearchText}
        fetchPage={fetchPage}
        columns={columns}
        pageSizes={[5, 10, 20]}
        initialPageSize={perPage}
        onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
      />

      <AddEditPermissionModal
        isOpen={modalType === "add" || modalType === "edit"}
        mode={modalType === "edit" ? "edit" : "add"}
        initialText={selectedPermission?.description || ""}
        initialPermissionKey={selectedPermission?.key || ""}
        initialPermissionId={selectedPermission?.id ?? null}
        onClose={closeModal}
        onConfirm={(text, key) => (modalType === "add" ? confirmAdd(text, key) : confirmEdit(text, key))}
        isLoading={createPermission.status === "pending" || updatePermission.status === "pending"}
      />

      <DeletePermissionModal
        isOpen={modalType === "delete"}
        permissionText={selectedPermission?.description ?? undefined}
        onClose={closeModal}
        onConfirm={confirmDelete}
        isLoading={deletePermission.status === "pending"}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
