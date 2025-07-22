import React, { useState } from "react";
import { Modal } from "antd";

interface PasswordUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (current: string, newPass: string, confirm: string) => void;
}

const PasswordUpdateModal: React.FC<PasswordUpdateModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(current, newPass, confirm);
  };

  return (
    <Modal
      title="Update Password"
      open={isOpen}
      onCancel={onClose}
      footer={null} // Custom footer using buttons inside form
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Current Password
          </label>
          <input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none"
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PasswordUpdateModal;
