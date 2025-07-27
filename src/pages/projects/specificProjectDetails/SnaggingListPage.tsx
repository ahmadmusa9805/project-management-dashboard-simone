import React, { useState } from "react";
import { Drawer } from "antd";
import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
import CustomCreateButton from "../../../components/CustomCreateButton";
import TaskScheduleForm from "../../../components/TaskScheduleForm";

// Dummy snagging list data
const mockSnaggingList = [
  {
    id: 1,
    title: "Snag 1",
    description: "Fix door hinge",
    startDate: "2025-08-05",
    endDate: "2025-08-07",
  },
  {
    id: 2,
    title: "Snag 2",
    description: "Paint wall",
    startDate: "2025-08-10",
    endDate: "2025-08-12",
  },
];

const SnaggingListPage: React.FC = () => {
  const [snaggingList, setSnaggingList] = useState(mockSnaggingList);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedSnag, setSelectedSnag] = useState<any>(null);

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

  // Handle actions from menu
  const handleMenuClick = (key: string, snag: any) => {
    switch (key) {
      case "edit":
        handleEditClick(snag);
        break;
      case "delete":
        if (window.confirm(`Are you sure to delete ${snag.title}?`)) {
          setSnaggingList((prev) => prev.filter((item) => item.id !== snag.id));
        }
        break;
      case "view":
        alert(`View details of ${snag.title} (implement as needed)`);
        break;
      case "share":
        alert(`Share ${snag.title} (implement as needed)`);
        break;
    }
  };

  // Handle form submission (create or edit)
  const handleFormSubmit = (formData: any) => {
    if (formMode === "create") {
      // Add new snagging item with unique id
      setSnaggingList((prev) => [...prev, { ...formData, id: Date.now() }]);
    } else {
      // Update existing snagging item
      setSnaggingList((prev) =>
        prev.map((item) => (item.id === selectedSnag.id ? { ...item, ...formData } : item))
      );
    }
    setIsFormOpen(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">Manage Snagging List</h1>

      <div className="flex justify-end mb-4">
        <CustomCreateButton title="Create Task" onClick={handleCreateClick} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {snaggingList.map((snag) => (
          <div
            key={snag.id}
            className="p-6 bg-gray-100 rounded shadow flex flex-col justify-between"
          >
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">{snag.title}</h3>
              <CustomViewMoreButton
                items={[
                  { key: "view", label: "View" },
                  { key: "edit", label: "Edit" },
                  { key: "share", label: "Share" },
                  { key: "delete", label: "Delete" },
                ]}
                onClick={(key) => handleMenuClick(key, snag)}
              />
            </div>
            <p className="mt-2 text-gray-700">{snag.description}</p>
          </div>
        ))}
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
  entityName="Task"
  mode={formMode}
  initialData={selectedSnag}
  onCancel={() => setIsFormOpen(false)}
  onSubmit={handleFormSubmit}
/>

      </Drawer>
    </div>
  );
};

export default SnaggingListPage;
