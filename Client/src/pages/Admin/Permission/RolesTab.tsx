import React, { useState, useEffect, useMemo } from "react";
import { FiPlus, FiSettings } from "react-icons/fi";
import { RowActions, Button, Toast, DataTable } from "@Components/Common/ExportComponent";
import { useRoleManager } from "@Hooks/admin/useRoleManager";
import type { ColumnDef } from "@tanstack/react-table";
import { RoleEntity, CreateRoleDto, UpdateRoleDto } from "@Types/competency/roleTypes";
import { CreateEditRoleModal, DeleteRoleModal } from "./CreateEditRoleModal";

const RolesTab = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>("");
  const [modalType, setModalType] = useState<"add" | "edit" | "delete" | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleEntity | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchText(searchText), 500);
    return () => clearTimeout(handler);
  }, [searchText]);

  // reset page when search changes
  useEffect(() => setPage(1), [debouncedSearchText]);

  // toast helper
  const handleToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
  };

  const { fetchPage, rolesQuery, createRole, updateRole, deleteRole } = useRoleManager({ search: debouncedSearchText, page, perPage }, handleToast);

  const openAddModal = () => {
    setSelectedRole(null);
    setModalType("add");
  };
  const openEditModal = (role: RoleEntity) => {
    setSelectedRole(role);
    setModalType("edit");
  };
  const openDeleteModal = (role: RoleEntity) => {
    setSelectedRole(role);
    setModalType("delete");
  };
  const closeModal = () => {
    setModalType(null);
    setSelectedRole(null);
  };

  const confirmAdd = (dto: CreateRoleDto) => {
    createRole.mutate(dto, {
      onSuccess: () => {
        handleToast("Role created successfully", "success");
        closeModal();
        rolesQuery.refetch();
      },
      onError: (error) => handleToast("Failed to create role: " + error.message, "error"),
    });
  };

  const confirmEdit = (dto: UpdateRoleDto) => {
    if (!selectedRole) return;
    updateRole.mutate(dto, {
      onSuccess: () => {
        handleToast("Role updated successfully", "success");
        closeModal();
        rolesQuery.refetch();
      },
      onError: (error) => handleToast("Failed to update role: " + error.message, "error"),
    });
  };

  const confirmDelete = () => {
    if (!selectedRole) return;
    deleteRole.mutate(selectedRole.id, {
      onSuccess: () => {
        handleToast("Role deleted successfully", "success");
        closeModal();
        rolesQuery.refetch();
      },
      onError: (error) => handleToast("Failed to delete role: " + error.message, "error"),
    });
  };

  const columns = useMemo<ColumnDef<RoleEntity>[]>(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "description", header: "Description" },
      {
        id: "actions",
        header: () => (
          <span style={{ float: "right" }}>
            <FiSettings />
          </span>
        ),
        cell: ({ row }) => (
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
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Roles</h2>
        <Button className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={openAddModal}>
          <FiPlus className="mr-1" /> Add Role
        </Button>
      </div>

      <DataTable<RoleEntity>
        key={debouncedSearchText + page}
        resetTrigger={debouncedSearchText + page}
        fetchPage={fetchPage}
        columns={columns}
        pageSizes={[5, 10, 20]}
        initialPageSize={perPage}
        onPageChange={(newPage) => setPage(newPage + 1)}
      />

      {(modalType === "add" || modalType === "edit") && (
        <CreateEditRoleModal
          isOpen={true}
          mode={modalType}
          initialData={modalType === "edit" ? selectedRole : null}
          onClose={closeModal}
          onConfirm={(data) => (modalType === "add" ? confirmAdd(data) : confirmEdit(data))}
        />
      )}

      {modalType === "delete" && <DeleteRoleModal isOpen={true} roleName={selectedRole?.name ?? ""} onClose={closeModal} onConfirm={confirmDelete} isLoading={deleteRole.isLoading} />}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
};

export default RolesTab;
