import React from "react";
import { Modal, Button, Input } from "@Components/Common/ExportComponent";

interface AddEditModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  initialText: string;
  initialSubId: number | null;
  onClose: () => void;
  onConfirm: (text: string, subId: number | null) => void;
}

export const AddEditModal: React.FC<AddEditModalProps> = ({ isOpen, mode, initialText, initialSubId, onClose, onConfirm }) => {
  const [text, setText] = React.useState(initialText);
  const [subId, setSubId] = React.useState<number | null>(initialSubId);

  React.useEffect(() => {
    setText(initialText);
    setSubId(initialSubId);
  }, [initialText, initialSubId]);

  return (
    <Modal
      className="z-50"
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? "Add Category" : "Edit Category"}
      actions={
        <>
          <Button
            className="!bg-black !text-white hover:!bg-gray-800"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button onClick={() => onConfirm(text, subId)}>{mode === "add" ? "Create" : "Save"}</Button>
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <label className="block text-sm">Category Text</label>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm">Subcategory ID</label>
          <Input
            type="number"
            value={subId !== null ? subId.toString() : ""}
            onChange={(e) => setSubId(e.target.value ? parseInt(e.target.value) : null)}
          />
        </div>
      </div>
    </Modal>
  );
};

interface DeleteModalProps {
  isOpen: boolean;
  categoryName?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, categoryName, onClose, onConfirm }) => (
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
    <p>Are you sure you want to delete “{categoryName}”?</p>
  </Modal>
);
