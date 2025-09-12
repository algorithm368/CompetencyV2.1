import React from "react";
import { Modal, Button, LoadingButton } from "@Components/Common/ExportComponent";

interface EditUserSkillStatusModalProps {
  isOpen: boolean;
  initialStatus: string | null | undefined;
  onClose: () => void;
  onConfirm: (status: "APPROVED" | "NOT_APPROVED" | null) => void;
  isLoading?: boolean;
}

export const EditUserSkillStatusModal: React.FC<EditUserSkillStatusModalProps> = ({
  isOpen,
  initialStatus,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [status, setStatus] = React.useState<"APPROVED" | "NOT_APPROVED" | null>(
    (initialStatus as "APPROVED" | "NOT_APPROVED") ?? null
  );

  React.useEffect(() => {
    setStatus((initialStatus as "APPROVED" | "NOT_APPROVED") ?? null);
  }, [initialStatus]);

  return (
    <Modal
      className="z-50"
      isOpen={isOpen}
      onClose={onClose}
      title="Update UserSkill Status"
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
            onClick={() => onConfirm(status)}
            isLoading={isLoading}
            loadingText="Saving..."
          >
            Save
          </LoadingButton>
        </>
      }
    >
      <div className="space-y-3">
        <div className="flex flex-col">
          <label className="block text-sm mb-1 ml-0.5">Status</label>
          <select
            className="px-2 py-2 border rounded"
            value={status ?? ""}
            onChange={(e) =>
              setStatus(e.target.value ? (e.target.value as "APPROVED" | "NOT_APPROVED") : null)
            }
          >
            <option value="">— Select status —</option>
            <option value="APPROVED">APPROVED</option>
            <option value="NOT_APPROVED">NOT_APPROVED</option>
          </select>
        </div>
      </div>
    </Modal>
  );
};
