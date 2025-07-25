import React from "react";
import { Modal, Button, Input, LoadingButton } from "@Components/Common/ExportComponent";

interface AddEditPermissionModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  initialText: string;
  initialPermissionKey: string;
  initialPermissionId: number | null;
  onClose: () => void;
  onConfirm: (name: string, key: string) => void;
  isLoading?: boolean;
}

export const AddEditPermissionModal: React.FC<AddEditPermissionModalProps> = ({ isOpen, mode, initialText, initialPermissionKey, onClose, onConfirm, isLoading = false }) => {
  const [name, setName] = React.useState(initialText);

  const [permissionKey, setPermissionKey] = React.useState(initialPermissionKey);

  React.useEffect(() => {
    setName(initialText);
  }, [initialText]);

  React.useEffect(() => {
    setPermissionKey(initialPermissionKey);
  }, [initialPermissionKey]);

  return (
    <Modal
      className="z-50"
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? "Add Permission" : "Edit Permission"}
      actions={
        <>
          <Button className="!bg-black !text-white hover:!bg-gray-800" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <LoadingButton onClick={() => onConfirm(name, permissionKey)} isLoading={isLoading} loadingText={mode === "add" ? "Creating..." : "Saving..."}>
            {mode === "add" ? "Create" : "Save"}
          </LoadingButton>
        </>
      }
    >
      <div className="space-y-3">
        <div className="flex flex-col">
          <label className="block text-sm mb-1 ml-0.5">Permission Name (Description)</label>
          <Input value={name} className="!rounded-xl" onChange={(e) => setName(e.target.value)} disabled={isLoading} />
        </div>
        <div className="flex flex-col">
          <label className="block text-sm mb-1 ml-0.5">Permission Key</label>
          <Input value={permissionKey} className="!rounded-xl" onChange={(e) => setPermissionKey(e.target.value)} disabled={isLoading} />
        </div>
      </div>
    </Modal>
  );
};

interface DeletePermissionModalProps {
  isOpen: boolean;
  permissionText?: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DeletePermissionModal: React.FC<DeletePermissionModalProps> = ({ isOpen, permissionText, onClose, onConfirm, isLoading = false }) => (
  <Modal
    className="z-50"
    isOpen={isOpen}
    onClose={onClose}
    title="Confirm Delete"
    actions={
      <>
        <Button className="!bg-black !text-white hover:!bg-gray-800" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <LoadingButton onClick={onConfirm} isLoading={isLoading} loadingText="Deleting..." className="!bg-red-600 !text-white hover:!bg-red-700">
          Delete
        </LoadingButton>
      </>
    }
  >
    <p>Are you sure you want to delete “{permissionText}”?</p>
  </Modal>
);
