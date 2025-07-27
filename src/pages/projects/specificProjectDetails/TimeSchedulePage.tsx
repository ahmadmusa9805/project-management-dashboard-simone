import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Drawer } from "antd";

import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
import TaskScheduleForm from "../../../components/TaskScheduleForm";
import CustomCreateButton from "../../../components/CustomCreateButton";

// Dummy schedule data
const mockSchedules = [
  {
    id: 1,
    title: "Schedule 1",
    description: "Details for schedule 1",
    startDate: "2025-08-01",
    endDate: "2025-08-10",
    documents: [
      { id: 101, title: "Schedule Doc 1", fileUrl: "/docs/schedule1.pdf", amount: 100 },
    ],
  },
  {
    id: 2,
    title: "Schedule 2",
    description: "Details for schedule 2",
    startDate: "2025-09-01",
    endDate: "2025-09-10",
    documents: [
      { id: 102, title: "Schedule Doc 2", fileUrl: "/docs/schedule2.pdf", amount: 200 },
    ],
  },
];

const TimeSchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [schedules, setSchedules] = useState(mockSchedules);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);

  useEffect(() => {
    // Load schedules from API or Redux here if needed
  }, []);

  const handleCreateClick = () => {
    setFormMode("create");
    setSelectedSchedule(null);
    setIsFormOpen(true);
  };

  const handleMenuClick = (key: string, schedule: any) => {
    switch (key) {
      case "view":
        if (schedule.documents) {
          navigate(`/projects/${projectId}/schedule-documents`, {
            state: {
              quoteTitle: schedule.title,
              documents: schedule.documents,
            },
          });
        }
        break;
      case "edit":
        setFormMode("edit");
        setSelectedSchedule(schedule);
        setIsFormOpen(true);
        break;
      case "share":
        alert(`Share schedule: ${schedule.title}`);
        break;
      case "delete":
        if (window.confirm(`Are you sure to delete ${schedule.title}?`)) {
          setSchedules((prev) => prev.filter((s) => s.id !== schedule.id));
        }
        break;
    }
  };

  const handleFormSubmit = (formData: any) => {
    if (formMode === "create") {
      setSchedules((prev) => [...prev, { ...formData, id: Date.now() }]);
    } else {
      setSchedules((prev) =>
        prev.map((s) => (s.id === selectedSchedule.id ? { ...s, ...formData } : s))
      );
    }
    setIsFormOpen(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">Time Schedule Page</h1>

        <div className="flex justify-end mb-4">
        <CustomCreateButton title="Create Schedule" onClick={handleCreateClick} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {schedules.map((item) => (
          <div
            key={item.id}
            className="p-6 bg-gray-100 rounded shadow flex flex-col justify-between"
          >
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <CustomViewMoreButton
                items={[
                  { key: "view", label: "View Documents" },
                  { key: "edit", label: "Edit" },
                  { key: "share", label: "Share" },
                  { key: "delete", label: "Delete" },
                ]}
                onClick={(key) => handleMenuClick(key, item)}
              />
            </div>
            <p className="mt-2 text-gray-700">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Drawer for create/edit */}
      <Drawer
        title={formMode === "create" ? "Create Schedule" : "Edit Schedule"}
        placement="right"
        width={480}
        onClose={() => setIsFormOpen(false)}
        open={isFormOpen}
      >
        <TaskScheduleForm
          entityName="Schedule"
          mode={formMode}
          initialData={selectedSchedule}
          onCancel={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      </Drawer>
    </div>
  );
};

export default TimeSchedulePage;
