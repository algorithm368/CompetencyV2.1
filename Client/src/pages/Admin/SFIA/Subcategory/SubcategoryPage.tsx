import React, { useState, useMemo, useEffect } from "react";
import { FiPlus, FiSearch, FiSettings } from "react-icons/fi";
import { DataTable, RowActions, Button, Input, Toast } from "@Components/Common/ExportComponent";
import { AdminLayout } from "@Layouts/AdminLayout";
import { useSubcategoryManager } from "@Hooks/admin/sfia/useSubcategoryHooks";
import { Subcategory, CreateSubcategoryDto, UpdateSubcategoryDto, SubcategoryPageResult } from "@Types/sfia/subcategoryTypes";
import { AddEditSubcategoryModal, DeleteSubcategoryModal } from "./SubcategoryModals";

export default function SubcategoryTablePage() {
  const [searchText, setSearchText] = useState<string>("");
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>("");
  const [modalType, setModalType] = useState<"add" | "edit" | "delete" | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [items, setItems] = useState<Subcategory[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const handleToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
  };

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  const { subcategoriesQuery, createSubcategory, updateSubcategory, deleteSubcategory } =
    useSubcategoryManager({ search: debouncedSearchText, page, perPage }, handleToast);

  const uniqueById = (arr: Subcategory[]) => {
    const map = new Map();
    arr.forEach((item) => map.set(item.id, item));
    return Array.from(map.values());
  };

  useEffect(() => {
    const q = subcategoriesQuery.data;
    if (!q) return;

    if ("pages" in q && Array.isArray(q.pages)) {
      const all = q.pages.flatMap((pg: SubcategoryPageResult) => pg.data);
      setItems(uniqueById(all));
    } else if ("data" in q && Array.isArray(q.data)) {
      if (page === 1) {
        setItems(q.data);
      } else {
        setItems((prev) => uniqueById([...prev, ...q.data]));
      }
    }
  }, [subcategoriesQuery.data, page]);

  // Modal handlers
  const openAddModal = () => {
    setSelectedSubcategory(null);
    setModalType("add");
  };
  const openEditModal = (sub: Subcategory) => {
    setSelectedSubcategory(sub);
    setModalType("edit");
  };
  const openDeleteModal = (sub: Subcategory) => {
    setSelectedSubcategory(sub);
    setModalType("delete");
  };
  const closeModal = () => {
    setModalType(null);
    setSelectedSubcategory(null);
  };

  // Confirm operations
  const confirmAdd = (text: string) => {
    const dto: CreateSubcategoryDto = {
      subcategory_text: text || null,
    };
    createSubcategory.mutate(dto, {
      onSuccess: () => {
        handleToast("Created successfully", "success");
        closeModal();
        subcategoriesQuery.refetch();
      },
      onError: (error) => {
        handleToast("Failed to create: " + (error?.message ?? ""), "error");
      },
    });
  };

  const confirmEdit = (text: string, categoryId: number | null) => {
    if (!selectedSubcategory) return;
    const dto: UpdateSubcategoryDto = {
      subcategory_text: text,
      ...(categoryId !== null && { id: categoryId }),
    };
    updateSubcategory.mutate(
      { id: selectedSubcategory.id, data: dto },
      {
        onSuccess: () => {
          handleToast("Updated successfully", "success");
          closeModal();
          subcategoriesQuery.refetch();
        },
        onError: (error) => {
          handleToast("Failed to update: " + (error?.message ?? ""), "error");
        },
      }
    );
  };

  const confirmDelete = () => {
    if (!selectedSubcategory) return;
    deleteSubcategory.mutate(selectedSubcategory.id, {
      onSuccess: () => {
        handleToast("Deleted successfully", "success");
        closeModal();
        subcategoriesQuery.refetch();
      },
      onError: (error) => {
        handleToast("Failed to delete: " + (error?.message ?? ""), "error");
      },
    });
  };

  // Table columns
  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "subcategory_text", header: "Subcategory Text" },
      {
        id: "actions",
        header: () => <FiSettings className="text-lg" />,
        cell: ({ row }: { row: { original: Subcategory } }) => (
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
        <h1 className="text-3xl font-Poppins mb-2 sm:mb-0">Subcategories</h1>

        <div className="flex flex-col items-end space-y-2">
          <Button
            size="md"
            onClick={openAddModal}
            className="flex items-center"
          >
            <FiPlus className="mr-2" /> Add Subcategory
          </Button>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search subcategories..."
              className="pl-3 pr-30 py-1 text-sm"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <FiSearch className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      <DataTable<Subcategory>
        data={items}
        columns={columns}
        pageSizes={[5, 10, 20]}
        initialPageSize={20}
        isLoading={subcategoriesQuery.isLoading}
        isError={subcategoriesQuery.isError}
        errorMessage={subcategoriesQuery.error?.message || "An error occurred while fetching data"}
        onRetry={() => subcategoriesQuery.refetch()}
        onPageChange={(newPageIndex) => {
          const newPage = newPageIndex + 1; // react-table pageIndex เริ่มที่ 0
          if (newPage > page) {
            setPage(newPage);
          }
        }}
      />

      <AddEditSubcategoryModal
        isOpen={modalType === "add" || modalType === "edit"}
        mode={modalType === "edit" ? "edit" : "add"}
        initialText={selectedSubcategory?.subcategory_text || ""}
        initialCategoryId={selectedSubcategory?.id ?? null}
        onClose={closeModal}
        onConfirm={(text, catId) => (modalType === "add" ? confirmAdd(text) : confirmEdit(text, catId))}
        isLoading={createSubcategory.status === "pending" || updateSubcategory.status === "pending"}
      />

      <DeleteSubcategoryModal
        isOpen={modalType === "delete"}
        subcategoryText={selectedSubcategory?.subcategory_text ?? undefined}
        onClose={closeModal}
        onConfirm={confirmDelete}
        isLoading={deleteSubcategory.status === "pending"}
      />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AdminLayout>
  );
}
