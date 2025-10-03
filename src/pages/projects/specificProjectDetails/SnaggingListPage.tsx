/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import React, { useState } from "react";
// import { Drawer } from "antd";
// import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
// import CustomCreateButton from "../../../components/CustomCreateButton";
// import TaskScheduleForm from "../../../components/TaskScheduleForm";

// // Dummy snagging list data
// const mockSnaggingList = [
//   {
//     id: 1,
//     title: "Snag 1",
//     description: "Fix door hinge",
//     startDate: "2025-08-05",
//     endDate: "2025-08-07",
//   },
//   {
//     id: 2,
//     title: "Snag 2",
//     description: "Paint wall",
//     startDate: "2025-08-10",
//     endDate: "2025-08-12",
//   },
// ];

// const SnaggingListPage: React.FC = () => {
//   const [snaggingList, setSnaggingList] = useState(mockSnaggingList);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [formMode, setFormMode] = useState<"create" | "edit">("create");
//   const [selectedSnag, setSelectedSnag] = useState<any>(null);

//   // Open create form
//   const handleCreateClick = () => {
//     setFormMode("create");
//     setSelectedSnag(null);
//     setIsFormOpen(true);
//   };

//   // Open edit form
//   const handleEditClick = (snag: any) => {
//     setFormMode("edit");
//     setSelectedSnag(snag);
//     setIsFormOpen(true);
//   };

//   // Handle actions from menu
//   const handleMenuClick = (key: string, snag: any) => {
//     switch (key) {
//       case "edit":
//         handleEditClick(snag);
//         break;
//       case "delete":
//         if (window.confirm(`Are you sure to delete ${snag.title}?`)) {
//           setSnaggingList((prev) => prev.filter((item) => item.id !== snag.id));
//         }
//         break;
//       case "view":
//         alert(`View details of ${snag.title} (implement as needed)`);
//         break;
//       case "share":
//         alert(`Share ${snag.title} (implement as needed)`);
//         break;
//     }
//   };

//   // Handle form submission (create or edit)
//   const handleFormSubmit = (formData: any) => {
//     if (formMode === "create") {
//       // Add new snagging item with unique id
//       setSnaggingList((prev) => [...prev, { ...formData, id: Date.now() }]);
//     } else {
//       // Update existing snagging item
//       setSnaggingList((prev) =>
//         prev.map((item) => (item.id === selectedSnag.id ? { ...item, ...formData } : item))
//       );
//     }
//     setIsFormOpen(false);
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-bold mb-6">Manage Snagging List</h1>

//       <div className="flex justify-end mb-4">
//         <CustomCreateButton title="Create Task" onClick={handleCreateClick} />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {snaggingList.map((snag) => (
//           <div
//             key={snag.id}
//             className="p-6 bg-gray-100 rounded shadow flex flex-col justify-between"
//           >
//             <div className="flex justify-between">
//               <h3 className="text-lg font-semibold">{snag.title}</h3>
//               <CustomViewMoreButton
//                 items={[
//                   { key: "view", label: "View" },
//                   { key: "edit", label: "Edit" },
//                   { key: "share", label: "Share" },
//                   { key: "delete", label: "Delete" },
//                 ]}
//                 onClick={(key) => handleMenuClick(key, snag)}
//               />
//             </div>
//             <p className="mt-2 text-gray-700">{snag.description}</p>
//           </div>
//         ))}
//       </div>

//       {/* Drawer for create/edit snag */}
//       <Drawer
//         title={formMode === "create" ? "Create Task" : "Edit Task"}
//         placement="right"
//         width={480}
//         onClose={() => setIsFormOpen(false)}
//         open={isFormOpen}
//       >
//        <TaskScheduleForm
//   entityName="Task"
//   mode={formMode}
//   initialData={selectedSnag}
//   onCancel={() => setIsFormOpen(false)}
//   onSubmit={handleFormSubmit}
// />

//       </Drawer>
//     </div>
//   );
// };

// export default SnaggingListPage;

import React, { useState, useEffect } from "react";
import { Card, Col, Drawer, Modal, Row, Spin } from "antd";
import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
import CustomCreateButton from "../../../components/CustomCreateButton";
import TaskScheduleForm from "../../../components/TaskScheduleForm";
import CustomShareSelector from "../../../components/CustomShareSelector";
import CustomUnshareSelector from "../../../components/CustomUnshareSelector";
import { useParams } from "react-router-dom";

import {
  useGetAllSnaggingsQuery,
  useGetSingleSnaggingQuery,
  useCreateSnaggingMutation,
  useUpdateSnaggingMutation,
  useDeleteSnaggingMutation,
  useShareSnaggingMutation,
  useUnShareSnaggingMutation,
} from "../../../Redux/features/projects/project/snaggingList/snaggingListApi";

// Import the SharedUser type from CustomShareSelector to ensure consistency
import type { SharedUser as ShareSelectorUser } from "../../../components/CustomShareSelector";

// Import the custom alert functions
import { successAlert, errorAlert } from "../../../utils/alerts";
import { showDeleteAlert } from "../../../utils/deleteAlert";

import { buildFormData } from "../../../utils/buildFormData";
import { Unlink } from "lucide-react";
import { USER_ROLE } from "../../../types/userAllTypes/user";
import { useSelector } from "react-redux";
import type { RootState } from "../../../Redux/app/store";

// Define the full user interface for unsharing
interface FullSharedUser {
  userId: string;
  name: string;
  role: string;
  email: string;
  profileImg?: string;
}

const SnaggingListPage: React.FC = () => {
  const { projectId } = useParams();
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  // RTK Query hooks
  const {
    data: snaggingsData,
    isLoading,
    error,
    refetch,
  } = useGetAllSnaggingsQuery({ projectId });

  const [selectedSnagId, setSelectedSnagId] = useState<string | null>(null);
  const { data: singleSnagData } = useGetSingleSnaggingQuery(selectedSnagId!, {
    skip: !selectedSnagId,
  });

  const [createSnagging, { isLoading: isCreating }] =
    useCreateSnaggingMutation();
  const [updateSnagging, { isLoading: isUpdating }] =
    useUpdateSnaggingMutation();
  const [deleteSnagging] = useDeleteSnaggingMutation();
  const [shareSnagging] = useShareSnaggingMutation();
  const [unShareSnagging] = useUnShareSnaggingMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedSnag, setSelectedSnag] = useState<any>(null);

  // Share modal state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareSnag, setShareSnag] = useState<any>(null);

  // Unshare modal state
  const [unshareModalOpen, setUnshareModalOpen] = useState(false);

  // Extract snagging list from API response
  const snaggingList = snaggingsData?.data || [];

  useEffect(() => {
    if (error) {
      errorAlert(
        "Failed to fetch snaggings",
        "There was an issue fetching the snagging list."
      );
    }
  }, [error]);

  // Open create form
  const handleCreateClick = () => {
    setFormMode("create");
    setSelectedSnag(null);
    setIsFormOpen(true);
  };

  // Open edit form
  const handleEditClick = (snag: any) => {
    setFormMode("edit");
    setSelectedSnag(snag);
    setIsFormOpen(true);
  };

  // Handle delete snagging
  const handleDeleteSnagging = async (id: string) => {
    try {
      await deleteSnagging(id).unwrap();
      refetch(); // Refetch after successful deletion
    } catch (error) {
      errorAlert(
        "Failed to delete snagging",
        "An error occurred while trying to delete the snagging."
      );
    }
  };

  // Open Share Modal
  const handleShareSnagging = (snag: any) => {
    setShareSnag(snag);
    setShareModalOpen(true);
  };

  // Confirm Share - Use the correct SharedUser type from CustomShareSelector
  const handleConfirmShare = async (selectedUsers: ShareSelectorUser[]) => {
    try {
      await shareSnagging({
        id: shareSnag._id,
        sharedWith: selectedUsers,
      }).unwrap();
      successAlert(
        "Snagging Shared",
        "The snagging has been successfully shared."
      );
      setShareModalOpen(false);
      setShareSnag(null);
      refetch();
    } catch (error) {
      errorAlert(
        "Failed to share snagging",
        "An error occurred while trying to share the snagging."
      );
    }
  };

  // Open Unshare Modal
  const handleUnShareSnagging = (snag: any) => {
    setSelectedSnagId(snag._id);
    setUnshareModalOpen(true);
  };

  // Confirm Unshare - Use the full user interface for unsharing
  const handleConfirmUnshare = async (selectedUsers: FullSharedUser[]) => {
    try {
      await unShareSnagging({
        id: selectedSnagId!,
        unShareWith: selectedUsers.map((u) => u.userId),
      }).unwrap();
      successAlert(
        "Snagging Unshared",
        "The snagging has been successfully unshared."
      );
      setUnshareModalOpen(false);
      setSelectedSnagId(null);
      refetch();
    } catch (error) {
      errorAlert(
        "Failed to unshare snagging",
        "An error occurred while trying to unshare the snagging."
      );
    }
  };

  // Handle actions from menu
  const handleMenuClick = (key: string, snag: any) => {
    switch (key) {
      case "edit":
        handleEditClick(snag);
        break;
      case "delete":
        showDeleteAlert({
          title: `Delete ${snag.title}?`,
          text: "This action cannot be undone.",
          onConfirm: () => handleDeleteSnagging(snag._id),
        });
        break;
      case "view":
        alert(`View details of ${snag.title} (implement as needed)`);
        break;
      case "share":
        handleShareSnagging(snag);
        break;
      case "unshare":
        handleUnShareSnagging(snag);
        break;
    }
  };

  // Handle form submission (create or edit)
  const handleFormSubmit = async (formData: any) => {
    try {
      const formDataToSend = buildFormData({
        ...formData,
        projectId,
      });

      if (formMode === "create") {
        await createSnagging(formDataToSend).unwrap();
        successAlert(
          "Snagging Created",
          "The new snagging has been successfully created."
        );
      } else {
        await updateSnagging({
          id: selectedSnag._id,
          data: formDataToSend,
        }).unwrap();
        successAlert(
          "Snagging Updated",
          "The snagging has been successfully updated."
        );
      }

      setIsFormOpen(false);
      refetch();
    } catch (error) {
      errorAlert(
        `Failed to ${formMode === "create" ? "create" : "update"} snagging`,
        "An error occurred during the operation."
      );
    }
  };

  return (
    <div className="w-full gap-4 bg-white min-h-screen p-6 ">
      <div className="flex justify-between py-10">
        <h1 className="text-2xl font-semibold">Snagging Lists</h1>
        {/* <CustomSearchInput onSearch={() => {}} /> */}
        <CustomCreateButton title="Create Task" onClick={handleCreateClick} />
      </div>
      {/* <h1 className="text-xl font-bold mb-6 pt-8">Manage Snagging List</h1>

      <div className="flex justify-end mb-4">
        <CustomCreateButton title="Create Task" onClick={handleCreateClick} />
      </div> */}

      <div className="mt-6">
        <Row gutter={[16, 16]}>
          {isLoading ? (
            <div className="col-span-3 flex justify-center items-center h-40 w-full">
              <Spin size="large" />
            </div>
          ) : snaggingList.length > 0 ? (
            snaggingList.map((snag: any) => (
              <Col span={6} key={snag._id}>
                <Card
                  style={{ backgroundColor: "#f1f1f1" }}
                  hoverable
                  bodyStyle={{
                    backgroundColor: "#f1f1f1",
                    padding: "12px 24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    minHeight: "60px", // ✅ keep card height consistent
                  }}
                  title={
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {snag.title}
                    </h3>
                  }
                  extra={
                    <CustomViewMoreButton
                      items={[
                        // { key: "view", label: "👀 View" },
                        { key: "edit", label: "✏️ Edit " },

                        // ✅ Only show share/unshare if user is NOT basicAdmin
                        ...(userRole !== USER_ROLE.basicAdmin
                          ? [
                              { key: "share", label: "🔗 Share " },
                              {
                                key: "unshare",
                                label: (
                                  <div className="flex items-center gap-1">
                                    <Unlink
                                      className="text-green-500"
                                      size={14}
                                    />
                                    Unshare
                                  </div>
                                ),
                              },
                            ]
                          : []),
                        {
                          key: "delete",
                          label: "🗑️ Delete",
                          danger: true,
                        },
                      ]}
                      onClick={(key) => handleMenuClick(key, snag)}
                    />
                  }
                >
                  <p className="text-gray-700 line-clamp-2">
                    {snag.description}
                  </p>
                  {/* <div className="mt-2 text-sm text-gray-500 space-y-1">
                    {snag.startDate && <p>Start: {snag.startDate}</p>}
                    {snag.endDate && <p>End: {snag.endDate}</p>}
                    {snag.isShared && (
                      <p className="text-green-600 font-medium">✅ Shared</p>
                    )}
                  </div> */}
                </Card>
              </Col>
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-gray-500 w-full">
              No snagging tasks found. Create your first task.
            </div>
          )}
        </Row>
      </div>

      {/* Drawer for create/edit snag */}
      <Drawer
        title={formMode === "create" ? "Create Task" : "Edit Task"}
        placement="right"
        width={480}
        onClose={() => setIsFormOpen(false)}
        open={isFormOpen}
      >
        <TaskScheduleForm
          creating={isCreating}
          updating={isUpdating}
          entityName="Task"
          mode={formMode}
          initialData={selectedSnag}
          onCancel={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      </Drawer>

      {/* Modal for Sharing */}
      <Modal
        title="Share Snagging"
        open={shareModalOpen}
        onCancel={() => {
          setShareModalOpen(false);
          setShareSnag(null);
        }}
        footer={null}
        width={500}
      >
        <CustomShareSelector
          title="Share this snagging"
          roles={["prime-admin", "basic-admin", "client"]}
          onShare={handleConfirmShare}
        />
      </Modal>

      {/* Modal for Unsharing */}
      <Modal
        title="Unshare Snagging"
        open={unshareModalOpen}
        onCancel={() => {
          setUnshareModalOpen(false);
          setSelectedSnagId(null);
        }}
        footer={null}
        width={500}
      >
        <CustomUnshareSelector
          title="Remove access from users"
          sharedUsers={(singleSnagData?.sharedWith || []).map((u: any) => ({
            userId: u.userId._id,
            name: u.userId.name,
            role: u.userId.role,
            email: u.userId.email || "",
            profileImg: u.userId.profileImg,
          }))}
          onUnshare={handleConfirmUnshare}
        />
      </Modal>
    </div>
  );
};

export default SnaggingListPage;
