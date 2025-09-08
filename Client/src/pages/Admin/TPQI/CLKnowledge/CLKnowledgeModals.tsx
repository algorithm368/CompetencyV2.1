import React from "react";
import { Modal, Button, Input, LoadingButton } from "@Components/Common/ExportComponent";

interface AddEditCareerKnowledgeModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  initialCareerId: number | null;
  initialName: string | null;
  onClose: () => void;
  onConfirm: (payload: { careerId: number; name: string }) => void;
  isLoading?: boolean;
}

export const AddEditCareerKnowledgeModal: React.FC<AddEditCareerKnowledgeModalProps> = ({
  isOpen,
  mode,
  initialCareerId,
  initialName,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [careerId, setCareerId] = React.useState<number | "">(initialCareerId ?? "");
  const [name, setName] = React.useState<string>(initialName ?? "");

  React.useEffect(() => {
    setCareerId(initialCareerId ?? "");
    setName(initialName ?? "");
  }, [initialCareerId, initialName]);

  const handleSubmit = () => {
    if (careerId === "" || name.trim() === "") {
      console.error("Career ID and Knowledge Name are required");
      return;
    }
    onConfirm({
      careerId: Number(careerId),
      name: name.trim(),
    });
  };

  const title = mode === "add" ? "Add Knowledge" : "Edit Knowledge";
  const isValid = careerId !== "" && name.trim() !== "";

  return (
    <Modal
      className="z-50"
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      actions={
        <>
          <Button className="!bg-black !text-white hover:!bg-gray-800" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <LoadingButton
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText={mode === "add" ? "Creating..." : "Saving..."}
            disabled={!isValid}
          >
            {mode === "add" ? "Create" : "Save"}
          </LoadingButton>
        </>
      }
    >
      <div className="space-y-3">
        <div className="flex flex-col">
          <label className="block text-sm mb-1 ml-0.5">
            Career ID <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            value={careerId}
            onChange={(e) => setCareerId(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="Enter career ID"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-sm mb-1 ml-0.5">
            Knowledge Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter knowledge name"
            required
          />
        </div>
      </div>
    </Modal>
  );
};

interface DeleteCareerKnowledgeModalProps {
  isOpen: boolean;
  label?: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DeleteCareerKnowledgeModal: React.FC<DeleteCareerKnowledgeModalProps> = ({
  isOpen,
  label,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  return (
    <Modal
      className="z-50"
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Knowledge"
      actions={
        <>
          <Button className="!bg-black !text-white hover:!bg-gray-800" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <LoadingButton onClick={onConfirm} isLoading={isLoading} loadingText="Deleting...">
            Delete
          </LoadingButton>
        </>
      }
    >
      <div className="space-y-3">
        <p>Are you sure you want to delete {label ? `"${label}"` : "this item"}?</p>
      </div>
    </Modal>
  );
};
