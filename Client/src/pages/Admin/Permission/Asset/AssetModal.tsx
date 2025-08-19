import React, { useState, useEffect } from "react";
import { Modal, Input, Button } from "@Components/Common/ExportComponent";
import { Asset } from "@Types/competency/rbacTypes";

interface AddEditAssetModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  initialAsset?: Asset | null;
  onClose: () => void;
  onConfirm: (name: string, description?: string) => void;
  isLoading: boolean;
}

export const AddEditAssetModal: React.FC<AddEditAssetModalProps> = ({ isOpen, mode, initialAsset, onClose, onConfirm, isLoading }) => {
  const [name, setName] = useState(initialAsset?.name || "");
  const [description, setDescription] = useState(initialAsset?.description || "");

  useEffect(() => {
    if (isOpen) {
      setName(initialAsset?.name || "");
      setDescription(initialAsset?.description || "");
    }
  }, [isOpen, initialAsset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Asset Name is required.");
      return;
    }
    onConfirm(name.trim(), description.trim() || undefined);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === "add" ? "Add New Asset" : "Edit Asset"}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="assetName" className="block text-gray-700 text-sm font-bold mb-2">
            Asset Name <span className="text-red-500">*</span>
          </label>
          <Input id="assetName" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g., User Management, Dashboard Access" className="w-full" />
        </div>
        <div className="mb-6">
          <label htmlFor="assetDescription" className="block text-gray-700 text-sm font-bold mb-2">
            Description (Optional)
          </label>
          <textarea
            id="assetDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the asset"
            rows={3}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit">{mode === "add" ? "Create Asset" : "Save Changes"}</Button>
        </div>
      </form>
    </Modal>
  );
};

interface DeleteAssetModalProps {
  isOpen: boolean;
  assetText?: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const DeleteAssetModal: React.FC<DeleteAssetModalProps> = ({ isOpen, assetText, onClose, onConfirm, isLoading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Asset">
      <p className="mb-4">
        Are you sure you want to delete the asset: "<span className="font-semibold">{assetText || "N/A"}</span>"? This action cannot be undone.
      </p>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="button" variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
};
