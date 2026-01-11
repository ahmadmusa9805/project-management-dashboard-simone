/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
// import { Modal } from "antd";
// import { useNavigate, useParams } from "react-router-dom";
// import CustomCreateButton from "../../../components/CustomCreateButton";
// import CustomSearchInput from "../../../components/CustomSearchInput";
// import CreateFolder from "../../../components/CreateFolder";

// type Folder = {
//   id: string;
//   name: string;
// };

// interface documentsComponenetsProps {
//   title?: string;
// }

// const DocumentsPage = ({ title }: documentsComponenetsProps) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [folders, setFolders] = useState<Folder[]>([]);
//   const navigate = useNavigate();
//   const { projectId } = useParams();

//   // ✅ Normalize title logic
//   const pageTitle = title || "Documents";

//   // ✅ Map title to baseRoute (URL segment)
//   const getBaseRoute = () => {
//     switch (pageTitle) {
//       case "Second Fixed List":
//         return "second-fixed-list-material";
//       case "Handover Tool":
//         return "handover-tool";
//       default:
//         return "documents";
//     }
//   };

//   const handleCreateFolder = (folderName: string, folderId: string) => {
//     setFolders((prev) => [...prev, { id: folderId, name: folderName }]);
//     setIsModalOpen(false);
//   };

//   const handleFolderClick = (folder: Folder) => {
//     const baseRoute = getBaseRoute();

//     navigate(`/projects/${projectId}/${baseRoute}/${folder.id}`, {
//       state: {
//         name: folder.name,
//         id: folder.id,
//         from: baseRoute,
//       },
//     });
//   };

//   return (
//     <div className="w-full h-full p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-semibold">{pageTitle} Manage</h1>
//         <CustomSearchInput onSearch={() => {}} />
//       </div>

//       {/* Create Button */}
//       <div className="flex justify-end mr-4 mb-6">
//         <CustomCreateButton
//           title="Create New Folder"
//           onClick={() => setIsModalOpen(true)}
//         />
//       </div>

//       {/* Folder List */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//         {folders.map((folder) => (
//           <div
//             key={folder.id}
//             onClick={() => handleFolderClick(folder)}
//             className="p-4 border border-gray-300 rounded shadow bg-white text-gray-800 cursor-pointer hover:bg-gray-100 transition"
//           >
//             <h3 className="text-lg font-medium truncate">📁 {folder.name}</h3>
//           </div>
//         ))}
//       </div>

//       {/* Modal */}
//       <Modal
//         open={isModalOpen}
//         onCancel={() => setIsModalOpen(false)}
//         footer={null}
//         width={500}
//         closable={false}
//       >
//         <CreateFolder
//           onCancel={() => setIsModalOpen(false)}
//           onCreate={handleCreateFolder}
//         />
//       </Modal>
//     </div>
//   );
// };

// export default DocumentsPage;
// _____________________________________________________________________________________________________________________-----------------------------------
// import { useState } from "react";
// import { Modal } from "antd";
// import { useNavigate, useParams } from "react-router-dom";
// import CustomCreateButton from "../../../components/CustomCreateButton";
// import CustomSearchInput from "../../../components/CustomSearchInput";
// import CreateFolder from "../../../components/CreateFolder";
// import {
//   useGetAllDocumentsQuery,
//   useCreateDocumentMutation,
// } from "../../../Redux/features/projects/project/document/documentApi";

// interface Folder {
//   id: string;
//   name: string;
// }

// interface DocumentsPageProps {
//   title?: string;
// }

// const DocumentsPage = ({ title }: DocumentsPageProps) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const navigate = useNavigate();
//   const { projectId } = useParams();

//   // ✅ fetch documents
//   const { data, isLoading } = useGetAllDocumentsQuery({ projectId });
//   const [createDocument, { isLoading: creating }] = useCreateDocumentMutation();

//   const folders: Folder[] =
//     data?.data?.map((doc: any) => ({ id: doc._id, name: doc.title })) || [];

//   const pageTitle = title || "Documents";

//   const getBaseRoute = () => {
//     switch (pageTitle) {
//       case "Second Fixed List":
//         return "second-fixed-list-material";
//       case "Handover Tool":
//         return "handover-tool";
//       default:
//         return "documents";
//     }
//   };

//   // ✅ create new folder via API
//   const handleCreateFolder = async (folderName: string) => {
//     try {
//       await createDocument({
//         title: folderName,
//         projectId,
//       }).unwrap();
//       setIsModalOpen(false);
//       // RTK Query invalidates cache → auto refreshes list
//     } catch (error) {
//       console.error("Create folder failed:", error);
//     }
//   };

//   const handleFolderClick = (folder: Folder) => {
//     const baseRoute = getBaseRoute();
//     navigate(`/projects/${projectId}/${baseRoute}/${folder.id}`, {
//       state: {
//         name: folder.name,
//         id: folder.id,
//         from: baseRoute,
//       },
//     });
//   };

//   return (
//     <div className="w-full h-full p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-semibold">{pageTitle} Manage</h1>
//         <CustomSearchInput onSearch={() => {}} />
//       </div>

//       {/* Create Button */}
//       <div className="flex justify-end mr-4 mb-6">
//         <CustomCreateButton
//           title="Create New Folder"
//           onClick={() => setIsModalOpen(true)}
//         />
//       </div>

//       {/* Folder List */}
//       {isLoading ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//           {folders.map((folder) => (
//             <div
//               key={folder.id}
//               onClick={() => handleFolderClick(folder)}
//               className="p-4 border border-gray-300 rounded shadow bg-white cursor-pointer hover:bg-gray-100 transition"
//             >
//               <h3 className="text-lg font-medium truncate">📁 {folder.name}</h3>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Modal */}
//       <Modal
//         open={isModalOpen}
//         onCancel={() => setIsModalOpen(false)}
//         footer={null}
//         width={500}
//         closable={false}
//       >
//         <CreateFolder
//           onCancel={() => setIsModalOpen(false)}
//           onCreate={handleCreateFolder}
//         />
//         {creating && <p className="text-sm text-gray-500 mt-2">Creating...</p>}
//       </Modal>
//     </div>
//   );
// };

// export default DocumentsPage;

// TODO: except delete and update option

// import { useState } from "react";
// import { Card, Col, Modal, Row, Spin } from "antd";
// import { useNavigate, useParams } from "react-router-dom";
// import CustomCreateButton from "../../../components/CustomCreateButton";
// // import CustomSearchInput from "../../../components/CustomSearchInput";
// import CreateFolder from "../../../components/CreateFolder";
// import {
//   useGetAllDocumentsQuery,
//   useCreateDocumentMutation,
// } from "../../../Redux/features/projects/project/document/documentApi";

// import {
//   useGetAllSecondFixFoldersQuery,
//   useCreateSecondFixFolderMutation,
// } from "../../../Redux/features/projects/project/SecondFixedList/SecondFixFolderApi";

// interface Folder {
//   id: string;
//   name: string;
// }

// interface DocumentsPageProps {
//   title?: string;
// }

// const DocumentsPage = ({ title }: DocumentsPageProps) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const navigate = useNavigate();
//   const { projectId } = useParams();

//   const getBaseRoute = () => {
//     switch (pageTitle) {
//       case "Second Fixed List":
//         return "second-fixed-list-material";
//       case "Handover Tool":
//         return "handover-tool";
//       default:
//         return "documents";
//     }
//   };

//   const pageTitle = title || "Documents";
//   const baseRoute = getBaseRoute();

//   // Conditionally choose which API to use based on pageTitle
//   const isSecondFixedList = pageTitle === "Second Fixed List";

//   // ✅ fetch documents - conditionally use the appropriate query
//   const { data: documentsData, isLoading: documentsLoading } =
//     useGetAllDocumentsQuery(
//       { projectId },
//       { skip: isSecondFixedList } // Skip this query if it's Second Fixed List
//     );

//   const { data: secondFixData, isLoading: secondFixLoading } =
//     useGetAllSecondFixFoldersQuery(
//       { projectId },
//       { skip: !isSecondFixedList } // Skip this query if it's NOT Second Fixed List
//     );

//   // ✅ create mutations - conditionally use the appropriate mutation
//   const [createDocument, { isLoading: creatingDocument }] =
//     useCreateDocumentMutation();
//   const [createSecondFixFolder, { isLoading: creatingSecondFix }] =
//     useCreateSecondFixFolderMutation();

//   // Determine which data and loading state to use
//   const isLoading = isSecondFixedList ? secondFixLoading : documentsLoading;
//   const creating = isSecondFixedList ? creatingSecondFix : creatingDocument;

//   // Transform data to consistent folder format regardless of API
//   const folders: Folder[] =
//     (isSecondFixedList
//       ? secondFixData?.data?.map((doc: any) => ({
//           id: doc._id,
//           name: doc.title,
//         }))
//       : documentsData?.data?.map((doc: any) => ({
//           id: doc._id,
//           name: doc.title,
//         }))) || [];

//   // ✅ create new folder via appropriate API
//   const handleCreateFolder = async (folderName: string) => {
//     try {
//       if (isSecondFixedList) {
//         await createSecondFixFolder({
//           title: folderName,
//           projectId,
//         }).unwrap();
//       } else {
//         await createDocument({
//           title: folderName,
//           projectId,
//         }).unwrap();
//       }
//       setIsModalOpen(false);
//       // RTK Query invalidates cache → auto refreshes list
//     } catch (error) {
//       console.error("Create folder failed:", error);
//     }
//   };

//   const handleFolderClick = (folder: Folder) => {
//     navigate(`/projects/${projectId}/${baseRoute}/${folder.id}`, {
//       state: {
//         name: folder.name,
//         id: folder.id,
//         from: baseRoute,
//       },
//     });
//   };

//   return (
//     <div className="w-full  gap-4 bg-white min-h-screen p-6">
//       {/* Header */}
//       <div className="flex justify-between  py-10">
//         <h1 className="text-2xl font-semibold">{pageTitle}</h1>
//         <CustomCreateButton
//           title="Create Folder"
//           onClick={() => setIsModalOpen(true)}
//         />
//         {/* <CustomSearchInput onSearch={() => {}} /> */}
//       </div>

//       {/* Create Button */}
//       {/* <div className="flex justify-end mr-4 mb-6">
//         <CustomCreateButton
//           title="Create Folder"
//           onClick={() => setIsModalOpen(true)}
//         />
//       </div> */}

//       {/* Folder List */}
//       {isLoading ? (
//         <div className="flex justify-center items-center h-40">
//           <Spin size="large" />
//         </div>
//       ) : (
//         <Row gutter={[16, 16]}>
//           {folders.map((folder) => (
//             <Col span={6} key={folder.id}>
//               <Card
//                 title={
//                   <h3 className="text-lg font-medium text-gray-900 truncate">
//                     📁 {folder.name}
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
//                 onClick={() => handleFolderClick(folder)}
//               ></Card>
//             </Col>
//           ))}
//         </Row>
//       )}

//       {/* Modal */}
//       <Modal
//         open={isModalOpen}
//         onCancel={() => setIsModalOpen(false)}
//         footer={null}
//         width={500}
//         closable={false}
//       >
//         <CreateFolder
//           onCancel={() => setIsModalOpen(false)}
//           onCreate={handleCreateFolder}
//         />
//         {creating && <p className="text-sm text-gray-500 mt-2">Creating...</p>}
//       </Modal>
//     </div>
//   );
// };

// export default DocumentsPage;

// TODO: with delete and update

import { useState } from "react";
import { Card, Col, Modal, Row, Spin, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import CustomCreateButton from "../../../components/CustomCreateButton";
import CreateFolder from "../../../components/CreateFolder";
import CustomViewMoreButton from "../../../components/CustomViewMoreButton";

import {
  useGetAllDocumentsQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
} from "../../../Redux/features/projects/project/document/documentApi";

import {
  useGetAllSecondFixFoldersQuery,
  useCreateSecondFixFolderMutation,
  useUpdateSecondFixFolderMutation,
  useDeleteSecondFixFolderMutation,
} from "../../../Redux/features/projects/project/SecondFixedList/SecondFixFolderApi";
import { showDeleteAlert } from "../../../utils/deleteAlert";

interface Folder {
  id: string;
  name: string;
}

interface DocumentsPageProps {
  title?: string;
}

const DocumentsPage = ({ title }: DocumentsPageProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);

  const navigate = useNavigate();
  const { projectId } = useParams();

  const pageTitle = title || "Documents";

  const getBaseRoute = () => {
    switch (pageTitle) {
      case "Second Fixed List":
        return "second-fixed-list-material";
      case "Handover Tool":
        return "handover-tool";
      default:
        return "documents";
    }
  };

  const baseRoute = getBaseRoute();
  const isSecondFixedList = pageTitle === "Second Fixed List";

  // ✅ Queries
  const { data: documentsData, isLoading: documentsLoading } =
    useGetAllDocumentsQuery({ projectId }, { skip: isSecondFixedList });

  const { data: secondFixData, isLoading: secondFixLoading } =
    useGetAllSecondFixFoldersQuery({ projectId }, { skip: !isSecondFixedList });

  // ✅ Mutations
  const [createDocument, { isLoading: creatingDocument }] =
    useCreateDocumentMutation();
  const [updateDocument, { isLoading: updateingDocument }] =
    useUpdateDocumentMutation();
  const [deleteDocument] = useDeleteDocumentMutation();

  const [createSecondFixFolder, { isLoading: creatingSecondFix }] =
    useCreateSecondFixFolderMutation();
  const [updateSecondFixFolder, { isLoading: updatingSecondFix }] =
    useUpdateSecondFixFolderMutation();
  const [deleteSecondFixFolder] = useDeleteSecondFixFolderMutation();

  const isLoading = isSecondFixedList ? secondFixLoading : documentsLoading;
  const creating = isSecondFixedList ? creatingSecondFix : creatingDocument;
  const updating = isSecondFixedList ? updatingSecondFix : updateingDocument;

  const folders: Folder[] =
    (isSecondFixedList
      ? secondFixData?.data?.map((doc: any) => ({
          id: doc._id,
          name: doc.title,
        }))
      : documentsData?.data?.map((doc: any) => ({
          id: doc._id,
          name: doc.title,
        }))) || [];

  // ✅ Create or Update Folder
  const handleSaveFolder = async (folderName: string) => {
    try {
      if (editingFolder) {
        // Update
        if (isSecondFixedList) {
          await updateSecondFixFolder({
            id: editingFolder.id,
            data: { title: folderName },
          }).unwrap();
        } else {
          await updateDocument({
            id: editingFolder.id,
            data: { title: folderName },
          }).unwrap();
        }
        message.success("Folder updated successfully!");
        setEditingFolder(null);
      } else {
        // Create
        if (isSecondFixedList) {
          await createSecondFixFolder({
            title: folderName,
            projectId,
          }).unwrap();
        } else {
          await createDocument({
            title: folderName,
            projectId,
          }).unwrap();
        }
        message.success("Folder created successfully!");
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Save folder failed:", error);
      message.error("Failed to save folder.");
    }
  };

  // ✅ Delete Folder using SweetAlert2
  const handleDeleteFolder = (folder: Folder) => {
    showDeleteAlert({
      title: "Are you sure you want to delete this folder?",
      text: folder.name,
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          if (isSecondFixedList) {
            await deleteSecondFixFolder(folder.id).unwrap();
          } else {
            await deleteDocument(folder.id).unwrap();
          }
          message.success("Folder deleted successfully!");
        } catch (error) {
          console.error("Delete failed:", error);
          message.error("Failed to delete folder.");
        }
      },
    });
  };

  // ✅ Navigate to folder content
  const handleFolderClick = (folder: Folder) => {
    navigate(`/projects/${projectId}/${baseRoute}/${folder.id}`, {
      state: { name: folder.name, id: folder.id, from: baseRoute },
    });
  };
  //  add somthing

  return (
    <div className="w-full gap-4 bg-white min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between py-10">
        <h1 className="text-2xl font-semibold">{pageTitle}</h1>
        <CustomCreateButton
          title="Create Folder"
          onClick={() => {
            setEditingFolder(null);
            setIsModalOpen(true);
          }}
        />
      </div>

      {/* Folder List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {folders.map((folder) => (
            <Col span={6} key={folder.id}>
              <Card
                title={
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    📁 {folder.name}
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
                onClick={() => handleFolderClick(folder)}
                extra={
                  <CustomViewMoreButton
                    items={[
                      { key: "edit", label: "✏️ Edit" },
                      { key: "delete", label: "🗑️ Delete", danger: true },
                    ]}
                    onClick={(key) => {
                      if (key === "edit") {
                        setEditingFolder(folder);
                        setIsModalOpen(true);
                      }
                      if (key === "delete") {
                        handleDeleteFolder(folder);
                      }
                    }}
                  />
                }
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingFolder(null);
        }}
        footer={null}
        width={500}
        closable={false}
      >
        <CreateFolder
          initialValue={editingFolder?.name || ""}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingFolder(null);
          }}
          onCreate={handleSaveFolder}
        />
        {creating && (
          <p className="text-sm text-gray-500 mt-2">{"Creating..."}</p>
        )}
        {updating && (
          <p className="text-sm text-gray-500 mt-2">{"Updating..."}</p>
        )}
      </Modal>
    </div>
  );
};

export default DocumentsPage;
