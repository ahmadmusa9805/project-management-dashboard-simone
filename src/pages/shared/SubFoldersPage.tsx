/* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import CustomCreateButton from "../../components/CustomCreateButton";
// import { Modal } from "antd";
// import CreateFolder from "../../components/CreateFolder";

// interface Subfolder {
//   id: string;
//   name: string;
// }

// interface SubFoldersPageProps {
//   baseRoute?: "documents" | "second-fixed-list-material" | "handover-tool";
// }

// const SubFoldersPage: React.FC<SubFoldersPageProps> = ({ baseRoute = "documents" }) => {
//   const { projectId, mainFolderId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const folder = location.state as { name: string; id: string } | null;
//   const [subfolders, setSubfolders] = useState<Subfolder[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleCreateSubfolder = (name: string, id: string) => {
//     setSubfolders((prev) => [...prev, { name, id }]);
//     setIsModalOpen(false);
//   };

//   const handleSubfolderClick = (sub: Subfolder) => {
//     navigate(
//       `/projects/${projectId}/${baseRoute}/${mainFolderId}/${sub.id}`,
//       {
//         state: { name: sub.name, id: sub.id, from: baseRoute },
//       }
//     );
//   };

//   if (!folder?.name && !mainFolderId) {
//     return (
//       <div className="p-6">
//         <p className="text-red-600">Main folder not found.</p>
//         <button
//           onClick={() => navigate(-1)}
//           className="text-blue-500 underline mt-2"
//         >
//           Go back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full h-full p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-semibold">
//           📁 {folder?.name || mainFolderId} — Subfolders
//         </h1>
//         <CustomCreateButton
//           title={`Create (${baseRoute})`}
//           onClick={() => setIsModalOpen(true)}
//         />
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//         {subfolders.map((sub) => (
//           <div
//             key={sub.id}
//             onClick={() => handleSubfolderClick(sub)}
//             className="p-4 border border-gray-300 rounded shadow bg-white text-gray-800 cursor-pointer hover:bg-gray-100 transition"
//           >
//             <h3 className="text-lg font-medium truncate">📂 {sub.name}</h3>
//           </div>
//         ))}
//       </div>

//       <Modal
//         open={isModalOpen}
//         onCancel={() => setIsModalOpen(false)}
//         footer={null}
//         width={500}
//         closable={false}
//       >
//         <CreateFolder
//           onCancel={() => setIsModalOpen(false)}
//           onCreate={handleCreateSubfolder}
//         />
//       </Modal>
//     </div>
//   );
// };

// export default SubFoldersPage;

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// import React, { useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { Modal } from "antd";
// import CustomCreateButton from "../../components/CustomCreateButton";
// import CreateFolder from "../../components/CreateFolder";
// import {
//   useCreateDocumentSubfolderMutation,
//   useGetAllDocumentSubfoldersQuery,
// } from "../../Redux/features/projects/project/document/documentsubFolderApi";

// interface SubFoldersPageProps {
//   baseRoute?: "documents" | "second-fixed-list-material" | "handover-tool";
// }

// const SubFoldersPage: React.FC<SubFoldersPageProps> = ({
//   baseRoute = "documents",
// }) => {
//   const { projectId, mainFolderId } = useParams();
//   console.log(projectId, mainFolderId);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const folder = location.state as { name: string; id: string } | null;

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // ✅ Fetch subfolders for this main folder
//   const { data, isLoading } = useGetAllDocumentSubfoldersQuery({
//     projectId,
//     documentId: mainFolderId,
//   });

//   const [createSubfolder, { isLoading: creating }] =
//     useCreateDocumentSubfolderMutation();

//   const subfolders =
//     data?.data?.map((sub: any) => ({
//       id: sub._id,
//       name: sub.title,
//     })) || [];

//   // ✅ API-based subfolder creation
//   const handleCreateSubfolder = async (name: string) => {
//     try {
//       await createSubfolder({
//         title: name,
//         projectId,
//         documentId: mainFolderId, // 👈 link subfolder to parent
//       }).unwrap();
//       setIsModalOpen(false);
//     } catch (err) {
//       console.error("Failed to create subfolder:", err);
//     }
//   };

//   const handleSubfolderClick = (sub: { id: string; name: string }) => {
//     navigate(`/projects/${projectId}/${baseRoute}/${mainFolderId}/${sub.id}`, {
//       state: { name: sub.name, id: sub.id, from: baseRoute },
//     });
//   };

//   if (!folder?.name && !mainFolderId) {
//     return (
//       <div className="p-6">
//         <p className="text-red-600">Main folder not found.</p>
//         <button
//           onClick={() => navigate(-1)}
//           className="text-blue-500 underline mt-2"
//         >
//           Go back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full h-full p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-semibold">
//           📁 {folder?.name || mainFolderId} — Subfolders
//         </h1>
//         <CustomCreateButton
//           title="Create Subfolder"
//           onClick={() => setIsModalOpen(true)}
//         />
//       </div>

//       {/* Subfolder list */}
//       {isLoading ? (
//         <p>Loading subfolders...</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//           {subfolders.map((sub: { id: any; name: any }) => (
//             <div
//               key={sub.id}
//               onClick={() => handleSubfolderClick(sub)}
//               className="p-4 border border-gray-300 rounded shadow bg-white text-gray-800 cursor-pointer hover:bg-gray-100 transition"
//             >
//               <h3 className="text-lg font-medium truncate">📂 {sub.name}</h3>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Modal for creating subfolder */}
//       <Modal
//         open={isModalOpen}
//         onCancel={() => setIsModalOpen(false)}
//         footer={null}
//         width={500}
//         closable={false}
//       >
//         <CreateFolder
//           onCancel={() => setIsModalOpen(false)}
//           onCreate={handleCreateSubfolder}
//         />
//         {creating && <p className="text-sm text-gray-500 mt-2">Creating...</p>}
//       </Modal>
//     </div>
//   );
// };

// export default SubFoldersPage;

// TODO: except delete and update option

// import React, { useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { Card, Col, Modal, Row, Spin } from "antd";
// import CustomCreateButton from "../../components/CustomCreateButton";
// import CreateFolder from "../../components/CreateFolder";
// import {
//   useCreateDocumentSubfolderMutation,
//   useGetAllDocumentSubfoldersQuery,
// } from "../../Redux/features/projects/project/document/documentsubFolderApi";
// import {
//   useCreateSecondFixSubFolderMutation,
//   useGetAllSecondFixSubFoldersQuery,
// } from "../../Redux/features/projects/project/SecondFixedList/SecondFixSubFolderApi";
// import { ChevronLeft } from "lucide-react";

// // Import the second fix subfolders API hooks

// interface SubFoldersPageProps {
//   baseRoute?: "documents" | "second-fixed-list-material" | "handover-tool";
// }

// const SubFoldersPage: React.FC<SubFoldersPageProps> = ({
//   baseRoute = "documents",
// }) => {
//   const { projectId, mainFolderId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const folder = location.state as { name: string; id: string } | null;

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Conditionally choose which API to use based on baseRoute
//   const isSecondFixedList = baseRoute === "second-fixed-list-material";

//   // ✅ Fetch subfolders - conditionally use the appropriate query
//   const { data: documentData, isLoading: documentLoading } =
//     useGetAllDocumentSubfoldersQuery(
//       {
//         projectId,
//         documentId: mainFolderId,
//       },
//       { skip: isSecondFixedList } // Skip this query if it's Second Fixed List
//     );

//   const { data: secondFixData, isLoading: secondFixLoading } =
//     useGetAllSecondFixSubFoldersQuery(
//       {
//         projectId,
//         secondFixFolderId: mainFolderId,
//       },
//       { skip: !isSecondFixedList } // Skip this query if it's NOT Second Fixed List
//     );

//   // ✅ create mutations - conditionally use the appropriate mutation
//   const [createDocumentSubfolder, { isLoading: creatingDocument }] =
//     useCreateDocumentSubfolderMutation();
//   const [createSecondFixSubFolder, { isLoading: creatingSecondFix }] =
//     useCreateSecondFixSubFolderMutation();

//   // Determine which data and loading state to use
//   const isLoading = isSecondFixedList ? secondFixLoading : documentLoading;
//   const creating = isSecondFixedList ? creatingSecondFix : creatingDocument;

//   // Transform data to consistent subfolder format regardless of API
//   const subfolders =
//     (isSecondFixedList
//       ? secondFixData?.data?.map((sub: any) => ({
//           id: sub._id,
//           name: sub.title,
//         }))
//       : documentData?.data?.map((sub: any) => ({
//           id: sub._id,
//           name: sub.title,
//         }))) || [];

//   // ✅ API-based subfolder creation - conditionally use the appropriate API
//   const handleCreateSubfolder = async (name: string) => {
//     try {
//       if (isSecondFixedList) {
//         await createSecondFixSubFolder({
//           title: name,
//           projectId,
//           secondFixFolderId: mainFolderId,
//         }).unwrap();
//       } else {
//         await createDocumentSubfolder({
//           title: name,
//           projectId,
//           documentId: mainFolderId,
//         }).unwrap();
//       }
//       setIsModalOpen(false);
//     } catch (err) {
//       console.error("Failed to create subfolder:", err);
//     }
//   };

//   const handleSubfolderClick = (sub: { id: string; name: string }) => {
//     navigate(`/projects/${projectId}/${baseRoute}/${mainFolderId}/${sub.id}`, {
//       state: { name: sub.name, id: sub.id, from: baseRoute },
//     });
//   };

//   if (!folder?.name && !mainFolderId) {
//     return (
//       <div className="p-6">
//         <p className="text-red-600">Main folder not found.</p>
//         <button
//           onClick={() => navigate(-1)}
//           className="text-blue-500 underline mt-2"
//         >
//           Go back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full px-4 gap-4 bg-white min-h-screen pt-3">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4 mt-10">
//         <div className="flex items-center gap-1 pt-10 mb-3">
//           <ChevronLeft
//             onClick={() => navigate(-1)}
//             className="w-10 h-10 cursor-pointer -translate-y-[4px]" // Adjust -translate-y value as needed
//           />
//           <h1 className="text-2xl font-semibold">
//             {folder?.name || mainFolderId}
//           </h1>
//         </div>

//         <CustomCreateButton
//           title="Create Subfolder"
//           onClick={() => setIsModalOpen(true)}
//         />
//       </div>

//       {/* Subfolder list */}
//       {isLoading ? (
//         <div className="flex justify-center items-center h-40">
//           <Spin size="large" />
//         </div>
//       ) : (
//         <Row gutter={[16, 16]}>
//           {subfolders.map((sub: { id: string; name: string }) => (
//             <Col span={6} key={sub.id}>
//               <Card
//                 title={
//                   <h3 className="text-lg font-medium text-gray-900 truncate">
//                     📁 {sub.name}
//                   </h3>
//                 }
//                 hoverable
//                 style={{ backgroundColor: "#f1f1f1" }}
//                 bodyStyle={{
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "center",
//                   height: "60px", // fixed height
//                   padding: "12px 24px",
//                 }}
//                 onClick={() => handleSubfolderClick(sub)}
//               />
//             </Col>
//           ))}
//         </Row>
//       )}

//       {/* Modal for creating subfolder */}
//       <Modal
//         open={isModalOpen}
//         onCancel={() => setIsModalOpen(false)}
//         footer={null}
//         width={500}
//         closable={false}
//       >
//         <CreateFolder
//           onCancel={() => setIsModalOpen(false)}
//           onCreate={handleCreateSubfolder}
//         />
//         {creating && <p className="text-sm text-gray-500 mt-2">Creating...</p>}
//       </Modal>
//     </div>
//   );
// };

// export default SubFoldersPage;

// TODO: with delete and update

import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Col, Modal, Row, Spin, message } from "antd";
import CustomCreateButton from "../../components/CustomCreateButton";
import CreateFolder from "../../components/CreateFolder";
import {
  useCreateDocumentSubfolderMutation,
  useDeleteDocumentSubfolderMutation,
  useGetAllDocumentSubfoldersQuery,
  useUpdateDocumentSubfolderMutation,
} from "../../Redux/features/projects/project/document/documentsubFolderApi";
import {
  useCreateSecondFixSubFolderMutation,
  useDeleteSecondFixSubFolderMutation,
  useGetAllSecondFixSubFoldersQuery,
  useUpdateSecondFixSubFolderMutation,
} from "../../Redux/features/projects/project/SecondFixedList/SecondFixSubFolderApi";
import { ChevronLeft } from "lucide-react";
import { showDeleteAlert } from "../../utils/deleteAlert";
import CustomViewMoreButton from "../../components/CustomViewMoreButton";

interface SubFoldersPageProps {
  baseRoute?: "documents" | "second-fixed-list-material" | "handover-tool";
}

const SubFoldersPage: React.FC<SubFoldersPageProps> = ({
  baseRoute = "documents",
}) => {
  const { projectId, mainFolderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const folder = location.state as { name: string; id: string } | null;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubfolder, setEditingSubfolder] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const isSecondFixedList = baseRoute === "second-fixed-list-material";

  // ✅ Queries
  const { data: documentData, isLoading: documentLoading } =
    useGetAllDocumentSubfoldersQuery(
      { projectId, documentId: mainFolderId },
      { skip: isSecondFixedList }
    );

  const { data: secondFixData, isLoading: secondFixLoading } =
    useGetAllSecondFixSubFoldersQuery(
      { projectId, secondFixFolderId: mainFolderId },
      { skip: !isSecondFixedList }
    );

  // ✅ Mutations
  const [createDocumentSubfolder, { isLoading: creatingDocument }] =
    useCreateDocumentSubfolderMutation();
  const [updateDocumentSubfolder, { isLoading: updatingDocument }] =
    useUpdateDocumentSubfolderMutation();
  const [deleteDocumentSubfolder] = useDeleteDocumentSubfolderMutation();

  const [createSecondFixSubFolder, { isLoading: creatingSecondFix }] =
    useCreateSecondFixSubFolderMutation();
  const [updateSecondFixSubFolder, { isLoading: updatingSecondFix }] =
    useUpdateSecondFixSubFolderMutation();
  const [deleteSecondFixSubFolder] = useDeleteSecondFixSubFolderMutation();

  const isLoading = isSecondFixedList ? secondFixLoading : documentLoading;
  const creating = isSecondFixedList ? creatingSecondFix : creatingDocument;
  const updating = isSecondFixedList ? updatingSecondFix : updatingDocument;

  const subfolders =
    (isSecondFixedList
      ? secondFixData?.data?.map((sub: any) => ({
          id: sub._id,
          name: sub.title,
        }))
      : documentData?.data?.map((sub: any) => ({
          id: sub._id,
          name: sub.title,
        }))) || [];

  // ✅ Create or Update Subfolder
  const handleSaveSubfolder = async (name: string) => {
    try {
      if (editingSubfolder) {
        // Update
        if (isSecondFixedList) {
          await updateSecondFixSubFolder({
            id: editingSubfolder.id,
            data: { title: name },
          }).unwrap();
        } else {
          await updateDocumentSubfolder({
            id: editingSubfolder.id,
            data: { title: name },
          }).unwrap();
        }
        message.success("Subfolder updated successfully!");
        setEditingSubfolder(null);
      } else {
        // Create
        if (isSecondFixedList) {
          await createSecondFixSubFolder({
            title: name,
            projectId,
            secondFixFolderId: mainFolderId,
          }).unwrap();
        } else {
          await createDocumentSubfolder({
            title: name,
            projectId,
            documentId: mainFolderId,
          }).unwrap();
        }
        message.success("Subfolder created successfully!");
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save subfolder:", err);
      message.error("Failed to save subfolder.");
    }
  };

  // ✅ Delete Subfolder
  const handleDeleteSubfolder = (sub: { id: string; name: string }) => {
    showDeleteAlert({
      title: "Are you sure you want to delete this subfolder?",
      text: sub.name,
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          if (isSecondFixedList) {
            await deleteSecondFixSubFolder(sub.id).unwrap();
          } else {
            await deleteDocumentSubfolder(sub.id).unwrap();
          }
          message.success("Subfolder deleted successfully!");
        } catch (err) {
          console.error("Delete failed:", err);
          message.error("Failed to delete subfolder.");
        }
      },
    });
  };

  const handleSubfolderClick = (sub: { id: string; name: string }) => {
    navigate(`/projects/${projectId}/${baseRoute}/${mainFolderId}/${sub.id}`, {
      state: { name: sub.name, id: sub.id, from: baseRoute },
    });
  };

  if (!folder?.name && !mainFolderId) {
    return (
      <div className="p-6">
        <p className="text-red-600">Main folder not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-green-500 underline mt-2"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 gap-4 bg-white min-h-screen pt-3">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 mt-10">
        <div className="flex items-center gap-1 pt-10 mb-3">
          <ChevronLeft
            onClick={() => navigate(-1)}
            className="w-10 h-10 cursor-pointer -translate-y-[4px]"
          />
          <h1 className="text-2xl font-semibold">
            {folder?.name || mainFolderId}
          </h1>
        </div>

        <CustomCreateButton
          title="Create Subfolder"
          onClick={() => {
            setEditingSubfolder(null);
            setIsModalOpen(true);
          }}
        />
      </div>

      {/* Subfolder list */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {subfolders.map((sub: any) => (
            <Col span={6} key={sub.id}>
              <Card
                title={
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    📁 {sub.name}
                  </h3>
                }
                hoverable
                style={{ backgroundColor: "#f1f1f1" }}
                bodyStyle={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  height: "60px",
                  padding: "12px 24px",
                }}
                onClick={() => handleSubfolderClick(sub)}
                extra={
                  <CustomViewMoreButton
                    items={[
                      { key: "edit", label: "✏️ Edit" },
                      { key: "delete", label: "🗑️ Delete", danger: true },
                    ]}
                    onClick={(key) => {
                      if (key === "edit") {
                        setEditingSubfolder(sub);
                        setIsModalOpen(true);
                      }
                      if (key === "delete") {
                        handleDeleteSubfolder(sub);
                      }
                    }}
                  />
                }
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Modal for create/edit subfolder */}
      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingSubfolder(null);
        }}
        footer={null}
        width={500}
        closable={false}
      >
        <CreateFolder
          initialValue={editingSubfolder?.name || ""}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingSubfolder(null);
          }}
          onCreate={handleSaveSubfolder}
        />
        {(creating || updating) && (
          <p className="text-sm text-gray-500 mt-2">
            {editingSubfolder ? "Updating..." : "Creating..."}
          </p>
        )}
      </Modal>
    </div>
  );
};

export default SubFoldersPage;
