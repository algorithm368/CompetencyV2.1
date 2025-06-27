import React, { useState, useMemo, useEffect } from "react";
import { FiPlus, FiSearch, FiSettings } from "react-icons/fi";
import { DataTable, RowActions, Button, Input } from "@Components/Common/ExportComponent";
import { AdminLayout } from "@Layouts/AdminLayout";
import { useCategoryManager } from "@Hooks/admin/sfia/useCategoryHooks";
import { Category, CreateCategoryDto, UpdateCategoryDto, CategoryPageResult } from "@Types/sfia/categoryTypes";
import { AddEditModal, DeleteModal } from "./CategoryModals";

export default function CategoryTablePage() {
  const [searchText, setSearchText] = useState<string>("");
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>("");

  const [modalType, setModalType] = useState<"add" | "edit" | "delete" | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [items, setItems] = useState<Category[]>([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  const actorId = "admin-user-id";
  const { categoriesQuery, createCategory, updateCategory, deleteCategory } = useCategoryManager(actorId, {
    search: debouncedSearchText,
  });
    const { isLoading, isError, error, refetch } = categoriesQuery;

  useEffect(() => {
    const q = categoriesQuery.data;
    if (!q) return;

    if ("pages" in q && Array.isArray(q.pages)) {
      const all = q.pages.flatMap((pg: CategoryPageResult) => pg.data);
      setItems(all);
    } else if ("data" in q && Array.isArray(q.data)) {
      setItems(q.data);
    }
  }, [categoriesQuery.data]);

  const openAddModal = () => {
    setSelectedCategory(null);
    setModalType("add");
  };
  const openEditModal = (cat: Category) => {
    setSelectedCategory(cat);
    setModalType("edit");
  };
  const openDeleteModal = (cat: Category) => {
    setSelectedCategory(cat);
    setModalType("delete");
  };
  const closeModal = () => {
    setModalType(null);
    setSelectedCategory(null);
  };

  const confirmAdd = (text: string, subId: number | null) => {
    const dto: CreateCategoryDto = { category_text: text || null, subcategory_id: subId };
    createCategory.mutate(dto);
    closeModal();
  };
  const confirmEdit = (text: string, subId: number | null) => {
    if (!selectedCategory) return;
    const dto: UpdateCategoryDto = { category_text: text, subcategory_id: subId };
    updateCategory.mutate({ id: selectedCategory.id, data: dto });
    closeModal();
  };
  const confirmDelete = () => {
    if (selectedCategory) deleteCategory.mutate(selectedCategory.id);
    closeModal();
  };

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "category_text", header: "Category Text" },
      { accessorKey: "subcategory_id", header: "Subcategory ID" },
      {
        id: "actions",
        header: () => <FiSettings className="text-lg" />,
        cell: ({ row }: { row: { original: Category } }) => (
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
        <h1 className="text-3xl font-Poppins mb-2 sm:mb-0">Categories</h1>

        <div className="flex flex-col items-end space-y-2">
          <Button
            size="md"
            onClick={openAddModal}
            className="flex items-center "
          >
            <FiPlus className="mr-2" /> Add Category
          </Button>
          <div className="relative ">
            <Input
              type="text"
              placeholder="Search categories..."
              className="pl-3 pr-30 py-1 text-sm"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <FiSearch className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

       <DataTable<Category>
          data={items}
          columns={columns}
          pageSizes={[5, 10, 20]}
          initialPageSize={10}
          isLoading={isLoading}
          isError={isError}
          errorMessage={error?.message || "An error occurred while fetching data"}
          onRetry={() => refetch()}
        />

      <AddEditModal
        isOpen={modalType === "add" || modalType === "edit"}
        mode={modalType === "edit" ? "edit" : "add"}
        initialText={selectedCategory?.category_text || ""}
        initialSubId={selectedCategory?.subcategory_id ?? null}
        onClose={closeModal}
        onConfirm={(text, subId) => (modalType === "add" ? confirmAdd(text, subId) : confirmEdit(text, subId))}
      />
      <DeleteModal
        isOpen={modalType === "delete"}
        categoryName={selectedCategory?.category_text ?? undefined}
        onClose={closeModal}
        onConfirm={confirmDelete}
      />
    </AdminLayout>
  );
}
