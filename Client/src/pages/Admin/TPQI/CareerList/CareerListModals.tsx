import React from "react";
import { Modal, Button, Input, LoadingButton } from "@Components/Common/ExportComponent";

interface AddEditCareerLevelModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  initialCareerId: number | null;
  initialLevelId: number | null;
  onClose: () => void;
  onConfirm: (payload: { careerId: number; levelId: number }) => void;
  isLoading?: boolean;
}

export const AddEditCareerListModal: React.FC<AddEditCareerLevelModalProps> = ({
  isOpen,
  mode,
  initialCareerId,
  initialLevelId,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [careerId, setCareerId] = React.useState<number | "">(initialCareerId ?? "");
  const [levelId, setLevelId] = React.useState<number | "">(initialLevelId ?? "");

  React.useEffect(() => {
    setCareerId(initialCareerId ?? "");
    setLevelId(initialLevelId ?? "");
  }, [initialCareerId, initialLevelId]);

  const handleSubmit = () => {
    if (careerId === "" || levelId === "") {
      console.error("Both Career ID and Level ID are required");
      return;
    }

    onConfirm({
      careerId: Number(careerId),
      levelId: Number(levelId),
    });
  };

  const title = mode === "add" ? "Add Career Level" : "Edit Career Level";
  const isValid = careerId !== "" && levelId !== "";

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
            disabled={!isValid} // Disable if fields are empty
          >
            {mode === "add" ? "Create" : "Save"}
          </LoadingButton>
        </>
      }
    >
      <div className="space-y-3">
        <div className="flex flex-col">
          <label className="block text-sm mb-1 ml-0.5">Career ID <span className="text-red-500">*</span></label>
          <Input
            type="number"
            value={careerId}
            onChange={(e) => setCareerId(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="Enter career ID"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-sm mb-1 ml-0.5">Level ID <span className="text-red-500">*</span></label>
          <Input
            type="number"
            value={levelId}
            onChange={(e) => setLevelId(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="Enter level ID"
            required
          />
        </div>
      </div>
    </Modal>
  );
};

interface DeleteCareerListModalProps {
  isOpen: boolean;
  label?: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DeleteCareerListModal: React.FC<DeleteCareerListModalProps> = ({
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
      title="Delete Career Level"
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