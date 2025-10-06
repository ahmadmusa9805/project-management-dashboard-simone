// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Modal } from "antd";
// import { useNavigate, useParams } from "react-router-dom";
// import CreateFolder from "../../../components/CreateFolder";
// import CustomCreateButton from "../../../components/CustomCreateButton";
// import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
// import { useEffect, useState } from "react";
// import {
//   useGetAllSitePictureFoldersQuery,
//   useCreateSitePictureFolderMutation,
//   useDeleteSitePictureFolderMutation,
//   useShareSitePictureFolderMutation,
//   useUnshareSitePictureFolderMutation,
// } from "../../../Redux/features/projects/project/siteReportPictures/sitePictureFolderApi";

// const autoCreateFolders = [
//   { id: "demolitions", title: "Demolitions", isStatic: true },
//   { id: "structural-works", title: "Structural works", isStatic: true },
//   { id: "internal-works", title: "Internal works", isStatic: true },
//   { id: "m-e", title: "M/E", isStatic: true },
//   { id: "finishing", title: "Finishing", isStatic: true },
// ];

// const reportFolder = { id: "report", title: "Report", isStatic: true };

// const SitePicturesReportsPage = () => {
//   const navigate = useNavigate();
//   const { projectId } = useParams();

//   const { data, isLoading, refetch } = useGetAllSitePictureFoldersQuery({
//     projectId,
//   });
//   const [createFolder] = useCreateSitePictureFolderMutation();
//   const [deleteFolder] = useDeleteSitePictureFolderMutation();
//   const [shareFolder] = useShareSitePictureFolderMutation();
//   const [unshareFolder] = useUnshareSitePictureFolderMutation();

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     refetch();
//   }, [refetch]);

//   const handleFolderClick = (folderId: string) => {
//     navigate(`/projects/${projectId}/site-pictures-reports/${folderId}`);
//   };

//   const handleCreateFolder = async (folderName: string) => {
//     await createFolder({ title: folderName, projectId });
//     setIsModalOpen(false);
//     refetch();
//   };

//   // Check if a folder is static (from autoCreateFolders or Report)
//   const isStaticFolder = (folder: any) => {
//     return (
//       folder.isStatic ||
//       autoCreateFolders.some((f) => f.title === folder.title) ||
//       folder.id === "report"
//     );
//   };

//   // Handle actions from ViewMoreButton
//   const handleFolderAction = async (folder: any, key: string) => {
//     switch (key) {
//       case "delete":
//         await deleteFolder(folder._id || folder.id);
//         refetch();
//         break;
//       case "share":
//         refetch();
//         break;
//       case "unshare":
//         refetch();
//         break;
//       case "edit":
//         // Add edit logic if needed
//         break;
//       default:
//         break;
//     }
//   };

//   if (isLoading) return <p>Loading...</p>;

//   // Merge DB folders + static Report folder for display
//   const allFolders = [...data.data, reportFolder];

//   return (
//     <div className="w-full px-4 gap-4 bg-white min-h-screen pt-3">
//       {/* Header */}
//       <div className="self-stretch flex justify-between items-center p-3">
//         <h1 className="text-gray-950 text-2xl font-medium">
//           Site Pictures & Reports
//         </h1>
//         <CustomCreateButton
//           title="Create New Category"
//           onClick={() => setIsModalOpen(true)}
//         />
//       </div>

//       {/* Folder Grid */}
//       <div className="self-stretch flex-1 flex flex-wrap gap-4">
//         {allFolders.map((folder: any) => {
//           const isStatic = isStaticFolder(folder);

//           return (
//             <div
//               key={folder._id || folder.id}
//               className="w-80 h-28 px-3 py-8 bg-gray-100 rounded flex justify-between items-center gap-4 cursor-pointer transition"
//             >
//               <div
//                 className="flex flex-col flex-1"
//                 onClick={() => handleFolderClick(folder._id || folder.id)}
//               >
//                 <div className="text-gray-950 text-lg font-medium truncate">
//                   {folder.title}
//                 </div>
//                 {!isStatic && (
//                   <span className="text-xs text-gray-500">Custom Folder</span>
//                 )}
//               </div>

//               {!(folder.isStatic && folder.id === "report") && (
//                 <CustomViewMoreButton
//                   items={[
//                     { key: "view quote", label: "👁️ View Quote" },
//                     { key: "edit", label: "✏️ Edit Quote" },
//                     { key: "share", label: "🔗 Share Quote" },
//                     { key: "unshare", label: "🚫 Unshare Quote" },
//                     { key: "delete", label: "🗑️ Delete Quote", danger: true },
//                   ]}
//                   onClick={(key) => handleFolderAction(folder, key)}
//                 />
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* Modal for creating custom folder */}
//       <Modal
//         open={isModalOpen}
//         onCancel={() => setIsModalOpen(false)}
//         footer={null}
//       >
//         <CreateFolder
//           onCancel={() => setIsModalOpen(false)}
//           onCreate={handleCreateFolder}
//         />
//       </Modal>
//     </div>
//   );
// };

// export default SitePicturesReportsPage;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Modal, Row, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import CreateFolder from "../../../components/CreateFolder";
import CustomCreateButton from "../../../components/CustomCreateButton";
import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
import CustomShareSelector from "../../../components/CustomShareSelector";
import CustomUnshareSelector from "../../../components/CustomUnshareSelector";
import { useEffect, useState } from "react";
import {
  useGetAllSitePictureFoldersQuery,
  useCreateSitePictureFolderMutation,
  useDeleteSitePictureFolderMutation,
  useShareSitePictureFolderMutation,
  useUnshareSitePictureFolderMutation,
  useGetSingleSitePictureFolderQuery,
} from "../../../Redux/features/projects/project/siteReportPictures/sitePictureFolderApi";
import { successAlert, errorAlert } from "../../../utils/alerts";
import { showDeleteAlert } from "../../../utils/deleteAlert";
import { Unlink } from "lucide-react";

const autoCreateFolders = [
  { id: "demolitions", title: "Demolitions", isStatic: true },
  { id: "structural-works", title: "Structural works", isStatic: true },
  { id: "internal-works", title: "Internal works", isStatic: true },
  { id: "m-e", title: "M/E", isStatic: true },
  { id: "finishing", title: "Finishing", isStatic: true },
];
const reportFolder = { id: "report", title: "Report", isStatic: true };

const SitePicturesReportsPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const { data, isLoading, isError, refetch } =
    useGetAllSitePictureFoldersQuery({ projectId });
  const [createFolder] = useCreateSitePictureFolderMutation();
  const [deleteFolder] = useDeleteSitePictureFolderMutation();
  const [shareFolder] = useShareSitePictureFolderMutation();
  const [unshareFolder] = useUnshareSitePictureFolderMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // share state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareFolderItem, setShareFolderItem] = useState<any | null>(null);

  // unshare state
  const [unshareModalOpen, setUnshareModalOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const { data: singleFolderData } = useGetSingleSitePictureFolderQuery(
    selectedFolderId!,
    { skip: !selectedFolderId }
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleFolderClick = (folderId: string) => {
    navigate(`/projects/${projectId}/site-pictures-reports/${folderId}`);
  };

  const handleCreateFolder = async (folderName: string) => {
    try {
      const res = await createFolder({ title: folderName, projectId }).unwrap();
      successAlert(res.message || "Folder created successfully!");
      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      errorAlert("Error", err?.data?.message || "Failed to create folder");
    }
  };

  // check static
  const isStaticFolder = (folder: any) => {
    return (
      folder.isStatic ||
      autoCreateFolders.some((f) => f.title === folder.title) ||
      folder.id === "report"
    );
  };

  // Handle Share
  const handleShareFolder = (folder: any) => {
    setShareFolderItem(folder);
    setShareModalOpen(true);
  };

  const handleConfirmShare = async (selectedUsers: any[]) => {
    try {
      await shareFolder({
        id: shareFolderItem._id,
        sharedWith: selectedUsers,
      }).unwrap();
      successAlert("Folder shared successfully!");
      setShareModalOpen(false);
      setShareFolderItem(null);
      refetch();
    } catch (err: any) {
      errorAlert(
        "Sharing Error",
        err?.data?.message || "Failed to share folder"
      );
    }
  };

  // Handle Unshare
  const handleUnshareFolder = (folder: any) => {
    setSelectedFolderId(folder._id);
    setUnshareModalOpen(true);
  };

  const handleConfirmUnshare = async (selectedUsers: any[]) => {
    try {
      await unshareFolder({
        id: selectedFolderId!,
        unShareWith: selectedUsers.map((u) => u.userId),
      }).unwrap();
      successAlert("Folder unshared successfully!");
      setUnshareModalOpen(false);
      setSelectedFolderId(null);
      refetch();
    } catch (err: any) {
      errorAlert(
        "Unsharing Error",
        err?.data?.message || "Failed to unshare folder"
      );
    }
  };

  const allFolders = [...(data?.data || []), reportFolder];

  return (
    <div className="w-full  gap-4 bg-white min-h-screen p-6">
      {/* Header */}
      <div className="self-stretch flex justify-between  py-10">
        <h1 className="text-2xl font-semibold">Site Pictures & Reports</h1>
        <CustomCreateButton
          title="Create Folder"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      {/* Loader / Error / Content */}
      {isLoading ? (
        <div className="flex justify-center items-center my-10">
          <Spin size="large" />
        </div>
      ) : isError ? (
        <div className="text-red-500 mb-4">
          Error loading site folders. Please try again later.
        </div>
      ) : allFolders.length === 0 ? (
        <div className="text-red-500 mb-4">No folders found.</div>
      ) : (
        <Row gutter={[16, 16]}>
          {allFolders.map((folder: any) => {
            const isStatic = isStaticFolder(folder); // non-hoverable for static folders

            return (
              <Col span={6} key={folder._id || folder.id}>
                <Card
                  style={{ backgroundColor: "#f1f1f1" }}
                  hoverable // Only hoverable if not static
                  bodyStyle={{
                    backgroundColor: "#f1f1f1",
                    padding: "12px 44px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    height: "60px",
                  }}
                  onClick={() => {
                    handleFolderClick(folder._id || folder.id);
                  }}
                  title={
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {folder.title}
                    </h3>
                  }
                  extra={
                    !isStatic && (
                      <CustomViewMoreButton
                        items={[
                          { key: "share", label: "🔗 Share Folder" },
                          {
                            key: "unshare",
                            label: (
                              <div className="flex items-center gap-1">
                                <Unlink className="text-green-500" size={14} />
                                Unshare Folder
                              </div>
                            ),
                          },
                          {
                            key: "delete",
                            label: "🗑️ Delete Folder",
                            danger: true,
                          },
                        ]}
                        onClick={(key) => {
                          switch (key) {
                            case "share":
                              handleShareFolder(folder);
                              break;
                            case "unshare":
                              handleUnshareFolder(folder);
                              break;
                            case "delete":
                              showDeleteAlert({
                                onConfirm: async () => {
                                  try {
                                    await deleteFolder(folder._id).unwrap();
                                    refetch();
                                  } catch (err: any) {
                                    errorAlert(
                                      "Delete Error",
                                      err?.data?.message ||
                                        "Failed to delete folder"
                                    );
                                  }
                                },
                              });
                              break;
                          }
                        }}
                      />
                    )
                  }
                ></Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Modal for creating folder */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <CreateFolder
          onCancel={() => setIsModalOpen(false)}
          onCreate={handleCreateFolder}
        />
      </Modal>

      {/* Share Modal */}
      <Modal
        title="Share Folder"
        open={shareModalOpen}
        onCancel={() => {
          setShareModalOpen(false);
          setShareFolderItem(null);
        }}
        footer={null}
        width={500}
      >
        <CustomShareSelector
          title="Share this folder"
          roles={["superAdmin", "primeAdmin", "basicAdmin", "client"]}
          onShare={handleConfirmShare}
        />
      </Modal>

      {/* Unshare Modal */}
      <Modal
        title="Unshare Folder"
        open={unshareModalOpen}
        onCancel={() => {
          setUnshareModalOpen(false);
          setSelectedFolderId(null);
        }}
        footer={null}
        width={500}
      >
        <CustomUnshareSelector
          title="Remove access from users"
          sharedUsers={(singleFolderData?.sharedWith || []).map((u: any) => ({
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

export default SitePicturesReportsPage;
