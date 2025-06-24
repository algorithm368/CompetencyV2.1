import React from "react";
import { Modal, Button, Input } from "@Components/Common/ExportComponent";

interface AddEditSubcategoryModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  initialText: string;
  initialCategoryId: number | null;
  onClose: () => void;
  onConfirm: (name: string, categoryId: number | null) => void;
}

export const AddEditSubcategoryModal: React.FC<AddEditSubcategoryModalProps> = ({ isOpen, mode, initialText, initialCategoryId, onClose, onConfirm }) => {
  const [name, setName] = React.useState(initialText);
  const [categoryId, setCategoryId] = React.useState<number | null>(initialCategoryId);

  React.useEffect(() => {
    setName(initialText);
    setCategoryId(initialCategoryId);
  }, [initialText, initialCategoryId]);

  return (
    <Modal
      className="z-50"
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? "Add Subcategory" : "Edit Subcategory"}
      actions={
        <>
          <Button
            className="!bg-black !text-white hover:!bg-gray-800"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button onClick={() => onConfirm(name, categoryId)}>{mode === "add" ? "Create" : "Save"}</Button>
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <label className="block text-sm">Subcategory Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
};

interface DeleteSubcategoryModalProps {
  isOpen: boolean;
  subcategoryText?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteSubcategoryModal: React.FC<DeleteSubcategoryModalProps> = ({ isOpen, subcategoryText, onClose, onConfirm }) => (
  <Modal
    className="z-50"
    isOpen={isOpen}
    onClose={onClose}
    title="Confirm Delete"
    actions={
      <>
        <Button
          className="!bg-black !text-white hover:!bg-gray-800"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          className="!bg-red-600 !text-white hover:!bg-red-700"
          onClick={onConfirm}
        >
          Delete
        </Button>
      </>
    }
  >
    <p>Are you sure you want to delete “{subcategoryText}”?</p>
  </Modal>
);
