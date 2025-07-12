import React, { FC } from "react";
import { Modal, Button, Input } from "@Components/ExportComponent";
import RoleService from "@Services/RoleService";
import { useMutation, useQueryClient } from "react-query";
import toast, { Toaster } from "react-hot-toast";

interface CreateRoleModalProps {
  onClose: () => void;
}

export const CreateRoleModal: FC<CreateRoleModalProps> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const [name, setName] = React.useState("");
  const [desc, setDesc] = React.useState("");

  const createRole = useMutation(() => RoleService.create({ roleName: name, description: desc }), {
    onSuccess: () => {
      queryClient.invalidateQueries("roles-table");
      toast.success("New role created!");
      onClose();
    },
    onError: () => {
      toast.error("Create role failed");
    },
  });

  return (
    <>
      <Toaster position="top-right" />
      <Modal onClose={onClose} title="Create New Role" className="bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 transition-colors">
        <div className="space-y-4">
          <Input
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            placeholder="Role Name"
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
          <Button onClick={() => createRole.mutate()} className="bg-neutral-800 hover:bg-neutral-700 text-neutral-100 transition-colors">
            Create Role
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default CreateRoleModal;
