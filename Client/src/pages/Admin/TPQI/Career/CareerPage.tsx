import { useState, useMemo, useEffect } from "react";
import { FiPlus, FiSearch, FiSettings } from "react-icons/fi";
import { RowActions, Button, Input, Toast, DataTable } from "@Components/Common/ExportComponent";
import { AdminLayout } from "@Layouts/AdminLayout";
import { useCareerManager } from "@Hooks/admin/tpqi/useCareerHooks";
import { Career, CreateCareerDto, UpdateCareerDto } from "@Types/tpqi/careerTypes";
import { AddEditCareerModal, DeleteCareerModal } from "./CareerModals";

export default function CareerTablePage() {
    const [searchText, setSearchText] = useState<string>("");
    const [debouncedSearchText, setDebouncedSearchText] = useState<string>("");
    const [modalType, setModalType] = useState<"add" | "edit" | "delete" | null>(null);
    const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
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
    }

    const { fetchPage, careersQuery, createCareer, updateCareer, deleteCareer } = useCareerManager({ search: debouncedSearchText, page, perPage }, handleToast);

    // Modal handlers
    const openAddModal = () => {
        setSelectedCareer(null);
        setModalType("add");
    };
    const openEditModal = (car: Career) => {
        setSelectedCareer(car);
        setModalType("edit");
    };
    const openDeleteModal = (car: Career) => {
        setSelectedCareer(car);
        setModalType("delete");
    };
    const closeModal = () => {
        setModalType(null);
        setSelectedCareer(null);
    };

    // Confirm operations
    const confirmAdd = (text: string) => {
        if (!selectedCareer) return;
        const dto: CreateCareerDto = { name_career: text || null };
        createCareer.mutate(dto, {
            onSuccess: () => {
                handleToast("Created successfully", "success");
                closeModal();
                careersQuery.refetch();
            },
            onError: (error) => {
                handleToast("Failed to create: " + (error.message || ""), "error");
            },
        });
    }

    const confirmEdit = (text: string) => {
        if (!selectedCareer) return;
        const dto: UpdateCareerDto = { name_career: text || null };
        updateCareer.mutate({ id: selectedCareer.id_career, data: dto }, {
            onSuccess: () => {
                handleToast("Updated successfully", "success");
                closeModal();
                careersQuery.refetch();
            },
            onError: (error) => {
                handleToast("Failed to update: " + (error.message || ""), "error");
            },
        });
    };

    const confirmDelete = () => {
        if (!selectedCareer) return;
        deleteCareer.mutate(selectedCareer.id_career, {
            onSuccess: () => {
                handleToast("Deleted successfully", "success");
                closeModal();
                careersQuery.refetch();
            },
            onError: (error) => {
                handleToast("Failed to delete: " + (error.message || ""), "error");
            },
        });
    };

    // Table columns
    const columns = useMemo(
        () => [
            { accessorKey: "id_career", header: "ID" },
            { accessorKey: "name_career", header: "Career name" },
            {
                id: "actions",
                header: () => (
                    <span style={{ float: "right" }}>
                        <FiSettings />
                    </span>
                ),
                cell: ({ row }: { row: { original: Career } }) => (
                    <div className="text-right">
                        <RowActions onEdit={() => openEditModal(row.original)} onDelete={() => openDeleteModal(row.original)} />
                    </div>
                ),
            },
        ],
        []
    );

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 z-10">
                <h1 className="text-3xl font-Poppins mb-2 sm:mb-0">Careers</h1>
                <div className="flex flex-col items-end space-y-2">
                    <Button size="md" onClick={openAddModal} className="flex items-center">
                        <FiPlus className="mr-2" /> Add Careers
                    </Button>
                    <div className="relative">
                        <Input type="text" placeholder="Search careers..." className="pl-3 pr-30 py-1 text-sm" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                        <FiSearch className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
            </div>

            <DataTable<Career>
                key={debouncedSearchText}
                resetTrigger={debouncedSearchText}
                fetchPage={fetchPage}
                columns={columns}
                pageSizes={[5, 10, 20]}
                initialPageSize={perPage}
                onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
            />

            <AddEditCareerModal
                isOpen={modalType === "add" || modalType === "edit"}
                mode={modalType === "edit" ? "edit" : "add"}
                initialText={selectedCareer?.name_career || ""}
                initialCategoryId={selectedCareer?.id_career ?? null}
                onClose={closeModal}
                onConfirm={(text) => (modalType === "add" ? confirmAdd(text) : confirmEdit(text))}
                isLoading={createCareer.status === "pending" || updateCareer.status === "pending"}
            />

            <DeleteCareerModal
                isOpen={modalType === "delete"}
                careerText={selectedCareer?.name_career ?? undefined}
                onClose={closeModal}
                onConfirm={confirmDelete}
                isLoading={deleteCareer.status === "pending"}
            />

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </AdminLayout>
    );

}

