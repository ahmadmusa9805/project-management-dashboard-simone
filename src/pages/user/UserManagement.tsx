/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Select, Button, Tabs, ConfigProvider } from "antd";
import CustomSearchInput from "../../components/CustomSearchInput";
import CustomCreateButton from "../../components/CustomCreateButton";
import CustomViewMoreButton from "../../components/CustomViewMoreButton";
import { Drawer } from "antd";
import UserCreateEditPage from "./UserCreateEditPage";
import { USER_ROLE, type TRole } from "../../types/userAllTypes/user";
import { useLocation } from "react-router-dom";
import UserDetailsModal from "./UserDetailModal";
import {
  useChangeUserStatusMutation,
  useGetAllUsersQuery,
} from "../../Redux/features/users/usersApi";
import { errorAlert, successAlert } from "../../utils/alerts";
import TabPane from "antd/es/tabs/TabPane";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/app/store";

export interface DataItem {
  id: string;
  name: string;
  email: string;
  profileImg?: string;
  contactNo: string;
  status: StatusType;
  role: TRole;
  estimateNumber: string;
  projectType: string;
  address?: string;
  postCode?: string;
}
type StatusType = "active" | "blocked";
const ITEMS_PER_PAGE = 10;

interface AdminTableProps {
  title?: string;
  statusFilter?: StatusType; // undefined = all users
  searchTerm?: string;
  openDrawer?: boolean;
  setOpenDrawer?: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUser?: DataItem | null;
  setSelectedUser?: React.Dispatch<React.SetStateAction<DataItem | null>>;
  mode?: "create" | "edit";
  setMode?: React.Dispatch<React.SetStateAction<"create" | "edit">>;
}

const AdminTable: React.FC<AdminTableProps> = () => {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<DataItem | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "blocked">("active");
  const { data, refetch } = useGetAllUsersQuery({ status: activeTab });
  console.log(data);

  const [userData, setUserData] = useState<DataItem[]>([]);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [viewUser, setViewUser] = useState<string | null>(null);
  const [changeUserStatus] = useChangeUserStatusMutation();
  const user = useSelector((state: RootState) => state.auth.user);

  const location = useLocation();
  const pathname = location.pathname;

  // Determine user role for the route
  let routeUserType: DataItem["role"] | null = null;
  if (pathname === "/clients") routeUserType = USER_ROLE.client;
  else if (pathname === "/prime-admins") routeUserType = USER_ROLE.primeAdmin;
  else if (pathname === "/basic-admins") routeUserType = USER_ROLE.basicAdmin;
  else routeUserType = null;

  useEffect(() => {
    if (data?.data && Array.isArray(data.data)) {
      const mappedData: DataItem[] = data.data.map((user: any) => ({
        id: user._id,
        name: user.name,
        profileImg: user.profileImg,
        email: user.email,
        contactNo: user.contactNo,
        status: user.status, // or use user.status if available
        role: user.role,
        estimateNumber: user.estimateNumber,
        projectType: user.projectType,
        address: user.address,
        postCode: user.postCode,
      }));
      setUserData(mappedData);
    }
  }, [data]);
  // Check authorization (only super-admin allowed)
  const role = user?.role;
  if (role !== USER_ROLE.superAdmin) {
    return (
      <div className="text-red-600 p-4">
        You are not authorized to access this page.
      </div>
    );
  }

  // Filter userData by role & search text
  const filteredData = userData
    .filter((user) => user.role === routeUserType)
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.email.toLowerCase().includes(searchText.toLowerCase()) ||
        item.contactNo.includes(searchText)
    );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentData = filteredData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  console.log("Current path:", pathname);
  console.log("routeUserType:", routeUserType);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const onSearch = (value: string) => {
    setSearchText(value);
    setPage(1);
  };

  // Delete user handler
  // const handleDeleteUser = async (id: number) => {
  //   try {
  //     await deleteUser(id).unwrap();
  //     message.success("User deleted successfully");
  //     refetch(); // refetch user list after deletion
  //   } catch (error) {
  //     message.error("Failed to delete user");
  //   }
  // };

  // Title based on route
  let title = "";
  if (routeUserType === USER_ROLE.primeAdmin) title = "Prime Admins";
  else if (routeUserType === USER_ROLE.basicAdmin) title = "Basic Admins";
  else if (routeUserType === USER_ROLE.client) title = "Clients";
  console.log("Opening modal for:", viewUser, detailsModalOpen);
  return (
    <>
      <>
        <div className="w-full mx-auto p-4 bg-white min-h-screen">
          <div className="flex justify-between">
            <h1 className="text-2xl font-semibold mb-4">Manage {title}</h1>
            <CustomSearchInput onSearch={onSearch} />
          </div>

          <div className="py-2 justify-end flex">
            <CustomCreateButton
              title="Create User"
              onClick={() => {
                setMode("create");
                setSelectedUser(null);
                setOpenDrawer(true);
              }}
            />
          </div>
          <ConfigProvider
            theme={{
              components: {
                Tabs: {
                  itemColor: "#555",
                  itemActiveColor: "#0d542b",
                  itemHoverColor: "#1c7e4f",
                  itemSelectedColor: "#0d542b",
                  inkBarColor: "#0d542b",
                  titleFontSize: 16,
                },
              },
            }}
          >
            <Tabs
              defaultActiveKey="active {}"
              activeKey={activeTab}
              onChange={(key) => {
                setActiveTab(key as "active" | "blocked");
                setPage(1);
              }}
            >
              <TabPane tab={<span> Active {title}</span>} key="active">
                <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden">
                  <thead className="bg-[#e6f4ea] border-b border-gray-300">
                    <tr>
                      <th className="text-left px-4 py-2 text-gray-700">
                        Name
                      </th>
                      <th className="text-left px-4 py-2 text-gray-700">
                        Email
                      </th>
                      <th className="text-left px-4 py-2 text-gray-700">
                        Contact Number
                      </th>
                      {/* {routeUserType === "client" && (
                <>
                  <th className="text-left px-4 py-2 text-gray-700">
                    Project Name
                  </th>
                </>
              )} */}
                      <th className="text-left px-4 py-2 text-gray-700">
                        Status
                      </th>
                      <th className="text-left px-4 py-2 text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentData.map(
                      ({
                        id,
                        name,
                        email,
                        contactNo,
                        status,
                        estimateNumber,
                        projectType,
                        role,

                        profileImg, // ✅ Add this line
                      }) => (
                        <tr
                          key={id}
                          className="border-b border-gray-100 hover:bg-[#e6f4ea]"
                        >
                          <td className="px-4 py-3 text-gray-900">{name}</td>
                          <td className="px-4 py-3 text-gray-900">{email}</td>
                          <td className="px-4 py-3 text-gray-900">
                            {contactNo}
                          </td>

                          {/* {routeUserType === "client" && (
                    <>
                      <td className="px-4 py-3 text-gray-900">{projectType}</td>
                    </>
                  )} */}

                          <td className="px-4 py-3">
                            <div
                              className={`inline-block px-3 py-1  rounded text-sm font-medium ${
                                status === "active"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              <Select
                                className="w-[100px] "
                                size="small"
                                value={status}
                                onChange={async (newStatus: StatusType) => {
                                  try {
                                    await changeUserStatus({
                                      id,
                                      status: newStatus,
                                    }).unwrap();
                                    successAlert("Status updated successfully");

                                    setUserData((prevData) =>
                                      prevData.map((user) =>
                                        user.id === id
                                          ? { ...user, status: newStatus }
                                          : user
                                      )
                                    );
                                  } catch (error) {
                                    errorAlert("Failed to update status");
                                    console.error(error);
                                  }
                                }}
                              >
                                <Select.Option value="active">
                                  Active
                                </Select.Option>
                                <Select.Option value="blocked">
                                  Blocked
                                </Select.Option>
                              </Select>
                            </div>
                          </td>

                          <td className="px-4 py-3 flex gap-2">
                            <CustomViewMoreButton
                              items={[
                                { key: "view", label: "View User Details" },
                                { key: "edit", label: "Edit User" },
                              ]}
                              onClick={(key) => {
                                if (key === "view") {
                                  setViewUser(id); // ✅ Correct
                                  setDetailsModalOpen(true);
                                } else if (key === "edit") {
                                  setMode("edit");
                                  setSelectedUser({
                                    id,
                                    name,
                                    profileImg,
                                    email,
                                    contactNo,
                                    status,
                                    estimateNumber,
                                    projectType,
                                    role,
                                  });

                                  setOpenDrawer(true);
                                }
                              }}
                            />
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-evenly items-center mt-4">
                  <Button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>

                  <div className="text-gray-700">
                    Page {page} of {totalPages}
                  </div>

                  <Button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </TabPane>
              <TabPane tab={<span>Blocked {title}</span>} key="blocked">
                <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden">
                  <thead className="bg-[#e6f4ea] border-b border-gray-300">
                    <tr>
                      <th className="text-left px-4 py-2 text-gray-700">
                        Name
                      </th>
                      <th className="text-left px-4 py-2 text-gray-700">
                        Email
                      </th>
                      <th className="text-left px-4 py-2 text-gray-700">
                        Contact Number
                      </th>
                      {/* {routeUserType === "client" && (
                <>
                  <th className="text-left px-4 py-2 text-gray-700">
                    Project Name
                  </th>
                </>
              )} */}
                      <th className="text-left px-4 py-2 text-gray-700">
                        Status
                      </th>
                      <th className="text-left px-4 py-2 text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentData.map(
                      ({
                        id,
                        name,
                        email,
                        contactNo,
                        status,
                        estimateNumber,
                        projectType,
                        role,

                        profileImg, // ✅ Add this line
                      }) => (
                        <tr
                          key={id}
                          className="border-b border-gray-100 hover:bg-[#e6f4ea]"
                        >
                          <td className="px-4 py-3 text-gray-900">{name}</td>
                          <td className="px-4 py-3 text-gray-900">{email}</td>
                          <td className="px-4 py-3 text-gray-900">
                            {contactNo}
                          </td>

                          {/* {routeUserType === "client" && (
                    <>
                      <td className="px-4 py-3 text-gray-900">{projectType}</td>
                    </>
                  )} */}

                          <td className="px-4 py-3">
                            <div
                              className={`inline-block px-3 py-1 rounded text-sm font-medium w-[100px] text-center`}
                            >
                              <Select
                                size="small"
                                value={status}
                                onChange={async (newStatus: StatusType) => {
                                  try {
                                    await changeUserStatus({
                                      id,
                                      status: newStatus,
                                    }).unwrap();
                                    successAlert("Status updated successfully");

                                    setUserData((prevData) =>
                                      prevData.map((user) =>
                                        user.id === id
                                          ? { ...user, status: newStatus }
                                          : user
                                      )
                                    );
                                  } catch (error) {
                                    errorAlert("Failed to update status");
                                    console.error(error);
                                  }
                                }}
                              >
                                <Select.Option value="active">
                                  Active
                                </Select.Option>
                                <Select.Option value="blocked">
                                  Blocked
                                </Select.Option>
                              </Select>
                            </div>
                          </td>

                          <td className="px-4 py-3 flex gap-2">
                            <CustomViewMoreButton
                              items={[
                                { key: "view", label: "View User Details" },
                                { key: "edit", label: "Edit User" },
                              ]}
                              onClick={(key) => {
                                if (key === "view") {
                                  setViewUser(id); // ✅ Correct
                                  setDetailsModalOpen(true);
                                } else if (key === "edit") {
                                  setMode("edit");
                                  setSelectedUser({
                                    id,
                                    name,
                                    profileImg,
                                    email,
                                    contactNo,
                                    status,
                                    estimateNumber,
                                    projectType,
                                    role,
                                  });

                                  setOpenDrawer(true);
                                }
                              }}
                            />
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-evenly items-center mt-4">
                  <Button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>

                  <div className="text-gray-700">
                    Page {page} of {totalPages}
                  </div>

                  <Button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </TabPane>
            </Tabs>
          </ConfigProvider>
        </div>
      </>

      {/* Drawer for Create/Edit */}
      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        width={720}
        title={mode === "create" ? "Create New User" : "Edit User"}
        destroyOnClose
      >
        <UserCreateEditPage
          onClose={() => setOpenDrawer(false)}
          mode={mode}
          defaultValues={selectedUser ?? undefined}
          onSubmitSuccess={() => {
            setOpenDrawer(false);
            refetch(); // Refresh user list after create/edit
          }}
          onCancel={() => setOpenDrawer(false)}
        />
      </Drawer>

      {/* View Details Modal */}
      {viewUser && (
        <UserDetailsModal
          visible={detailsModalOpen}
          onClose={() => {
            setDetailsModalOpen(false);
            setViewUser(null);
          }}
          userId={viewUser}
        />
      )}
    </>
  );
};

export default AdminTable;
