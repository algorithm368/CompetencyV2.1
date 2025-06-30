import React from "react";
import { Modal, Button, Input, LoadingButton } from "@Components/Common/ExportComponent";

interface AddEditLevelModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  initialText: string;
  initialCodeJob?: string;
  onClose: () => void;
  onConfirm: (name: string, codeJob?: string) => void;
  isLoading?: boolean;  
}

export const AddEditLevelModal: React.FC<AddEditLevelModalProps> = ({
  isOpen,
  mode,
  initialText,
  initialCodeJob,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [name, setName] = React.useState(initialText);
  const [codeJob, setCodeJob] = React.useState(initialCodeJob || "");

  React.useEffect(() => {
    setName(initialText);
    setCodeJob(initialCodeJob || "");
  }, [initialText, initialCodeJob]);

  return (
    <Modal
      className="z-50"
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? "Add Level" : "Edit Level"}
      actions={
        <>
          <Button
            className="!bg-black !text-white hover:!bg-gray-800"
            onClick={onClose}
            disabled={isLoading}  
          >
            Cancel
          </Button>
          <LoadingButton
            onClick={() => onConfirm(name, codeJob)}
            isLoading={isLoading}
            loadingText={mode === "add" ? "Creating..." : "Saving..."}
          >
            {mode === "add" ? "Create" : "Save"}
          </LoadingButton>
        </>
      }
    >
      <div className="space-y-3">
        <div className="flex flex-col">
          <label className="block text-sm mb-1 ml-0.5">Level Name</label>
          <Input
            value={name}
            className="!rounded-xl"
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading} 
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-sm mb-1 ml-0.5">Code Job</label>
          <Input
            value={codeJob}
            className="!rounded-xl"
            onChange={(e) => setCodeJob(e.target.value)}
            disabled={isLoading} 
          />
        </div>
      </div>
    </Modal>
  );
};

interface DeleteLevelModalProps {
  isOpen: boolean;
  levelName?: string; // เปลี่ยนจาก levelText -> levelName ให้ตรงกับ LevelTablePage
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;  
}

export const DeleteLevelModal: React.FC<DeleteLevelModalProps> = ({
  isOpen,
  levelName,
  onClose,
  onConfirm,
  isLoading = false,
}) => (
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
          disabled={isLoading}  
        >
          Cancel
        </Button>
        <LoadingButton
          onClick={onConfirm}
          isLoading={isLoading}
          loadingText="Deleting..."
          className="!bg-red-600 !text-white hover:!bg-red-700"
        >
          Delete
        </LoadingButton>
      </>
    }
  >
    <p>Are you sure you want to delete “{levelName}”?</p>
  </Modal>
);
