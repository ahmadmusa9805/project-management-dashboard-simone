// pages/UserPageWithTabs.tsx

import { Tabs } from "antd";
import { useState } from "react";
import AdminTable, { type DataItem } from "./UserManagement"; // This is your main table component

import CustomCreateButton from "../../components/CustomCreateButton";
import { CustomSearchInput } from "../../components/CustomSearchInput";

const UserPageWithTabs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedUser, setSelectedUser] = useState<DataItem | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleCreateUser = () => {
    setMode("create");
    setSelectedUser(null);
    setOpenDrawer(true);
  };

  const tabItems = [
    {
      key: "all",
      label: "All Users",
      children: (
        <div className="w-full mx-auto p-4 bg-white min-h-screen">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold mb-4">Manage Users</h1>
            <CustomSearchInput onSearch={handleSearch} />
          </div>

          <div className="py-2 justify-end flex">
            <CustomCreateButton
              title="Create User"
              onClick={handleCreateUser}
            />
          </div>

          <AdminTable
            title="All Users"
            statusFilter={undefined}
            searchTerm={searchTerm}
            openDrawer={openDrawer}
            setOpenDrawer={setOpenDrawer}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            mode={mode}
            setMode={setMode}
          />
        </div>
      ),
    },
    {
      key: "active",
      label: "Active Users",
      children: (
        <div className="w-full mx-auto p-4 bg-white min-h-screen">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold mb-4">Active Users</h1>
            <CustomSearchInput onSearch={handleSearch} />
          </div>

          <div className="py-2 justify-end flex">
            <CustomCreateButton
              title="Create User"
              onClick={handleCreateUser}
            />
          </div>

          <AdminTable
            title="Active Users"
            statusFilter="active"
            searchTerm={searchTerm}
            openDrawer={openDrawer}
            setOpenDrawer={setOpenDrawer}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            mode={mode}
            setMode={setMode}
          />
        </div>
      ),
    },
    {
      key: "blocked",
      label: "Blocked Users",
      children: (
        <div className="w-full mx-auto p-4 bg-white min-h-screen">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold mb-4">Blocked Users</h1>
            <CustomSearchInput onSearch={handleSearch} />
          </div>

          <div className="py-2 justify-end flex">
            <CustomCreateButton
              title="Create User"
              onClick={handleCreateUser}
            />
          </div>

          <AdminTable
            title="Blocked Users"
            statusFilter="blocked"
            searchTerm={searchTerm}
            openDrawer={openDrawer}
            setOpenDrawer={setOpenDrawer}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            mode={mode}
            setMode={setMode}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Tabs defaultActiveKey="all" items={tabItems} />
    </div>
  );
};

export default UserPageWithTabs;
