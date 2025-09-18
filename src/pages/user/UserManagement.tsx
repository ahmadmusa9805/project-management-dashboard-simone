/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Select, ConfigProvider, Drawer, Tabs, Spin } from "antd";
import CustomSearchInput from "../../components/CustomSearchInput";
import CustomCreateButton from "../../components/CustomCreateButton";
import CustomViewMoreButton from "../../components/CustomViewMoreButton";
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
import CustomPagination from "../../components/CustomPagination";

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

interface AdminTableProps {
  title?: string;
  statusFilter?: "active" | "blocked";
  searchTerm?: string;
  openDrawer?: boolean;
  setOpenDrawer?: Dispatch<SetStateAction<boolean>>;
  selectedUser?: DataItem | null;
  setSelectedUser?: Dispatch<SetStateAction<DataItem | null>>;
  mode?: "create" | "edit";
  setMode?: Dispatch<SetStateAction<"create" | "edit">>;
}

const AdminTable: React.FC<AdminTableProps> = (props) => {
  const {
    title: propTitle,
    statusFilter,
    searchTerm: propSearchTerm,
    openDrawer: propOpenDrawer,
    setOpenDrawer: propSetOpenDrawer,
    selectedUser: propSelectedUser,
    setSelectedUser: propSetSelectedUser,
    mode: propMode,
    setMode: propSetMode,
  } = props;

  const [page, setPage] = useState(1);
  const [limit] = useState(10); // default 10 per page
  const [searchText, setSearchText] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<DataItem | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "blocked">("active");

  const effectiveSearchTerm =
    propSearchTerm !== undefined ? propSearchTerm : searchText;
  const effectiveOpenDrawer =
    propOpenDrawer !== undefined ? propOpenDrawer : openDrawer;
  const effectiveSetOpenDrawer = propSetOpenDrawer || setOpenDrawer;
  const effectiveSelectedUser =
    propSelectedUser !== undefined ? propSelectedUser : selectedUser;
  const effectiveSetSelectedUser = propSetSelectedUser || setSelectedUser;
  const effectiveMode = propMode !== undefined ? propMode : mode;
  const effectiveSetMode = propSetMode || setMode;

  const location = useLocation();
  const pathname = location.pathname;

  // Determine user role for the route
  let routeUserType: DataItem["role"] | null = null;
  if (pathname === "/clients") routeUserType = USER_ROLE.client;
  else if (pathname === "/prime-admins") routeUserType = USER_ROLE.primeAdmin;
  else if (pathname === "/basic-admins") routeUserType = USER_ROLE.basicAdmin;

  const {
    data: users = {
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPage: 1 },
    },
    isLoading,
    refetch,
  } = useGetAllUsersQuery({
    status: statusFilter !== undefined ? statusFilter : activeTab,
    page,
    limit,
    search: effectiveSearchTerm,
    role: routeUserType ?? undefined, // ✅ backend filters role
    // ✅ newest first
  });

  const [userData, setUserData] = useState<DataItem[]>([]);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [viewUser, setViewUser] = useState<string | null>(null);
  const [changeUserStatus] = useChangeUserStatusMutation();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (users?.data && Array.isArray(users.data)) {
      const mappedData: DataItem[] = users.data.map((u: any) => ({
        id: u._id,
        name: u.name,
        profileImg: u.profileImg,
        email: u.email,
        contactNo: u.contactNo,
        status: u.status,
        role: u.role,
        estimateNumber: u.estimateNumber,
        projectType: u.projectType,
        address: u.address,
        postCode: u.postCode,
      }));
      setUserData(mappedData);
    }
  }, [users?.data]);

  // Check authorization
  if (user?.role !== USER_ROLE.superAdmin) {
    return (
      <div className="text-red-600 p-4">
        You are not authorized to access this page.
      </div>
    );
  }

  // Title
  let determinedTitle = "";
  if (routeUserType === USER_ROLE.primeAdmin) determinedTitle = "Prime Admins";
  else if (routeUserType === USER_ROLE.basicAdmin)
    determinedTitle = "Basic Admins";
  else if (routeUserType === USER_ROLE.client) determinedTitle = "Clients";
  const effectiveTitle = propTitle || determinedTitle;

  return (
    <>
      <div className="w-full mx-auto p-4 bg-white min-h-screen">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold mb-4">
            Manage {effectiveTitle}
          </h1>
          {propSearchTerm === undefined && (
            <CustomSearchInput
              onSearch={(val) => {
                setSearchText(val);
                setPage(1);
              }}
            />
          )}
        </div>

        <div className="py-2 justify-end flex">
          {propOpenDrawer === undefined && (
            <CustomCreateButton
              title="Create User"
              onClick={() => {
                effectiveSetMode("create");
                effectiveSetSelectedUser(null);
                effectiveSetOpenDrawer(true);
              }}
            />
          )}
        </div>

        {statusFilter !== undefined ? (
          <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-[#e6f4ea] border-b border-gray-300">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Contact</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-6">
                    <Spin size="large"></Spin>
                  </td>
                </tr>
              ) : userData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No {effectiveTitle} found.
                  </td>
                </tr>
              ) : (
                userData.map(
                  ({
                    id,
                    name,
                    email,
                    contactNo,
                    status,
                    estimateNumber,
                    projectType,
                    role,
                    profileImg,
                  }) => (
                    <tr key={id} className="border-b hover:bg-[#e6f4ea]">
                      <td className="px-4 py-3">{name}</td>
                      <td className="px-4 py-3">{email}</td>
                      <td className="px-4 py-3">{contactNo}</td>
                      <td className="px-4 py-3">
                        <Select
                          className="w-[100px]"
                          size="small"
                          value={status}
                          onChange={async (newStatus: StatusType) => {
                            try {
                              await changeUserStatus({
                                id,
                                status: newStatus,
                              }).unwrap();
                              successAlert("Status updated successfully");
                              refetch();
                            } catch {
                              errorAlert("Failed to update status");
                            }
                          }}
                        >
                          <Select.Option value="active">Active</Select.Option>
                          <Select.Option value="blocked">Blocked</Select.Option>
                        </Select>
                      </td>
                      <td className="px-4 py-3">
                        <CustomViewMoreButton
                          items={[
                            { key: "view", label: "View User Details" },
                            { key: "edit", label: "Edit User" },
                          ]}
                          onClick={(key) => {
                            if (key === "view") {
                              setViewUser(id);
                              setDetailsModalOpen(true);
                            } else if (key === "edit") {
                              effectiveSetMode("edit");
                              effectiveSetSelectedUser({
                                id,
                                name,
                                email,
                                contactNo,
                                status,
                                estimateNumber,
                                projectType,
                                role,
                                profileImg,
                              });
                              effectiveSetOpenDrawer(true);
                            }
                          }}
                        />
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        ) : (
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
              activeKey={activeTab}
              onChange={(key) => {
                setActiveTab(key as "active" | "blocked");
                setPage(1);
              }}
            >
              {/* Active Tab */}
              <TabPane tab={<span>Active</span>} key="active">
                <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden">
                  <thead className="bg-[#e6f4ea] border-b border-gray-300">
                    <tr>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Contact</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="text-center py-6">
                          <Spin size="large"></Spin>
                        </td>
                      </tr>
                    ) : userData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-6 text-gray-500"
                        >
                          No {effectiveTitle} found.
                        </td>
                      </tr>
                    ) : (
                      userData.map(
                        ({
                          id,
                          name,
                          email,
                          contactNo,
                          status,
                          estimateNumber,
                          projectType,
                          role,
                          profileImg,
                        }) => (
                          <tr key={id} className="border-b hover:bg-[#e6f4ea]">
                            <td className="px-4 py-3">{name}</td>
                            <td className="px-4 py-3">{email}</td>
                            <td className="px-4 py-3">{contactNo}</td>
                            <td className="px-4 py-3">
                              <Select
                                className="w-[100px]"
                                size="small"
                                value={status}
                                onChange={async (newStatus: StatusType) => {
                                  try {
                                    await changeUserStatus({
                                      id,
                                      status: newStatus,
                                    }).unwrap();
                                    successAlert("Status updated successfully");
                                    refetch();
                                  } catch {
                                    errorAlert("Failed to update status");
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
                            </td>
                            <td className="px-4 py-3">
                              <CustomViewMoreButton
                                items={[
                                  { key: "view", label: "View User Details" },
                                  { key: "edit", label: "Edit User" },
                                ]}
                                onClick={(key) => {
                                  if (key === "view") {
                                    setViewUser(id);
                                    setDetailsModalOpen(true);
                                  } else if (key === "edit") {
                                    effectiveSetMode("edit");
                                    effectiveSetSelectedUser({
                                      id,
                                      name,
                                      email,
                                      contactNo,
                                      status,
                                      estimateNumber,
                                      projectType,
                                      role,
                                      profileImg,
                                    });
                                    effectiveSetOpenDrawer(true);
                                  }
                                }}
                              />
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>

                {/* ✅ Use meta for pagination */}
                {!isLoading && users.meta?.totalPage > 1 && (
                  <CustomPagination
                    page={users.meta.page}
                    totalPages={users.meta.totalPage}
                    onPageChange={(newPage) => setPage(newPage)}
                  />
                )}
              </TabPane>

              {/* Blocked Tab */}
              <TabPane tab={<span>Blocked</span>} key="blocked">
                <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden">
                  <thead className="bg-[#e6f4ea] border-b border-gray-300">
                    <tr>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Contact</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="text-center py-6">
                          <Spin size="large" />
                        </td>
                      </tr>
                    ) : userData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-6 text-gray-500"
                        >
                          No {effectiveTitle} found.
                        </td>
                      </tr>
                    ) : (
                      userData.map(
                        ({
                          id,
                          name,
                          email,
                          contactNo,
                          status,
                          estimateNumber,
                          projectType,
                          role,
                          profileImg,
                        }) => (
                          <tr key={id} className="border-b hover:bg-[#e6f4ea]">
                            <td className="px-4 py-3">{name}</td>
                            <td className="px-4 py-3">{email}</td>
                            <td className="px-4 py-3">{contactNo}</td>
                            <td className="px-4 py-3">
                              <Select
                                className="w-[100px]"
                                size="small"
                                value={status}
                                onChange={async (newStatus: StatusType) => {
                                  try {
                                    await changeUserStatus({
                                      id,
                                      status: newStatus,
                                    }).unwrap();
                                    successAlert("Status updated successfully");
                                    refetch();
                                  } catch {
                                    errorAlert("Failed to update status");
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
                            </td>
                            <td className="px-4 py-3">
                              <CustomViewMoreButton
                                items={[
                                  { key: "view", label: "View User Details" },
                                  { key: "edit", label: "Edit User" },
                                ]}
                                onClick={(key) => {
                                  if (key === "view") {
                                    setViewUser(id);
                                    setDetailsModalOpen(true);
                                  } else if (key === "edit") {
                                    effectiveSetMode("edit");
                                    effectiveSetSelectedUser({
                                      id,
                                      name,
                                      email,
                                      contactNo,
                                      status,
                                      estimateNumber,
                                      projectType,
                                      role,
                                      profileImg,
                                    });
                                    effectiveSetOpenDrawer(true);
                                  }
                                }}
                              />
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>

                {/* ✅ Use meta for pagination */}
                {!isLoading && users.meta?.totalPage > 1 && (
                  <CustomPagination
                    page={users.meta.page}
                    totalPages={users.meta.totalPage}
                    onPageChange={(newPage) => setPage(newPage)}
                  />
                )}
              </TabPane>
            </Tabs>
          </ConfigProvider>
        )}

        {/* ✅ Use meta for pagination for direct table */}
        {statusFilter !== undefined &&
          !isLoading &&
          users.meta?.totalPage > 1 && (
            <CustomPagination
              page={users.meta.page}
              totalPages={users.meta.totalPage}
              onPageChange={(newPage) => setPage(newPage)}
            />
          )}
      </div>

      {/* Drawer */}
      <Drawer
        open={effectiveOpenDrawer}
        onClose={() => effectiveSetOpenDrawer(false)}
        width={720}
        title={effectiveMode === "create" ? "Create New User" : "Edit User"}
        destroyOnClose
      >
        <UserCreateEditPage
          onClose={() => effectiveSetOpenDrawer(false)}
          mode={effectiveMode}
          defaultValues={effectiveSelectedUser ?? undefined}
          onSubmitSuccess={() => {
            effectiveSetOpenDrawer(false);
            refetch();
          }}
          onCancel={() => effectiveSetOpenDrawer(false)}
        />
      </Drawer>

      {/* Details Modal */}
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
