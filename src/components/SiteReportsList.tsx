// import React, { useState } from "react";
// import { Table, Modal } from "antd";

// import CustomViewMoreButton from "./CustomViewMoreButton";
// import SiteReportDetail from "./SiteReportDetail";
// import CustomShareSelector from "./CustomShareSelector";
// import CustomUnshareSelector from "./CustomUnshareSelector";
// import SiteReportPDFExporter from "./SiteReportPDFExporter";

// import {
//   useShareSiteReportMutation,
//   useUnshareSiteReportMutation,
//   useGetSingleSiteReportQuery,
// } from "../Redux/features/projects/project/siteReportPictures/reportApi"; // Adjust import path
// import { errorAlert, successAlert } from "../utils/alerts";

// interface SiteReportsListProps {
//   reports: any[];
//   project: any;
//   currentUser: any;
//   onDelete?: (reportId: string) => void;
// }

// const SiteReportsList: React.FC<SiteReportsListProps> = ({
//   reports,
//   project,
//   currentUser,
//   onDelete,
// }) => {
//   const [selectedReportId, setSelectedReportId] = useState<string>("");
//   const [detailMode, setDetailMode] = useState<"view" | "edit">("view");
//   const [modalVisible, setModalVisible] = useState(false);

//   // Share/Unshare states
//   const [shareModalVisible, setShareModalVisible] = useState(false);
//   const [unshareModalVisible, setUnshareModalVisible] = useState(false);
//   const [selectedReportForSharing, setSelectedReportForSharing] =
//     useState<any>(null);
//   const [exportingReport, setExportingReport] = useState<any>(null);

//   // API hooks
//   const [shareSiteReport] = useShareSiteReportMutation();
//   const [unshareSiteReport] = useUnshareSiteReportMutation();
//   const { data: singleReportData } = useGetSingleSiteReportQuery(
//     selectedReportId,
//     {
//       skip: !selectedReportId,
//     }
//   );

//   const handleAction = (key: string, record: any) => {
//     switch (key) {
//       case "view":
//         setSelectedReportId(record._id);
//         setDetailMode("view");
//         setModalVisible(true);
//         break;
//       case "edit":
//         setSelectedReportId(record._id);
//         setDetailMode("edit");
//         setModalVisible(true);
//         break;
//       case "delete":
//         if (onDelete) onDelete(record._id);
//         break;
//       case "share":
//         setSelectedReportForSharing(record);
//         setSelectedReportId(record._id);
//         setShareModalVisible(true);
//         break;
//       case "unshare":
//         setSelectedReportForSharing(record);
//         setSelectedReportId(record._id);
//         setUnshareModalVisible(true);
//         break;
//       case "export":
//         setExportingReport(record);
//         break;
//       default:
//         break;
//     }
//   };

//   const handleBack = () => {
//     setModalVisible(false);
//     setSelectedReportId("");
//   };

//   const handleModeChange = (mode: "view" | "edit") => {
//     setDetailMode(mode);
//   };

//   const handleShare = async (selectedUsers: any[]) => {
//     try {
//       await shareSiteReport({
//         id: selectedReportForSharing._id,
//         sharedWith: selectedUsers,
//       }).unwrap();
//       successAlert("Report shared successfully");
//       setShareModalVisible(false);
//       setSelectedReportForSharing(null);
//     } catch (error) {
//       errorAlert("Failed to share report");
//     }
//   };

//   const handleUnshare = async (selectedUsers: any[]) => {
//     try {
//       await unshareSiteReport({
//         id: selectedReportForSharing._id,
//         unShareWith: selectedUsers.map((u) => u.userId),
//       }).unwrap();
//       successAlert("Report unshared successfully");
//       setUnshareModalVisible(false);
//       setSelectedReportForSharing(null);
//     } catch (error) {
//       errorAlert("Failed to unshare report");
//     }
//   };

//   const columns = [
//     {
//       title: "Title",
//       dataIndex: "title",
//       key: "title",
//     },
//     {
//       title: "Date",
//       dataIndex: "date",
//       key: "date",
//       render: (date: string) => new Date(date).toLocaleDateString(),
//     },
//     {
//       title: "Shared",
//       dataIndex: "isShared",
//       key: "isShared",
//       render: (isShared: boolean) => (isShared ? "Yes" : "No"),
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_: any, record: any) => (
//         <CustomViewMoreButton
//           items={[
//             { key: "view", label: "👀 View Report" },
//             { key: "export", label: "👀 Export Report" },
//             { key: "edit", label: "✏️ Edit Report" },
//             { key: "share", label: "🔗 Share Report" },
//             { key: "unshare", label: "🚫 Unshare Report" },
//             {
//               key: "delete",
//               label: "🗑️ Delete Report",
//               danger: true,
//             },
//           ]}
//           onClick={(key) => handleAction(key, record)}
//         />
//       ),
//     },
//   ];
//   console.log(reports);

//   return (
//     <>
//       <Table
//         columns={columns}
//         dataSource={reports}
//         rowKey={(record) => record._id}
//         pagination={false}
//       />

//       {/* Report Detail Modal */}
//       <Modal
//         open={modalVisible}
//         onCancel={handleBack}
//         footer={null}
//         width={900}
//         destroyOnClose
//       >
//         {selectedReportId && (
//           <SiteReportDetail
//             reportId={selectedReportId}
//             mode={detailMode}
//             onBack={handleBack}
//             onModeChange={handleModeChange}
//           />
//         )}
//       </Modal>

//       {/* Share Modal */}
//       <Modal
//         title="Share Report"
//         open={shareModalVisible}
//         onCancel={() => setShareModalVisible(false)}
//         footer={null}
//         width={500}
//       >
//         <CustomShareSelector
//           title="Share this report"
//           roles={["prime-admin", "basic-admin", "client"]}
//           onShare={handleShare}
//         />
//       </Modal>

//       {/* Unshare Modal */}
//       <Modal
//         title="Unshare Report"
//         open={unshareModalVisible}
//         onCancel={() => setUnshareModalVisible(false)}
//         footer={null}
//         width={500}
//       >
//         {singleReportData && (
//           <CustomUnshareSelector
//             title="Remove access from users"
//             sharedUsers={(singleReportData.sharedWith || []).map((u: any) => ({
//               userId: u.userId._id,
//               name: u.userId.name,
//               role: u.userId.role,
//               email: u.userId.email || "",
//               profileImg: u.userId.profileImg,
//             }))}
//             onUnshare={handleUnshare}
//           />
//         )}
//       </Modal>

//       {/* PDF Exporter */}
//       {exportingReport && (
//         <SiteReportPDFExporter
//           report={exportingReport}
//           project={project}
//           currentUser={currentUser}
//         />
//       )}
//     </>
//   );
// };

// export default SiteReportsList;

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Table, Modal, Spin, message } from "antd";

import CustomViewMoreButton from "./CustomViewMoreButton";
import SiteReportDetail from "./SiteReportDetail";
import CustomShareSelector from "./CustomShareSelector";
import CustomUnshareSelector from "./CustomUnshareSelector";
import SiteReportPDFExporter from "./SiteReportPDFExporter";

import {
  useShareSiteReportMutation,
  useUnshareSiteReportMutation,
  useGetSingleSiteReportQuery,
} from "../Redux/features/projects/project/siteReportPictures/reportApi";
import { errorAlert, successAlert } from "../utils/alerts";
import { useSelector } from "react-redux";
import type { RootState } from "../Redux/app/store";
import { USER_ROLE } from "../types/userAllTypes/user";

interface SiteReportsListProps {
  reports: any[];
  project: any;
  currentUser: any;
  onDelete?: (reportId: string) => void;
  refetchReports: () => void;
}

const SiteReportsList: React.FC<SiteReportsListProps> = ({
  refetchReports,
  reports,
  project,
  currentUser,
  onDelete,
}) => {
  const [selectedReportId, setSelectedReportId] = useState<string>("");
  const [detailMode, setDetailMode] = useState<"view" | "edit">("view");
  const [modalVisible, setModalVisible] = useState(false);

  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [unshareModalVisible, setUnshareModalVisible] = useState(false);
  const [selectedReportForSharing, setSelectedReportForSharing] =
    useState<any>(null);

  const [exportingReport, setExportingReport] = useState<any>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  const [shareSiteReport] = useShareSiteReportMutation();
  const [unshareSiteReport] = useUnshareSiteReportMutation();
  const { data: singleReportData } = useGetSingleSiteReportQuery(
    selectedReportId,
    {
      skip: !selectedReportId,
    }
  );

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
      case "share":
        setSelectedReportForSharing(record);
        setSelectedReportId(record._id);
        setShareModalVisible(true);
        break;
      case "unshare":
        setSelectedReportForSharing(record);
        setSelectedReportId(record._id);
        setUnshareModalVisible(true);
        break;
      case "export":
        // Validate report data before exporting
        if (!record || !record.title) {
          message.error("Invalid report data for export");
          return;
        }
        setIsExporting(true);
        setExportingReport(record);
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

  const handleShare = async (selectedUsers: any[]) => {
    try {
      await shareSiteReport({
        id: selectedReportForSharing._id,
        sharedWith: selectedUsers,
      }).unwrap();
      successAlert("Report shared successfully");
      setShareModalVisible(false);
      setSelectedReportForSharing(null);
    } catch (error) {
      errorAlert("Failed to share report");
    }
  };

  const handleUnshare = async (selectedUsers: any[]) => {
    try {
      await unshareSiteReport({
        id: selectedReportForSharing._id,
        unShareWith: selectedUsers.map((u) => u.userId),
      }).unwrap();
      successAlert("Report unshared successfully");
      setUnshareModalVisible(false);
      setSelectedReportForSharing(null);
    } catch (error) {
      errorAlert("Failed to unshare report");
    }
  };

  const handlePdfExportComplete = () => {
    setExportingReport(null);
    setIsExporting(false);
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
    // {
    //   title: "Shared",
    //   dataIndex: "isShared",
    //   key: "isShared",
    //   render: (isShared: boolean) => (isShared ? "Yes" : "No"),
    // },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <CustomViewMoreButton
          items={[
            { key: "view", label: "👀 View" },
            { key: "export", label: "👀 Export" },
            { key: "edit", label: "✏️ Edit" },
            // Only show share/unshare if user is not basic admin
            ...(userRole !== USER_ROLE.basicAdmin
              ? [
                  { key: "share", label: "🔗 Share" },
                  { key: "unshare", label: "🚫 Unshare" },
                ]
              : []),
            { key: "delete", label: "🗑️ Delete", danger: true },
          ]}
          onClick={(key) => handleAction(key, record)}
        />
      ),
    },
  ];
  console.log(reports);

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
            refetchReports={refetchReports}
            reportId={selectedReportId}
            mode={detailMode}
            onBack={handleBack}
            onModeChange={handleModeChange}
          />
        )}
      </Modal>

      <Modal
        title="Share Report"
        open={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        footer={null}
        width={500}
      >
        <CustomShareSelector
          title="Share this report"
          roles={["superAdmin", "primeAdmin", "basicAdmin", "client"]}
          onShare={handleShare}
        />
      </Modal>

      <Modal
        title="Unshare Report"
        open={unshareModalVisible}
        onCancel={() => setUnshareModalVisible(false)}
        footer={null}
        width={500}
      >
        {singleReportData && (
          <CustomUnshareSelector
            title="Remove access from users"
            sharedUsers={(singleReportData.sharedWith || []).map((u: any) => ({
              userId: u.userId._id,
              name: u.userId.name,
              role: u.userId.role,
              email: u.userId.email || "",
              profileImg: u.userId.profileImg,
            }))}
            onUnshare={handleUnshare}
          />
        )}
      </Modal>

      {exportingReport && (
        <SiteReportPDFExporter
          report={exportingReport}
          project={project}
          currentUser={currentUser}
          onComplete={handlePdfExportComplete}
        />
      )}

      <Modal
        title="Generating PDF..."
        open={isExporting}
        onCancel={() => {
          setIsExporting(false);
          setExportingReport(null);
        }}
        footer={null}
        closable={false}
        maskClosable={false}
      >
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
          <p style={{ marginTop: "16px" }}>
            Please wait while your PDF is being generated...
          </p>
          <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
            This may take a moment depending on the number of images.
          </p>
        </div>
      </Modal>
    </>
  );
};

export default SiteReportsList;
