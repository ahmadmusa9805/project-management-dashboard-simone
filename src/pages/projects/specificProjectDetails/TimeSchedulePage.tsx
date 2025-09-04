/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Drawer, Modal, Spin, message } from "antd";

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

const TimeSchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

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
        if (schedule.documents) {
          navigate(`/projects/${projectId}/schedule-documents`, {
            state: {
              scheduleTitle: schedule.title,
              documents: schedule.documents,
            },
          });
        }
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

        await createTimeSchedule(submitData);
        successAlert("Schedule created successfully");
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
          data: { formData: submitData }, // Fixed parameter structure
        });
        successAlert("Schedule updated successfully");
      }

      setIsFormOpen(false);
      setEditingSchedule(null);
    } catch (error) {
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
    <div className="w-full px-4 gap-4 bg-white min-h-screen pt-3 ">
      <h1 className="text-xl font-bold mb-6 pt-8">Time Schedule </h1>

      <div className="flex justify-end mb-4">
        <CustomCreateButton
          title="Create Schedule"
          onClick={handleCreateClick}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {schedulesLoading ? (
          <div className="col-span-3 flex justify-center items-center h-40">
            <Spin size="large" />
          </div>
        ) : schedules.length > 0 ? (
          schedules.map((item: any) => (
            <div
              key={item._id}
              className="p-6 bg-gray-100 rounded shadow flex flex-col justify-between"
            >
              <div className="flex justify-between">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <CustomViewMoreButton
                  items={[
                    //TODO: add view schedule later
                    //  { key: "view", label: "👁️ View Schedule" },
                    { key: "edit", label: "✏️ Edit Schedule" },
                    { key: "share", label: "🔗 Share Schedule" },
                    {
                      key: "unshare",
                      label: (
                        <div className="flex items-center gap-1">
                          <Unlink className="text-green-500" size={14} />
                          Unshare Schedule
                        </div>
                      ),
                    },
                    {
                      key: "delete",
                      label: "🗑️ Delete Schedule",
                      danger: true,
                    },
                  ]}
                  onClick={(key) => handleMenuClick(key, item)}
                />
              </div>
              <p className="mt-2 text-gray-700">{item.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                {new Date(item.startDate).toLocaleDateString()} -{" "}
                {new Date(item.endDate).toLocaleDateString()}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-20 text-gray-500">
            No schedules found. Create your first schedule.
          </div>
        )}
      </div>

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
          roles={["prime-admin", "basic-admin", "client"]}
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
    </div>
  );
};

export default TimeSchedulePage;
