import React, { useState, useEffect } from "react";
import { Modal, Button, LoadingButton, Checkbox } from "@Components/Common/ExportComponent";
import { UserRole } from "@Types/admin/rbac/userRoleTypes";

interface AssignRoleModalProps {
  isOpen: boolean;
  selectedRole?: UserRole | null;
  allRoles: { id: number; name: string }[];
  onClose: () => void;
  onConfirm: (userEmail: string, roleIds: number[]) => void;
  isLoading?: boolean;
}

export const AssignRoleModal: React.FC<AssignRoleModalProps> = ({ isOpen, selectedRole, allRoles, onClose, onConfirm, isLoading = false }) => {
  const [userEmail, setUserEmail] = useState(selectedRole?.userEmail || "");
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>(selectedRole ? [selectedRole.roleId] : []);

  useEffect(() => {
    if (isOpen) {
      setUserEmail(selectedRole?.userEmail || "");
      setSelectedRoleIds(selectedRole ? [selectedRole.roleId] : []);
    }
  }, [isOpen, selectedRole]);

  const toggleRole = (roleId: number) => {
    setSelectedRoleIds((prev) => (prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]));
  };

  const handleConfirm = () => {
    if (!userEmail || selectedRoleIds.length === 0) return;
    onConfirm(userEmail, selectedRoleIds);
  };

  return (
    <Modal
      className="z-50"
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Roles"
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
          <label>User Email</label>
          <input type="email" className="border rounded p-2" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="Enter user email" disabled={isLoading} />
        </div>

        <div className="flex flex-col">
          <label>Select Roles</label>
          <div className="flex flex-col space-y-2 max-h-64 overflow-y-auto border p-2 rounded">
            {allRoles.map((role) => (
              <label key={role.id} className="flex items-center space-x-2">
                <Checkbox checked={selectedRoleIds.includes(role.id)} onCheckedChange={() => toggleRole(role.id)} disabled={isLoading} />
                <span>{role.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

interface RevokeRoleModalProps {
  isOpen: boolean;
  selectedRole?: UserRole | null;
  onClose: () => void;
  onConfirm: (userId: string, roleId: number) => void;
  isLoading?: boolean;
}

export const RevokeRoleModal: React.FC<RevokeRoleModalProps> = ({ isOpen, selectedRole, onClose, onConfirm, isLoading = false }) => {
  const handleConfirm = () => {
    if (!selectedRole) return;
    onConfirm(selectedRole.userId, selectedRole.roleId);
  };

  return (
    <Modal
      className="z-50"
      isOpen={isOpen}
      onClose={onClose}
      title="Revoke Role"
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
        Are you sure you want to revoke the role “{selectedRole?.role?.name || "this role"}” from user {selectedRole?.userId}?
      </p>
    </Modal>
  );
};
