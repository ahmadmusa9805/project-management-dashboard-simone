import { useState } from "react";
import { Input, Checkbox, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface User {
  id: number;
  name: string;
  avatar: string;
}

interface CustomShareSelectorProps {
  title?: string;
  roles: string[];
  users: User[];
  onShare: (selectedUserIds: number[]) => void;
}

const CustomShareSelector = ({
  title = "Share with",
  roles,
  users,
  onShare,
}: CustomShareSelectorProps) => {
  const [searchText, setSearchText] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleToggleUser = (id: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full h-full p-4 bg-white rounded flex flex-col gap-4">
      {/* Title */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-[#000E0F]">{title}</h2>
        <div className="w-6 h-6 bg-[#001D01] rounded" />
      </div>

      {/* Roles */}
      <div className="flex gap-2 flex-wrap">
        {roles.map((role) => (
          <div
            key={role}
            className="px-3 py-2 rounded-full border border-[#969C9D] text-sm font-medium text-[#2B3738]"
          >
            {role}
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 px-2 py-3 border-2 border-gray-200 rounded">
        <div className="flex items-center gap-1">
          {filteredUsers.slice(0, 3).map((user) => (
            <img
              key={user.id}
              className="w-6 h-6 rounded-full border border-gray-300"
              src={user.avatar}
              alt={user.name}
            />
          ))}
        </div>
        <Input
          placeholder="Search..."
          bordered={false}
          prefix={<SearchOutlined />}
          className="flex-1 text-[#6B7374] text-base"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* User List */}
      <div className="flex flex-col gap-4 max-h-60 overflow-y-auto">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="w-full flex items-center justify-between gap-4 border-b border-[#E6E7E7] py-4"
          >
            <div className="flex items-center gap-4">
              <img
                className="w-10 h-10 p-2 bg-[#E6E7E7] rounded-full"
                src={user.avatar}
                alt={user.name}
              />
              <span className="text-[#172B4D] text-base font-medium">
                {user.name}
              </span>
            </div>
            <Checkbox
              checked={selectedUserIds.includes(user.id)}
              onChange={() => handleToggleUser(user.id)}
            />
          </div>
        ))}
      </div>

      {/* Share Button */}
      <Button
        type="primary"
        className="w-full bg-[#001D01] text-white text-base font-medium h-12"
        onClick={() => onShare(selectedUserIds)}
      >
        Share
      </Button>
    </div>
  );
};

export default CustomShareSelector;
