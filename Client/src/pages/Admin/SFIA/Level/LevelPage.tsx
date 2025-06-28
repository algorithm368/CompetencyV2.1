import React, { useState, useMemo, useEffect } from "react";
import { FiPlus, FiSearch, FiSettings } from "react-icons/fi";
import { DataTable, RowActions, Button, Input, Toast } from "@Components/Common/ExportComponent";
import { AdminLayout } from "@Layouts/AdminLayout";
import { useLevelManager } from "@Hooks/admin/sfia/useLevelHooks";
import { Levels, CreateLevelDto, UpdateLevelDto, LevelPageResult } from "@Types/sfia/levelTypes";
import { AddEditLevelModal, DeleteLevelModal } from "./LevelModals";

export default function LevelTablePage() {
  const [searchText, setSearchText] = useState<string>("");
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>("");
  const [modalType, setModalType] = useState<"add" | "edit" | "delete" | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Levels | null>(null);
  const [items, setItems] = useState<Levels[]>([]);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const handleToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
  };

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchText]);

  const { levelsQuery, createLevel, updateLevel, deleteLevel } = useLevelManager({ search: debouncedSearchText }, handleToast);
  const { isLoading, isError, error, refetch } = levelsQuery;

  useEffect(() => {
    const q = levelsQuery.data;
    if (!q) return;
    if ("pages" in q && Array.isArray(q.pages)) {
      const all = q.pages.flatMap((pg: LevelPageResult) => pg.data);
      setItems(all);
    } else if ("data" in q && Array.isArray(q.data)) {
      setItems(q.data);
    }
  }, [levelsQuery.data]);

  const openAddModal = () => {
    setSelectedLevel(null);
    setModalType("add");
  };
  const openEditModal = (level: Levels) => {
    setSelectedLevel(level);
    setModalType("edit");
  };
  const openDeleteModal = (level: Levels) => {
    setSelectedLevel(level);
    setModalType("delete");
  };
  const closeModal = () => {
    setModalType(null);
    setSelectedLevel(null);
  };

  const confirmAdd = (levelName: string, codeJob: string) => {
    const dto: CreateLevelDto = {
      level_name: levelName || null,
      code_job: codeJob || null,
    };
    createLevel.mutate(dto, {
      onSuccess: () => {
        handleToast("Created successfully", "success");
        closeModal();
        refetch();
      },
      onError: (error) => {
        handleToast("Failed to create: " + (error?.message ?? ""), "error");
      },
    });
  };

  const confirmEdit = (levelName: string, codeJob: string) => {
    if (!selectedLevel) return;
    const dto: UpdateLevelDto = {
      level_name: levelName,
      code_job: codeJob,
    };
    updateLevel.mutate(
      { id: selectedLevel.id, data: dto },
      {
        onSuccess: () => {
          handleToast("Updated successfully", "success");
          closeModal();
          refetch();
        },
        onError: (error) => {
          handleToast("Failed to update: " + (error?.message ?? ""), "error");
        },
      }
    );
  };

  const confirmDelete = () => {
    if (!selectedLevel) return;
    deleteLevel.mutate(selectedLevel.id, {
      onSuccess: () => {
        handleToast("Deleted successfully", "success");
        closeModal();
        refetch();
      },
      onError: (error) => {
        handleToast("Failed to delete: " + (error?.message ?? ""), "error");
      },
    });
  };

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "level_name", header: "Level Name" },
      { accessorKey: "code_job", header: "Job Code" },
      {
        id: "actions",
        header: () => <FiSettings className="text-lg" />,
        cell: ({ row }: { row: { original: Levels } }) => (
          <RowActions
            onEdit={() => openEditModal(row.original)}
            onDelete={() => openDeleteModal(row.original)}
          />
        ),
      },
    ],
    []
  );

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 z-10">
        <h1 className="text-3xl font-Poppins mb-2 sm:mb-0">Levels</h1>

        <div className="flex flex-col items-end space-y-2">
          <Button size="md" onClick={openAddModal} className="flex items-center">
            <FiPlus className="mr-2" /> Add Level
          </Button>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search levels..."
              className="pl-3 pr-30 py-1 text-sm"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <FiSearch className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      <DataTable<Levels>
        data={items}
        columns={columns}
        pageSizes={[5, 10, 20]}
        initialPageSize={10}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message || "An error occurred while fetching data"}
        onRetry={() => refetch()}
      />

      <AddEditLevelModal
        isOpen={modalType === "add" || modalType === "edit"}
        mode={modalType === "edit" ? "edit" : "add"}
        initialText={selectedLevel?.level_name || ""}
        initialCodeJob={selectedLevel?.code_job || ""}
        onClose={closeModal}
        onConfirm={(levelName, codeJob) =>
          modalType === "add"
            ? confirmAdd(levelName ?? "", codeJob ?? "")
            : confirmEdit(levelName ?? "", codeJob ?? "")
        }
        isLoading={createLevel.status === "pending" || updateLevel.status === "pending"}
      />

      <DeleteLevelModal
        isOpen={modalType === "delete"}
        levelName={selectedLevel?.level_name ?? undefined}
        onClose={closeModal}
        onConfirm={confirmDelete}
        isLoading={deleteLevel.status === "pending"}
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </AdminLayout>
  );
}
