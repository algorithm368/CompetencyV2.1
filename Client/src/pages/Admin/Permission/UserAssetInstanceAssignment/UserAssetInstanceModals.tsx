import React, { useState, useEffect } from "react";
import { Modal, Button, LoadingButton, Checkbox } from "@Components/Common/ExportComponent";
import { UserAssetInstance } from "@Types/admin/rbac/userAssetInstanceTypes";

interface AssignAssetModalProps {
  isOpen: boolean;
  selectedAsset?: UserAssetInstance | null;
  onClose: () => void;
  onConfirm: (userId: string, assetInstanceIds: number[]) => void;
  isLoading?: boolean;
}

export const AssignAssetModal: React.FC<AssignAssetModalProps> = ({ isOpen, selectedAsset, onClose, onConfirm, isLoading = false }) => {
  const [userId, setUserId] = useState(selectedAsset?.userId || "");
  const [selectedAssetIds, setSelectedAssetIds] = useState<number[]>(selectedAsset ? [selectedAsset.assetInstanceId] : []);

  useEffect(() => {
    if (isOpen) {
      setUserId(selectedAsset?.userId || "");
      setSelectedAssetIds(selectedAsset ? [selectedAsset.assetInstanceId] : []);
    }
  }, [isOpen, selectedAsset]);

  const toggleAsset = (assetId: number) => {
    setSelectedAssetIds((prev) => (prev.includes(assetId) ? prev.filter((id) => id !== assetId) : [...prev, assetId]));
  };

  const handleConfirm = () => {
    if (!userId || selectedAssetIds.length === 0) return;
    onConfirm(userId, selectedAssetIds);
  };

  return (
    <Modal
      className="z-50"
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Asset Instances"
      actions={
        <>
          <Button className="!bg-black !text-white hover:!bg-gray-800" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <LoadingButton onClick={handleConfirm} isLoading={isLoading} loadingText="Assigning...">
            Assign
          </LoadingButton>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col">
          <label>User ID</label>
          <input type="text" className="border rounded p-2" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Enter user ID" disabled={isLoading} />
        </div>

        <div className="flex flex-col">
          <label>Select Asset Instances</label>
          <div className="flex flex-col space-y-2 max-h-64 overflow-y-auto border p-2 rounded">
            {selectedAsset && (
              <label className="flex items-center space-x-2">
                <Checkbox checked={selectedAssetIds.includes(selectedAsset.assetInstanceId)} onCheckedChange={() => toggleAsset(selectedAsset.assetInstanceId)} disabled={isLoading} />
                <span>{selectedAsset.assetInstance?.recordId || "Unknown Asset"}</span>
              </label>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

interface RevokeAssetModalProps {
  isOpen: boolean;
  selectedAsset?: UserAssetInstance | null;
  onClose: () => void;
  onConfirm: (userId: string, assetInstanceId: number) => void;
  isLoading?: boolean;
}

export const RevokeAssetModal: React.FC<RevokeAssetModalProps> = ({ isOpen, selectedAsset, onClose, onConfirm, isLoading = false }) => {
  const handleConfirm = () => {
    if (!selectedAsset) return;
    onConfirm(selectedAsset.userId, selectedAsset.assetInstanceId);
  };

  return (
    <Modal
      className="z-50"
      isOpen={isOpen}
      onClose={onClose}
      title="Revoke Asset Instance"
      actions={
        <>
          <Button className="!bg-black !text-white hover:!bg-gray-800" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <LoadingButton onClick={handleConfirm} isLoading={isLoading} loadingText="Revoking..." className="!bg-red-600 !text-white hover:!bg-red-700">
            Revoke
          </LoadingButton>
        </>
      }
    >
      <p>
        Are you sure you want to revoke the asset instance “{selectedAsset?.assetInstance?.recordId || "this asset"}” from user {selectedAsset?.userId}?
      </p>
    </Modal>
  );
};
