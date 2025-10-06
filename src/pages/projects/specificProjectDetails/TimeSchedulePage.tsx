/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Col, Drawer, Modal, Row, Spin, message } from "antd";

import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
import TaskScheduleForm from "../../../components/TaskScheduleForm";
import CustomCreateButton from "../../../components/CustomCreateButton";
import CustomShareSelector from "../../../components/CustomShareSelector";
import CustomUnshareSelector from "../../../components/CustomUnshareSelector";

import {
  useGetAllTimeSchedulesQuery,
  useGetSingleTimeScheduleQuery,
  useCreateTimeScheduleMutation,
  useUpdateTimeScheduleMutation,
  useDeleteTimeScheduleMutation,
  useShareTimeScheduleMutation,
  useUnShareTimeScheduleMutation,
} from "../../../Redux/features/projects/project/timeSchedule/timeScheduleApi";

import type { SharedUser } from "../../../Redux/features/projects/projectsApi";
import { errorAlert, successAlert } from "../../../utils/alerts";
import { showDeleteAlert } from "../../../utils/deleteAlert";
import { Unlink } from "lucide-react";
import { USER_ROLE } from "../../../types/userAllTypes/user";
import { useSelector } from "react-redux";
import type { RootState } from "../../../Redux/app/store";
import ViewSnaggingAndTimeSchedule from "../../../components/ViewSnaggingAndTimeSchedule";

const TimeSchedulePage: React.FC = () => {
  // const navigate = useNavigate();
  const { projectId } = useParams();
  const userRole = useSelector((state: RootState) => state.auth.user?.role);
  const { data: schedulesData, isLoading: schedulesLoading } =
    useGetAllTimeSchedulesQuery({ projectId });
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(
    null
  );
  const { data: singleScheduleData } = useGetSingleTimeScheduleQuery(
    selectedScheduleId!,
    {
      skip: !selectedScheduleId,
    }
  );

  const [createTimeSchedule, { isLoading: createLoading }] =
    useCreateTimeScheduleMutation();
  const [updateTimeSchedule, { isLoading: updateLoading }] =
    useUpdateTimeScheduleMutation();
  const [deleteTimeSchedule] = useDeleteTimeScheduleMutation();
  const [shareTimeSchedule] = useShareTimeScheduleMutation();
  const [unShareTimeSchedule] = useUnShareTimeScheduleMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingSchedule, setEditingSchedule] = useState<any>(null);

  // Share modal state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareSchedule, setShareSchedule] = useState<any>(null);

  // Unshare modal state
  const [unshareModalOpen, setUnshareModalOpen] = useState(false);
  const [viewData, setViewData] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  useEffect(() => {
    // Refetch data if needed
  }, [projectId]);

  const handleCreateClick = () => {
    setFormMode("create");
    setEditingSchedule(null);
    setIsFormOpen(true);
  };

  const handleMenuClick = (key: string, schedule: any) => {
    switch (key) {
      case "view":
        // if (schedule.documents) {
        //   navigate(`/projects/${projectId}/schedule-documents`, {
        //     state: {
        //       scheduleTitle: schedule.title,
        //       documents: schedule.documents,
        //     },
        //   });
        // }
        setViewData(schedule);
        setIsViewOpen(true);
        break;
        break;
      case "edit":
        setFormMode("edit");
        setEditingSchedule(schedule);
        setIsFormOpen(true);
        break;
      case "share":
        setShareSchedule(schedule);
        setShareModalOpen(true);
        break;
      case "unshare":
        setSelectedScheduleId(schedule._id);
        setUnshareModalOpen(true);
        break;
      case "delete":
        handleDeleteSchedule(schedule._id);
        break;
    }
  };

  const handleFormSubmit = async (formData: any) => {
    console.log("Form Data Submitted:", formData);
    try {
      if (formMode === "create") {
        // For creation, use the FormData structure expected by the API
        const submitData = new FormData();

        // Append file if it exists
        if (formData.file) {
          submitData.append("file", formData.file);
        }

        // Append JSON data
        submitData.append(
          "data",
          JSON.stringify({
            projectId: projectId,
            title: formData.title,
            startDate: formData.startDate,
            endDate: formData.endDate,
            description: formData.description,
          })
        );

        const res = await createTimeSchedule(submitData);
        if (res.data.success) {
          successAlert("Schedule created successfully");
        } else {
          errorAlert("Failed to create schedule");
        }
      } else {
        // For update, use the correct parameter structure
        const submitData = new FormData();

        // Append file if it exists
        if (formData.file) {
          submitData.append("file", formData.file);
        }

        // Append JSON data
        submitData.append(
          "data",
          JSON.stringify({
            projectId: projectId,
            title: formData.title,
            startDate: formData.startDate,
            endDate: formData.endDate,
            description: formData.description,
          })
        );

        await updateTimeSchedule({
          id: editingSchedule._id,
          data: submitData, // Fixed parameter structure
        }).unwrap();
        successAlert("Schedule updated successfully");
      }

      setIsFormOpen(false);
      setEditingSchedule(null);
    } catch (error) {
      errorAlert("Save Error", "Failed to save schedule");
      errorAlert("Failed to save schedule");
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    showDeleteAlert({
      onConfirm: async () => {
        try {
          await deleteTimeSchedule(id);
        } catch (err: any) {
          errorAlert(
            "Delete Error",
            err?.data?.message || "Failed to delete schedule"
          );
        }
      },
    });
  };

  const handleConfirmShare = async (selectedUsers: SharedUser[]) => {
    try {
      await shareTimeSchedule({
        id: shareSchedule._id,
        sharedWith: selectedUsers,
      });
      message.success("Schedule shared successfully");
      setShareModalOpen(false);
      setShareSchedule(null);
    } catch (error) {
      message.error("Failed to share schedule");
    }
  };

  const handleConfirmUnshare = async (selectedUsers: SharedUser[]) => {
    try {
      await unShareTimeSchedule({
        id: selectedScheduleId!,
        unShareWith: selectedUsers.map((u) => u.userId),
      });
      message.success("Schedule unshared successfully");
      setUnshareModalOpen(false);
      setSelectedScheduleId(null);
    } catch (error) {
      message.error("Failed to unshare schedule");
    }
  };

  const schedules = schedulesData?.data || [];

  return (
    <div className="w-full p-6 gap-4 bg-white min-h-screen  ">
      <div className="flex justify-between py-10">
        <h1 className="text-2xl font-semibold">Time Schedules</h1>
        {/* <CustomSearchInput onSearch={() => {}} /> */}
        <CustomCreateButton
          title="Create Schedule"
          onClick={handleCreateClick}
        />
      </div>
      {/* <h1 className="text-xl font-bold mb-6 pt-8">Time Schedule </h1>

      <div className="flex justify-end mb-4">
        <CustomCreateButton
          title="Create Schedule"
          onClick={handleCreateClick}
        />
      </div> */}
      <Row gutter={[16, 16]}>
        {schedulesLoading ? (
          <div className="col-span-3 flex justify-center items-center h-40 w-full">
            <Spin size="large" />
          </div>
        ) : schedules.length > 0 ? (
          schedules.map((item: any) => (
            <Col span={6} key={item._id}>
              <Card
                onClick={() => {
                  handleMenuClick("view", item);
                }}
                style={{ backgroundColor: "#f1f1f1" }}
                hoverable
                bodyStyle={{
                  backgroundColor: "#f1f1f1",
                  padding: "12px 24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  minHeight: "60px", // keep card height consistent
                }}
                title={
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {item.title}
                  </h3>
                }
                extra={
                  <CustomViewMoreButton
                    items={[
                      { key: "view", label: "👀 View" },
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
                    onClick={(key) => handleMenuClick(key, item)}
                  />
                }
              >
                <div className="flex justify-between">
                  <p className="text-gray-700 truncate">{item.description}</p>
                  <div className=" text-sm  text-gray-500">
                    {new Date(item.startDate).toLocaleDateString()} -{" "}
                    {new Date(item.endDate).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            </Col>
          ))
        ) : (
          <div className="col-span-3 text-center py-20 text-gray-500 w-full">
            No schedules found. Create your first schedule.
          </div>
        )}
      </Row>

      {/* Drawer for create/edit */}
      <Drawer
        title={formMode === "create" ? "Create Schedule" : "Edit Schedule"}
        placement="right"
        width={480}
        onClose={() => {
          setIsFormOpen(false);
          setEditingSchedule(null);
        }}
        open={isFormOpen}
        destroyOnClose
      >
        <TaskScheduleForm
          creating={createLoading}
          updating={updateLoading}
          entityName="Schedule"
          mode={formMode}
          initialData={editingSchedule}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingSchedule(null);
          }}
          onSubmit={handleFormSubmit}
        />
      </Drawer>

      {/* Modal for Sharing */}
      <Modal
        title="Share Schedule"
        open={shareModalOpen}
        onCancel={() => {
          setShareModalOpen(false);
          setShareSchedule(null);
        }}
        footer={null}
        width={500}
        destroyOnClose
      >
        <CustomShareSelector
          title="Share this schedule"
          roles={["superAdmin", "primeAdmin", "basicAdmin", "client"]}
          onShare={handleConfirmShare}
        />
      </Modal>

      {/* Modal for Unsharing */}
      <Modal
        title="Unshare Schedule"
        open={unshareModalOpen}
        onCancel={() => {
          setUnshareModalOpen(false);
          setSelectedScheduleId(null);
        }}
        footer={null}
        width={500}
        destroyOnClose
      >
        <CustomUnshareSelector
          title="Remove access from users"
          sharedUsers={(singleScheduleData?.sharedWith || []).map((u: any) => ({
            userId: u.userId._id,
            name: u.userId.name,
            role: u.userId.role,
            email: u.userId.email || "",
            profileImg: u.userId.profileImg,
          }))}
          onUnshare={handleConfirmUnshare}
        />
      </Modal>

      <Drawer
        title=""
        placement="right"
        width={600}
        onClose={() => setIsViewOpen(false)}
        open={isViewOpen}
      >
        <ViewSnaggingAndTimeSchedule
          data={viewData}
          type="timeSchedule"
          onClose={() => setIsViewOpen(false)}
        />
      </Drawer>
    </div>
  );
};

export default TimeSchedulePage;
