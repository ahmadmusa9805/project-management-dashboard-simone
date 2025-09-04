import { useState } from "react";
import { Checkbox, Button } from "antd";

export type SharedUser = {
  userId: string;
  name: string;
  role: string;
  email: string;
  profileImg?: string;
};

interface CustomUnshareSelectorProps {
  title?: string;
  unsharing?: boolean;
  sharedUsers: SharedUser[]; // Already shared users
  onUnshare: (selectedUsers: SharedUser[]) => void;
}

const CustomUnshareSelector = ({
  title = "Unshare with",
  sharedUsers,
  unsharing,
  onUnshare,
}: CustomUnshareSelectorProps) => {
  const [selectedUsers, setSelectedUsers] = useState<SharedUser[]>([]);

  const handleToggleUser = (user: SharedUser) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.userId === user.userId)
        ? prev.filter((u) => u.userId !== user.userId)
        : [...prev, user]
    );
  };

  return (
    <div className="w-full h-full p-4 bg-white rounded flex flex-col gap-4">
      {/* Title */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-[#000E0F]">{title}</h2>
      </div>

      {/* User List */}
      <div className="flex flex-col gap-4 max-h-60 overflow-y-auto">
        {sharedUsers.length > 0 ? (
          sharedUsers.map((user) => (
            <div
              key={user.userId}
              className="w-full flex items-center justify-between gap-4 border-b border-[#E6E7E7] py-4"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-10 h-10 rounded-full border border-gray-300"
                  src={user.profileImg || "https://via.placeholder.com/40"}
                  alt={user.name}
                />
                <div>
                  <span className="text-[#172B4D] text-base font-medium">
                    {user.name}
                  </span>
                  <div className="text-xs text-[#6B7374]">
                    {user.role
                      .replace("-", " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </div>
                </div>
              </div>
              <Checkbox
                checked={selectedUsers.some((u) => u.userId === user.userId)}
                onChange={() => handleToggleUser(user)}
              />
            </div>
          ))
        ) : (
          <div className="text-center text-sm text-gray-500">
            No shared users found
          </div>
        )}
      </div>

      {/* Unshare Button */}
      <Button
        danger
        type="primary"
        className="w-full text-white text-base font-medium h-12"
        onClick={() => onUnshare(selectedUsers)}
        disabled={selectedUsers.length === 0} // always disabled
        loading={unsharing}
      >
        {unsharing ? "Unsharing..." : "Unshare"}
      </Button>
    </div>
  );
};

export default CustomUnshareSelector;
