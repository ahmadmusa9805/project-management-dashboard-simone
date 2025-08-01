import { useEffect, useState } from "react";
import { Select,  Button } from "antd";
import CustomSearchInput from "../../components/CustomSearchInput";
import CustomCreateButton from "../../components/CustomCreateButton";
import CustomViewMoreButton from "../../components/CustomViewMoreButton";
import { Drawer } from "antd";
import UserCreateEditPage from "./UserCreateEditPage";
import getStatusClasses from "../../utils/getStatusClasses";
import { USER_ROLE, type StatusType, type TRole } from "../../types/userAllTypes/user";
import { useLocation } from "react-router-dom";
import UserDetailsModal from "./UserDetailModal";
import { useGetAllUsersQuery,  } from "../../Redux/features/users/usersApi";

interface DataItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: StatusType;
  role: TRole;
  quoteValue?: string;
  projectName?: string;
}

const ITEMS_PER_PAGE = 10;

const AdminTable = () => {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<DataItem | null>(null);
  const { data, refetch } = useGetAllUsersQuery();


  const [userData, setUserData] = useState<DataItem[]>([]);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [viewUser, setViewUser] = useState<DataItem | null>(null);

  const location = useLocation();
  const pathname = location.pathname;

  // Determine user role for the route
  let routeUserType: DataItem["role"] | null = null;
  if (pathname === "/clients") routeUserType = USER_ROLE.client;
  else if (pathname === "/prime-admins") routeUserType = USER_ROLE.primeAdmin;
  else if (pathname === "/basic-admins") routeUserType = USER_ROLE.basicAdmin;
  else routeUserType = null;

  // Check authorization (only super-admin allowed)
  const role = localStorage.getItem("role") as DataItem["role"] | null;
  if (role !== USER_ROLE.superAdmin) {
    return (
      <div className="text-red-600 p-4">
        You are not authorized to access this page.
      </div>
    );
  }


  useEffect(() => {
    if (data?.data && Array.isArray(data.data)) {
      const mappedData: DataItem[] = data.data.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.contact,
        status: "Active", // Default or from backend if available
        role: user.role,
        quoteValue: user.estimateNumber || undefined,
        projectName: user.projectType || undefined,
      }));
      setUserData(mappedData);
    }
  }, [data]);

  // Filter userData by role & search text
  const filteredData = userData
    .filter((user) => user.role === routeUserType)
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.email.toLowerCase().includes(searchText.toLowerCase()) ||
        item.phone.includes(searchText)
    );


  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentData = filteredData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

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

  return (
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

        <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden">
          <thead className="bg-[#e6f4ea] border-b border-gray-300">
            <tr>
              <th className="text-left px-4 py-2 text-gray-700">Name</th>
              <th className="text-left px-4 py-2 text-gray-700">Email</th>
              <th className="text-left px-4 py-2 text-gray-700">Contact Number</th>
              {routeUserType === "client" && (
                <>
                  <th className="text-left px-4 py-2 text-gray-700">Quote Value</th>
                  <th className="text-left px-4 py-2 text-gray-700">Project Name</th>
                </>
              )}
              <th className="text-left px-4 py-2 text-gray-700">Status</th>
              <th className="text-left px-4 py-2 text-gray-700">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map(
              ({
                id,
                name,
                email,
                phone,
                status,
                quoteValue,
                projectName,
                role,
              }) => (
                <tr
                  key={id}
                  className="border-b border-gray-100 hover:bg-[#e6f4ea]"
                >
                  <td className="px-4 py-3 text-gray-900">{name}</td>
                  <td className="px-4 py-3 text-gray-900">{email}</td>
                  <td className="px-4 py-3 text-gray-900">{phone}</td>

                  {routeUserType === "client" && (
                    <>
                      <td className="px-4 py-3 text-gray-900">{quoteValue}</td>
                      <td className="px-4 py-3 text-gray-900">{projectName}</td>
                    </>
                  )}

                  <td className="px-4 py-3">
                    <div
                      className={`inline-block px-3 py-1 rounded text-sm font-medium ${getStatusClasses(
                        status
                      )}`}
                    >
                      <Select
                        size="small"
                        value={status}
                        onChange={(newStatus: StatusType) => {
                          setUserData((prevData) =>
                            prevData.map((user) =>
                              user.id === id ? { ...user, status: newStatus } : user
                            )
                          );
                        }}
                      >
                        <Select.Option value="Active">Active</Select.Option>
                        <Select.Option value="Disable">Disable</Select.Option>
                        <Select.Option value="Suspended">Suspended</Select.Option>
                        <Select.Option value="In pipeline">In pipeline</Select.Option>
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
                          setViewUser({
                            id,
                            name,
                            email,
                            phone,
                            status,
                            quoteValue,
                            projectName,
                            role,
                          });
                          setDetailsModalOpen(true);
                        } else if (key === "edit") {
                          setMode("edit");
                          setSelectedUser({
                            id,
                            name,
                            email,
                            phone,
                            status,
                            quoteValue,
                            projectName,
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
      </div>

      {/* Drawer for Create/Edit */}
      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        width={720}
        title={mode === "create" ? "Create New User" : "Edit User"}
        destroyOnClose
      >
        <UserCreateEditPage
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
          userData={viewUser}
        />
      )}
    </>
  );
};

export default AdminTable;
