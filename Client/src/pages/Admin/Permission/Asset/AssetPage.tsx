import React, { useState, useMemo, useEffect } from "react";
import { FiPlus, FiSearch, FiSettings } from "react-icons/fi";
import { RowActions, Button, Input, Toast, DataTable } from "@Components/Common/ExportComponent";
import { useAssetManager } from "@Hooks/admin/rbac/useAssetManager";
import { Asset, CreateAssetDto, UpdateAssetDto } from "@Types/competency/rbacTypes";
import { AddEditAssetModal, DeleteAssetModal } from "./AssetModal";

export default function AssetPage() {
  const [searchText, setSearchText] = useState<string>("");
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>("");
  const [modalType, setModalType] = useState<"add" | "edit" | "delete" | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Debounce search text
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchText(searchText), 500);
    return () => clearTimeout(handler);
  }, [searchText]);

  // Reset page to 1 when search text changes
  useEffect(() => setPage(1), [debouncedSearchText]);

  const handleToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
  };

  // Use useAssetManager hook
  const { fetchPage, assetsQuery, createAsset, updateAsset, deleteAsset } = useAssetManager({ search: debouncedSearchText, page, perPage }, handleToast);

  const openAddModal = () => {
    setSelectedAsset(null);
    setModalType("add");
  };
  const openEditModal = (asset: Asset) => {
    // Type as Asset
    setSelectedAsset(asset);
    setModalType("edit");
  };
  const openDeleteModal = (asset: Asset) => {
    // Type as Asset
    setSelectedAsset(asset);
    setModalType("delete");
  };
  const closeModal = () => {
    setModalType(null);
    setSelectedAsset(null);
  };

  const confirmAdd = (name: string, description?: string) => {
    const dto: CreateAssetDto = { name, description: description || undefined }; // Use CreateAssetDto
    createAsset.mutate(dto, {
      onSuccess: () => {
        handleToast("Asset created successfully!", "success");
        closeModal();
        assetsQuery.refetch();
      },
    });
  };

  const confirmEdit = (name: string, description?: string) => {
    if (!selectedAsset) return;
    const dto: UpdateAssetDto = { name, description: description || undefined }; // Use UpdateAssetDto
    updateAsset.mutate(
      { id: selectedAsset.id, data: dto },
      {
        onSuccess: () => {
          handleToast("Asset updated successfully!", "success");
          closeModal();
          assetsQuery.refetch();
        },
      }
    );
  };

  const confirmDelete = () => {
    if (!selectedAsset) return;
    deleteAsset.mutate(selectedAsset.id, {
      onSuccess: () => {
        handleToast("Asset deleted successfully!", "success");
        closeModal();
        assetsQuery.refetch();
      },
    });
  };

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "tableName", header: "Asset Name" },
      { accessorKey: "description", header: "Description" },
      {
        id: "actions",
        header: () => (
          <span style={{ float: "right" }}>
            <FiSettings />
          </span>
        ),
        cell: ({ row }: { row: { original: Asset } }) => (
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
        <h1 className="text-3xl font-Poppins mb-2 sm:mb-0">Assets</h1>
        <div className="flex flex-col items-end space-y-2">
          <Button size="md" onClick={openAddModal} className="flex items-center">
            <FiPlus className="mr-2" /> Add Asset
          </Button>
          <div className="relative">
            <Input type="text" placeholder="Search assets..." className="pl-3 pr-30 py-1 text-sm" value={searchText} onChange={(e) => setSearchText(e.target.value)} /> {/* Changed placeholder */}
            <FiSearch className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      <DataTable<Asset>
        key={debouncedSearchText}
        resetTrigger={debouncedSearchText}
        fetchPage={fetchPage}
        columns={columns}
        pageSizes={[5, 10, 20]}
        initialPageSize={perPage}
        onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
      />

      <AddEditAssetModal
        isOpen={modalType === "add" || modalType === "edit"}
        mode={modalType === "edit" ? "edit" : "add"}
        initialAsset={selectedAsset}
        onClose={closeModal}
        onConfirm={(name, description) => (modalType === "add" ? confirmAdd(name, description) : confirmEdit(name, description))}
        isLoading={createAsset.status === "pending" || updateAsset.status === "pending"}
      />

      <DeleteAssetModal isOpen={modalType === "delete"} assetText={selectedAsset?.name ?? undefined} onClose={closeModal} onConfirm={confirmDelete} isLoading={deleteAsset.status === "pending"} />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
