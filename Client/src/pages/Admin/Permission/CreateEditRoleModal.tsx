import React, { useState, useEffect } from "react";
import { Button, Modal, Input, Textarea } from "@Components/Common/ExportComponent";
import { CreateRoleDto, RoleEntity, UpdateRoleDto } from "@Types/competency/roleTypes";

type CreateEditRoleModalProps = {
  isOpen: boolean;
  mode: "add" | "edit";
  initialData: RoleEntity | null;
  onClose: () => void;
  onConfirm: (data: CreateRoleDto | UpdateRoleDto) => void;
  isLoading?: boolean;
};

type DeleteRoleModalProps = {
  isOpen: boolean;
  roleName: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
};

const CreateEditRoleModal: React.FC<CreateEditRoleModalProps> = ({ isOpen, mode, initialData, onClose, onConfirm, isLoading = false }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || "");
      setDescription(initialData?.description || "");
    }
  }, [isOpen, initialData]);

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    if (mode === "add") {
      onConfirm({ name, description: description || null });
    } else if (mode === "edit" && initialData) {
      onConfirm({ id: initialData.id, name, description: description || null });
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} title={mode === "add" ? "Create Role" : "Edit Role"} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <Textarea value={description || ""} onChange={(e) => setDescription(e.target.value)} rows={4} />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "add" ? "Create" : "Update"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const DeleteRoleModal: React.FC<DeleteRoleModalProps> = ({ isOpen, roleName, onClose, onConfirm, isLoading = false }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} title="Confirm Delete" onClose={onClose}>
      <p>
        Are you sure you want to delete the role <strong>{roleName}</strong>?
      </p>
      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </Modal>
  );
};

export { CreateEditRoleModal, DeleteRoleModal };
