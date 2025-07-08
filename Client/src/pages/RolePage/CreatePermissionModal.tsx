import React, { FC } from "react";
import { Modal, Button, Input } from "@Components/ExportComponent";
import PermissionService from "@Services/PermissionService";
import { useMutation, useQueryClient } from "react-query";
import toast, { Toaster } from "react-hot-toast";

interface CreatePermissionModalProps {
  onClose: () => void;
}

export const CreatePermissionModal: FC<CreatePermissionModalProps> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const [key, setKey] = React.useState("");
  const [desc, setDesc] = React.useState("");

  const createPerm = useMutation(() => PermissionService.create({ permissionKey: key, description: desc }), {
    onSuccess: () => {
      queryClient.invalidateQueries("permissions-table");
      toast.success("New permission created!");
      onClose();
    },
    onError: () => {
      toast.error("Create permission failed");
    },
  });

  return (
    <>
      <Toaster position="top-right" />
      <Modal onClose={onClose} title="Create New Permission" className="bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 transition-colors">
        <div className="space-y-4">
          <Input
            value={key}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKey(e.target.value)}
            placeholder="Permission Key"
            required
            className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 transition-colors"
          />
          <Input
            value={desc}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDesc(e.target.value)}
            placeholder="Description"
            required
            className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 transition-colors"
          />
          <Button onClick={() => createPerm.mutate()} className="bg-neutral-800 hover:bg-neutral-700 text-neutral-100 transition-colors">
            Create Permission
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default CreatePermissionModal;
