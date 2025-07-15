import React, { useState } from "react";
import RoleService from "@Services/competency/roleService";
import { Toast } from "@Components/Common/ExportComponent";

type Props = { onClose: () => void; onSuccess: () => void };

const CreateRoleModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("info");
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const handleToastClose = () => {
    setToastVisible(false);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      showToast("Name is required", "error");
      return;
    }
    setLoading(true);
    try {
      await RoleService.create({ name: name.trim(), description: description.trim() || undefined });
      showToast("Role created", "success");
      onSuccess();
      onClose();
    } catch {
      showToast("Failed to create role", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
        <div className="bg-white rounded p-6 w-96 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Create Role</h2>
          <input type="text" placeholder="Name" className="w-full p-2 mb-3 border rounded" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
          <textarea placeholder="Description (optional)" className="w-full p-2 mb-3 border rounded" value={description} onChange={(e) => setDescription(e.target.value)} disabled={loading} />
          <div className="flex justify-end space-x-2">
            <button onClick={onClose} className="px-4 py-2 border rounded" disabled={loading}>
              Cancel
            </button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </div>

      {toastVisible && <Toast message={toastMessage} type={toastType} onClose={handleToastClose} />}
    </>
  );
};

export default CreateRoleModal;
