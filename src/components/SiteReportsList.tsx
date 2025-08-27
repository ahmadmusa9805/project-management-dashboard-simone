/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Table, Modal } from "antd";
import CustomViewMoreButton from "./CustomViewMoreButton";
import SiteReportDetail from "./SiteReportDetail";

interface SiteReportsListProps {
  reports: any[]; // receive the reports array from parent
  onDelete?: (reportId: string) => void;
}

const SiteReportsList: React.FC<SiteReportsListProps> = ({
  reports,
  onDelete,
}) => {
  const [selectedReportId, setSelectedReportId] = useState<string>("");
  const [detailMode, setDetailMode] = useState<"view" | "edit">("view");
  const [modalVisible, setModalVisible] = useState(false);

  const handleAction = (key: string, record: any) => {
    switch (key) {
      case "view":
        setSelectedReportId(record._id);
        setDetailMode("view");
        setModalVisible(true);
        break;
      case "edit":
        setSelectedReportId(record._id);
        setDetailMode("edit");
        setModalVisible(true);
        break;
      case "delete":
        if (onDelete) onDelete(record._id);
        break;
      default:
        break;
    }
  };

  const handleBack = () => {
    setModalVisible(false);
    setSelectedReportId("");
  };

  const handleModeChange = (mode: "view" | "edit") => {
    setDetailMode(mode);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <CustomViewMoreButton
          items={[
            { key: "view", label: "View" },
            { key: "edit", label: "Edit" },
            { key: "delete", label: "Delete" },
          ]}
          onClick={(key) => handleAction(key, record)}
        />
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={reports}
        rowKey={(record) => record._id}
        pagination={false}
      />

      <Modal
        open={modalVisible}
        onCancel={handleBack}
        footer={null}
        width={900}
        destroyOnClose
      >
        {selectedReportId && (
          <SiteReportDetail
            reportId={selectedReportId}
            mode={detailMode}
            onBack={handleBack}
            onModeChange={handleModeChange}
          />
        )}
      </Modal>
    </>
  );
};

export default SiteReportsList;
