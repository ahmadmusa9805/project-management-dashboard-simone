/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

// import React, { useRef, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { Modal, message } from "antd";
// import CustomCreateButton from "../../components/CustomCreateButton";
// import CustomViewMoreButton from "../../components/CustomViewMoreButton";
// import CustomShareSelector from "../../components/CustomShareSelector";
// import CustomUnshareSelector from "../../components/CustomUnshareSelector";
// import { errorAlert, successAlert } from "../../utils/alerts";

// // Import all API hooks
// import {
//   useGetAllDocumentFilesQuery,
//   useCreateDocumentFileMutation,
//   useDeleteDocumentFileMutation,
//   useShareDocumentFileMutation,
//   useUnShareDocumentFileMutation,
// } from "../../Redux/features/projects/project/document/documentSubFolderFileApi";
// import {
//   useGetAllSecondFixFilesQuery,
//   useCreateSecondFixFileMutation,
//   useDeleteSecondFixFileMutation,
//   useShareSecondFixFileMutation,
//   useUnShareSecondFixFileMutation,
// } from "../../Redux/features/projects/project/SecondFixedList/SecondFixFileApi";

// // You will need to import the handover tool hooks if they exist,
// // as the original code snippet mentioned them.
// // import {
// //   useGetAllHandoverFilesQuery,
// //   useCreateHandoverFileMutation,
// //   // ...etc
// // } from "...";

// interface SubfolderFilesPageProps {
//   baseRoute?: "documents" | "second-fixed-list-material" | "handover-tool";
// }

// const SubfolderFilesPage: React.FC<SubfolderFilesPageProps> = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { projectId, subFolderId } = useParams();

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const folder = location.state as {
//     name: string;
//     id?: string;
//     from?: string;
//   } | null;

//   const [shareModalOpen, setShareModalOpen] = useState(false);
//   const [unshareModalOpen, setUnshareModalOpen] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<any>(null);

//   // Determine the base route from the URL pathname
//   const baseRoute = location.pathname.split("/")[3];

//   // 🚀 Solution: Call all hooks unconditionally at the top level
//   const {
//     data: docData,
//     isLoading: docLoading,
//     refetch: refetchDoc,
//   } = useGetAllDocumentFilesQuery(
//     { projectId, documentSubFolderId: subFolderId },
//     { skip: baseRoute !== "documents" }
//   );

//   const [createDocFile] = useCreateDocumentFileMutation();
//   const [deleteDocFile] = useDeleteDocumentFileMutation();
//   const [shareDocFile] = useShareDocumentFileMutation();
//   const [unShareDocFile] = useUnShareDocumentFileMutation();

//   const {
//     data: secondFixData,
//     isLoading: secondFixLoading,
//     refetch: refetchSecondFix,
//   } = useGetAllSecondFixFilesQuery(
//     { projectId, secondFixSubFolder: subFolderId },
//     { skip: baseRoute !== "second-fixed-list-material" }
//   );

//   const [createSecondFixFile] = useCreateSecondFixFileMutation();
//   const [deleteSecondFixFile] = useDeleteSecondFixFileMutation();
//   const [shareSecondFixFile] = useShareSecondFixFileMutation();
//   const [unShareSecondFixFile] = useUnShareSecondFixFileMutation();

//   // You would do the same for the handover tool hooks here

//   // Now, conditionally use the data and mutations based on the route
//   let data, isLoading, refetch, createFile, deleteFile, shareFile, unShareFile;
//   let subFolderKey;

//   switch (baseRoute) {
//     case "documents":
//       data = docData;
//       isLoading = docLoading;
//       refetch = refetchDoc;
//       createFile = createDocFile;
//       deleteFile = deleteDocFile;
//       shareFile = shareDocFile;
//       unShareFile = unShareDocFile;
//       subFolderKey = "documentSubFolderId";
//       break;
//     case "second-fixed-list-material":
//       data = secondFixData;
//       isLoading = secondFixLoading;
//       refetch = refetchSecondFix;
//       createFile = createSecondFixFile;
//       deleteFile = deleteSecondFixFile;
//       shareFile = shareSecondFixFile;
//       unShareFile = unShareSecondFixFile;
//       subFolderKey = "secondFixSubFolder";
//       break;
//     // ... add cases for other routes
//     default:
//       // Handle the invalid route case gracefully
//       return (
//         <div className="p-6">
//           <p className="text-red-600">Invalid page route.</p>
//           <button
//             onClick={() => navigate(-1)}
//             className="text-blue-600 underline mt-2"
//           >
//             Go Back
//           </button>
//         </div>
//       );
//   }

//   const files =
//     data?.data?.map((file: any) => ({
//       id: file._id,
//       name: file.title || file.originalName,
//       size: file.size,
//       url: file.url,
//       sharedWith: file.sharedWith || [],
//     })) || [];

//   const handleUploadClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const uploadedFiles = e.target.files;

//     if (!uploadedFiles || !subFolderId || !projectId) return;

//     try {
//       for (const file of uploadedFiles) {
//         await createFile({
//           file: file,
//           title: file.name,
//           projectId,
//           [subFolderKey]: subFolderId,
//         }).unwrap();
//       }
//       successAlert("Files uploaded successfully");
//       refetch();
//     } catch (err) {
//       console.error("Failed to upload file:", err);
//       errorAlert("Failed to upload files");
//     }
//   };

//   const handleFileAction = async (action: string, file: any) => {
//     // Logic remains the same, using the correctly assigned mutation functions
//     switch (action) {
//       case "view":
//         window.open(file.url, "_blank");
//         break;
//       case "share":
//         setSelectedFile(file);
//         setShareModalOpen(true);
//         break;
//       case "unshare":
//         setSelectedFile(file);
//         setUnshareModalOpen(true);
//         break;
//       case "delete":
//         if (window.confirm(`Delete ${file.name}?`)) {
//           try {
//             await deleteFile(file.id).unwrap();
//             successAlert("File deleted successfully");
//             refetch();
//           } catch (error) {
//             errorAlert("Failed to delete file");
//           }
//         }
//         break;
//       default:
//         break;
//     }
//   };

//   const handleConfirmShare = async (selectedUsers: any[]) => {
//     if (!selectedFile) return;

//     try {
//       await shareFile({
//         id: selectedFile.id,
//         sharedWith: selectedUsers.map((user) => user.userId),
//       }).unwrap();
//       message.success("File shared successfully");
//       setShareModalOpen(false);
//       setSelectedFile(null);
//       refetch();
//     } catch (error) {
//       message.error("Failed to share file");
//     }
//   };

//   const handleConfirmUnshare = async (selectedUsers: any[]) => {
//     if (!selectedFile) return;

//     try {
//       await unShareFile({
//         id: selectedFile.id,
//         unShareWith: selectedUsers.map((user) => user.userId),
//       }).unwrap();
//       message.success("File access removed successfully");
//       setUnshareModalOpen(false);
//       setSelectedFile(null);
//       refetch();
//     } catch (error) {
//       message.error("Failed to remove access");
//     }
//   };

//   if (!folder?.name) {
//     return (
//       <div className="p-6">
//         <p className="text-red-600">Subfolder not found or missing data.</p>
//         <button
//           onClick={() => navigate(-1)}
//           className="text-blue-600 underline mt-2"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   let uploadTitle = "Upload Files";
//   switch (baseRoute) {
//     case "second-fixed-list-material":
//       uploadTitle = "Upload Fixed List Files";
//       break;
//     default:
//       uploadTitle = "Upload Files";
//   }

//   return (
//     <div className="w-full px-4 gap-4 bg-white min-h-screen pt-3">
//       {/* ... (rest of the component JSX) */}
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         {" "}
//         <h1 className="text-2xl font-semibold">
//           📁 {folder.name} — Uploaded Files
//         </h1>
//         <CustomCreateButton title={uploadTitle} onClick={handleUploadClick} />
//       </div>
//       {/* Hidden File Input */}{" "}
//       <input
//         ref={fileInputRef}
//         type="file"
//         multiple
//         onChange={handleFileUpload}
//         className="hidden"
//       />
//       {/* File List */}
//       {isLoading ? (
//         <p>Loading files...</p>
//       ) : files.length > 0 ? (
//         <div className="w-full h-full flex flex-wrap gap-4 justify-start items-start content-start">
//           {files.map((file: any) => (
//             <div
//               key={file.id}
//               className="p-6 bg-gray-100 rounded shadow flex flex-col justify-between"
//             >
//               {/* Top Icons */}
//               <div className="w-full flex justify-end">
//                 <CustomViewMoreButton
//                   items={[
//                     { label: "View", key: "view" },
//                     { label: "Share", key: "share" },
//                     { label: "Unshare", key: "unshare" },
//                     { label: "Delete", key: "delete", danger: true },
//                   ]}
//                   onClick={(action: string) => handleFileAction(action, file)}
//                 />
//               </div>

//               {/* File Info */}
//               <div className="flex flex-col items-start gap-2 w-full">
//                 <div className="text-[#2B3738] text-lg font-medium break-words">
//                   {file.name}
//                 </div>

//                 {/* Shared status indicator */}
//                 {file.sharedWith && file.sharedWith.length > 0 && (
//                   <div className="text-xs text-blue-500 mt-1">
//                     Shared with {file.sharedWith.length} user(s)
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-500">No files uploaded yet.</p>
//       )}
//       {/* {creating && <p className="text-sm text-gray-500 mt-2">Uploading...</p>} */}
//       {/* Share Modal */}
//       <Modal
//         title="Share File"
//         open={shareModalOpen}
//         onCancel={() => {
//           setShareModalOpen(false);
//           setSelectedFile(null);
//         }}
//         footer={null}
//         width={500}
//         destroyOnClose
//       >
//         <CustomShareSelector
//           title={`Share "${selectedFile?.name}"`}
//           roles={["prime-admin", "basic-admin", "client"]}
//           onShare={handleConfirmShare}
//         />
//       </Modal>
//       {/* Unshare Modal */}
//       <Modal
//         title="Remove Access"
//         open={unshareModalOpen}
//         onCancel={() => {
//           setUnshareModalOpen(false);
//           setSelectedFile(null);
//         }}
//         footer={null}
//         width={500}
//         destroyOnClose
//       >
//         <CustomUnshareSelector
//           title={`Remove access from "${selectedFile?.name}"`}
//           sharedUsers={(selectedFile?.sharedWith || []).map((user: any) => ({
//             userId: user.userId?._id || user.userId,
//             name: user.userId?.name || "Unknown User",
//             role: user.userId?.role || "Unknown Role",
//             email: user.userId?.email || "",
//             profileImg: user.userId?.profileImg,
//           }))}
//           onUnshare={handleConfirmUnshare}
//         />
//       </Modal>
//     </div>
//   );
// };

// export default SubfolderFilesPage;

// import React, { useRef, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { Modal, message, Drawer } from "antd";
// import CustomCreateButton from "../../components/CustomCreateButton";
// import CustomViewMoreButton from "../../components/CustomViewMoreButton";
// import CustomShareSelector from "../../components/CustomShareSelector";
// import CustomUnshareSelector from "../../components/CustomUnshareSelector";
// import { errorAlert, successAlert } from "../../utils/alerts";

// // Document APIs
// import {
//   useGetAllDocumentFilesQuery,
//   useCreateDocumentFileMutation,
//   useDeleteDocumentFileMutation,
//   useShareDocumentFileMutation,
//   useUnShareDocumentFileMutation,
// } from "../../Redux/features/projects/project/document/documentSubFolderFileApi";

// // Second Fix APIs
// import {
//   useGetAllSecondFixFilesQuery,
//   useCreateSecondFixFileMutation,
//   useDeleteSecondFixFileMutation,
//   useShareSecondFixFileMutation,
//   useUnShareSecondFixFileMutation,
// } from "../../Redux/features/projects/project/SecondFixedList/SecondFixFileApi";
// import SecondFixForm from "../../components/SecondFixform";

// interface SubfolderFilesPageProps {
//   baseRoute?: "documents" | "second-fixed-list-material" | "handover-tool";
// }

// const SubfolderFilesPage: React.FC<SubfolderFilesPageProps> = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { projectId, subFolderId } = useParams();

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const folder =
//     (location.state as { name: string; id?: string; from?: string } | null) ||
//     null;

//   const [shareModalOpen, setShareModalOpen] = useState(false);
//   const [unshareModalOpen, setUnshareModalOpen] = useState(false);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<any>(null);

//   // infer route segment: /projects/:projectId/:baseRoute/:subFolderId
//   const baseRoute = location.pathname.split("/")[3];

//   // ===== Documents hooks =====
//   const {
//     data: docData,
//     isLoading: docLoading,
//     refetch: refetchDoc,
//   } = useGetAllDocumentFilesQuery(
//     { projectId, documentSubFolderId: subFolderId },
//     { skip: baseRoute !== "documents" }
//   );
//   const [createDocFile] = useCreateDocumentFileMutation();
//   const [deleteDocFile] = useDeleteDocumentFileMutation();
//   const [shareDocFile] = useShareDocumentFileMutation();
//   const [unShareDocFile] = useUnShareDocumentFileMutation();

//   // ===== Second Fix hooks =====
//   const {
//     data: secondFixData,
//     isLoading: secondFixLoading,
//     refetch: refetchSecondFix,
//   } = useGetAllSecondFixFilesQuery(
//     { projectId, secondFixSubFolder: subFolderId },
//     { skip: baseRoute !== "second-fixed-list-material" }
//   );
//   const [createSecondFixFile, { isLoading: creatingSecondFix }] =
//     useCreateSecondFixFileMutation();
//   const [deleteSecondFixFile] = useDeleteSecondFixFileMutation();
//   const [shareSecondFixFile] = useShareSecondFixFileMutation();
//   const [unShareSecondFixFile] = useUnShareSecondFixFileMutation();

//   // ===== Generic mapping for current route =====
//   let data, isLoading, refetch, createFile, deleteFile, shareFile, unShareFile;
//   let secondFixSubFolder: "documentSubFolderId" | "secondFixSubFolder";

//   switch (baseRoute) {
//     case "documents":
//       data = docData;
//       isLoading = docLoading;
//       refetch = refetchDoc;
//       createFile = createDocFile;
//       deleteFile = deleteDocFile;
//       shareFile = shareDocFile;
//       unShareFile = unShareDocFile;
//       secondFixSubFolder = "documentSubFolderId";
//       break;

//     case "second-fixed-list-material":
//       data = secondFixData;
//       isLoading = secondFixLoading;
//       refetch = refetchSecondFix;
//       createFile = createSecondFixFile;
//       deleteFile = deleteSecondFixFile;
//       shareFile = shareSecondFixFile;
//       unShareFile = unShareSecondFixFile;
//       secondFixSubFolder = "secondFixSubFolder";
//       break;

//     default:
//       return (
//         <div className="p-6">
//           <p className="text-red-600">Invalid page route.</p>
//           <button
//             onClick={() => navigate(-1)}
//             className="text-blue-600 underline mt-2"
//           >
//             Go Back
//           </button>
//         </div>
//       );
//   }

//   const files =
//     data?.data?.map((file: any) => ({
//       id: file._id,
//       name: file.title || file.originalName,
//       size: file.size,
//       url: file.url,
//       sharedWith: file.sharedWith || [],
//     })) || [];

//   // ===== Document upload (multiple) =====
//   const handleUploadClick = () => fileInputRef.current?.click();

//   const handleDocumentFilesSelected = async (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const uploadedFiles = e.target.files;
//     if (!uploadedFiles || !subFolderId || !projectId) return;

//     try {
//       for (const file of uploadedFiles) {
//         // Keep the same shape your API expects (object, not necessarily FormData)
//         await createFile({
//           file, // RTK endpoint should transform to FormData if needed
//           title: file.name,
//           projectId,
//           [secondFixSubFolder]: subFolderId,
//         }).unwrap();
//       }
//       successAlert("Files uploaded successfully");
//       refetch();
//     } catch (err) {
//       console.error("Failed to upload file:", err);
//       errorAlert("Failed to upload files");
//     } finally {
//       // reset input value so selecting the same file again triggers onChange
//       e.currentTarget.value = "";
//     }
//   };

//   // ===== Actions (view/share/unshare/delete) for both routes =====
//   const handleFileAction = async (action: string, file: any) => {
//     switch (action) {
//       case "view":
//         if (file.url) window.open(file.url, "_blank");
//         break;

//       case "share":
//         setSelectedFile(file);
//         setShareModalOpen(true);
//         break;

//       case "unshare":
//         setSelectedFile(file);
//         setUnshareModalOpen(true);
//         break;

//       case "delete":
//         Modal.confirm({
//           title: `Delete "${file.name}"?`,
//           okText: "Delete",
//           okButtonProps: { danger: true },
//           onOk: async () => {
//             try {
//               await deleteFile(file.id).unwrap();
//               successAlert("File deleted successfully");
//               refetch();
//             } catch (error) {
//               errorAlert("Failed to delete file");
//             }
//           },
//         });
//         break;

//       default:
//         break;
//     }
//   };

//   const handleConfirmShare = async (selectedUsers: any[]) => {
//     if (!selectedFile) return;
//     try {
//       await shareFile({
//         id: selectedFile.id,
//         sharedWith: selectedUsers.map((u) => u.userId),
//       }).unwrap();
//       message.success("File shared successfully");
//       setShareModalOpen(false);
//       setSelectedFile(null);
//       refetch();
//     } catch {
//       message.error("Failed to share file");
//     }
//   };

//   const handleConfirmUnshare = async (selectedUsers: any[]) => {
//     if (!selectedFile) return;
//     try {
//       await unShareFile({
//         id: selectedFile.id,
//         unShareWith: selectedUsers.map((u) => u.userId),
//       }).unwrap();
//       message.success("File access removed successfully");
//       setUnshareModalOpen(false);
//       setSelectedFile(null);
//       refetch();
//     } catch {
//       message.error("Failed to remove access");
//     }
//   };

//   // ===== Second Fix create via Drawer + Form =====
//   const handleSecondFixSubmit = async (formData: any) => {
//     if (!subFolderId || !projectId) return;

//     try {
//       // Keep API contract similar to your existing mutations
//       const payload: any = {
//         title: formData.title,
//         room: formData.room,
//         surface: formData.surface,
//         productCode: formData.productCode,
//         suplierName: formData.supplierName,
//         text: formData.text,
//         file: formData.file ?? undefined,
//         projectId,
//         [secondFixSubFolder]: subFolderId, // "secondFixSubFolder"
//       };

//       await createSecondFixFile(payload).unwrap();
//       successAlert("Second Fix File created successfully");
//       setDrawerOpen(false);
//       refetch();
//     } catch (err) {
//       console.error(err);
//       errorAlert("Failed to create Second Fix File");
//     }
//   };

//   if (!folder?.name) {
//     return (
//       <div className="p-6">
//         <p className="text-red-600">Subfolder not found or missing data.</p>
//         <button
//           onClick={() => navigate(-1)}
//           className="text-blue-600 underline mt-2"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   const uploadTitle =
//     baseRoute === "second-fixed-list-material"
//       ? "Create Second Fix File"
//       : "Upload Files";

//   return (
//     <div className="w-full px-4 gap-4 bg-white min-h-screen pt-3">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-semibold">
//           📁 {folder.name} — Uploaded Files
//         </h1>

//         {baseRoute === "second-fixed-list-material" ? (
//           <CustomCreateButton
//             title={uploadTitle}
//             onClick={() => setDrawerOpen(true)}
//           />
//         ) : (
//           <CustomCreateButton title={uploadTitle} onClick={handleUploadClick} />
//         )}
//       </div>

//       {/* Hidden file input for Document uploads */}
//       {baseRoute === "documents" && (
//         <input
//           ref={fileInputRef}
//           type="file"
//           multiple
//           onChange={handleDocumentFilesSelected}
//           className="hidden"
//         />
//       )}

//       {/* File list */}
//       {isLoading ? (
//         <p>Loading files...</p>
//       ) : files.length > 0 ? (
//         <div className="w-full h-full flex flex-wrap gap-4 justify-start items-start content-start">
//           {files.map((file: any) => (
//             <div
//               key={file.id}
//               className="p-6 bg-gray-100 rounded shadow flex flex-col justify-between"
//             >
//               <div className="w-full flex justify-end">
//                 <CustomViewMoreButton
//                   items={[
//                     { label: "View", key: "view" },
//                     { label: "Share", key: "share" },
//                     { label: "Unshare", key: "unshare" },
//                     { label: "Delete", key: "delete", danger: true },
//                   ]}
//                   onClick={(action: string) => handleFileAction(action, file)}
//                 />
//               </div>

//               <div className="flex flex-col items-start gap-2 w-full">
//                 <div className="text-[#2B3738] text-lg font-medium break-words">
//                   {file.name}
//                 </div>
//                 {file.sharedWith && file.sharedWith.length > 0 && (
//                   <div className="text-xs text-blue-500 mt-1">
//                     Shared with {file.sharedWith.length} user(s)
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-500">No files uploaded yet.</p>
//       )}

//       {/* Share modal */}
//       <Modal
//         title="Share File"
//         open={shareModalOpen}
//         onCancel={() => {
//           setShareModalOpen(false);
//           setSelectedFile(null);
//         }}
//         footer={null}
//         width={500}
//         destroyOnClose
//       >
//         <CustomShareSelector
//           title={`Share "${selectedFile?.name || ""}"`}
//           roles={["prime-admin", "basic-admin", "client"]}
//           onShare={handleConfirmShare}
//         />
//       </Modal>

//       {/* Unshare modal */}
//       <Modal
//         title="Remove Access"
//         open={unshareModalOpen}
//         onCancel={() => {
//           setUnshareModalOpen(false);
//           setSelectedFile(null);
//         }}
//         footer={null}
//         width={500}
//         destroyOnClose
//       >
//         <CustomUnshareSelector
//           title={`Remove access from "${selectedFile?.name || ""}"`}
//           sharedUsers={(selectedFile?.sharedWith || []).map((user: any) => ({
//             userId: user.userId?._id || user.userId,
//             name: user.userId?.name || "Unknown User",
//             role: user.userId?.role || "Unknown Role",
//             email: user.userId?.email || "",
//             profileImg: user.userId?.profileImg,
//           }))}
//           onUnshare={handleConfirmUnshare}
//         />
//       </Modal>

//       {/* Second Fix Drawer + Form */}
//       <Drawer
//         title="Create Second Fix File"
//         open={drawerOpen}
//         onClose={() => setDrawerOpen(false)}
//         width={600}
//         destroyOnClose
//       >
//         <SecondFixForm
//           mode="create"
//           onSubmit={handleSecondFixSubmit}
//           onCancel={() => setDrawerOpen(false)}
//           creating={creatingSecondFix}
//           defaultValues={{
//             title: "",
//             room: "",
//             surface: "",
//             productCode: "",
//             supplierName: "",
//             text: "",
//             file: null,
//           }}
//         />
//       </Drawer>
//     </div>
//   );
// };

// export default SubfolderFilesPage;

import React, { useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Modal, message, Drawer } from "antd";
import CustomCreateButton from "../../components/CustomCreateButton";
import CustomViewMoreButton from "../../components/CustomViewMoreButton";
import CustomShareSelector from "../../components/CustomShareSelector";
import CustomUnshareSelector from "../../components/CustomUnshareSelector";
import { errorAlert, successAlert } from "../../utils/alerts";

// Document APIs
import {
  useGetAllDocumentFilesQuery,
  useCreateDocumentFileMutation,
  useDeleteDocumentFileMutation,
  useShareDocumentFileMutation,
  useUnShareDocumentFileMutation,
  useGetSingleDocumentFileQuery, // Added single file query
} from "../../Redux/features/projects/project/document/documentSubFolderFileApi";

// Second Fix APIs
import {
  useGetAllSecondFixFilesQuery,
  useCreateSecondFixFileMutation,
  useDeleteSecondFixFileMutation,
  useShareSecondFixFileMutation,
  useUnShareSecondFixFileMutation,
  useUpdateSecondFixFileMutation,
  useGetSingleSecondFixFileQuery, // Added single file query
} from "../../Redux/features/projects/project/SecondFixedList/SecondFixFileApi";
import SecondFixForm from "../../components/SecondFixform";

interface SubfolderFilesPageProps {
  baseRoute?: "documents" | "second-fixed-list-material" | "handover-tool";
}

const SubfolderFilesPage: React.FC<SubfolderFilesPageProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId, subFolderId } = useParams();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const folder =
    (location.state as { name: string; id?: string; from?: string } | null) ||
    null;

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [unshareModalOpen, setUnshareModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [editingFile, setEditingFile] = useState<any>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const baseRoute = location.pathname.split("/")[3];

  // ===== Single file queries for accurate sharing data =====
  const { data: singleDocData } = useGetSingleDocumentFileQuery(
    selectedFileId!,
    {
      skip: !selectedFileId || baseRoute !== "documents",
    }
  );
  const { data: singleSecondFixData } = useGetSingleSecondFixFileQuery(
    selectedFileId!,
    {
      skip: !selectedFileId || baseRoute !== "second-fixed-list-material",
    }
  );

  // ===== Documents hooks =====
  const {
    data: docData,
    isLoading: docLoading,
    refetch: refetchDoc,
  } = useGetAllDocumentFilesQuery(
    { projectId, documentSubFolderId: subFolderId },
    { skip: baseRoute !== "documents" }
  );
  const [createDocFile] = useCreateDocumentFileMutation();
  const [deleteDocFile] = useDeleteDocumentFileMutation();
  const [shareDocFile] = useShareDocumentFileMutation();
  const [unShareDocFile] = useUnShareDocumentFileMutation();

  // ===== Second Fix hooks =====
  const {
    data: secondFixData,
    isLoading: secondFixLoading,
    refetch: refetchSecondFix,
  } = useGetAllSecondFixFilesQuery(
    { projectId, secondFixSubFolder: subFolderId },
    { skip: baseRoute !== "second-fixed-list-material" }
  );
  const [createSecondFixFile, { isLoading: creatingSecondFix }] =
    useCreateSecondFixFileMutation();
  const [deleteSecondFixFile] = useDeleteSecondFixFileMutation();
  const [shareSecondFixFile] = useShareSecondFixFileMutation();
  const [unShareSecondFixFile] = useUnShareSecondFixFileMutation();
  const [updateSecondFixFile, { isLoading: updatingSecondFix }] =
    useUpdateSecondFixFileMutation();

  // ===== Generic mapping for current route =====
  let data, isLoading, refetch, createFile, deleteFile, shareFile, unShareFile;
  let secondFixSubFolder: "documentSubFolderId" | "secondFixSubFolder";

  switch (baseRoute) {
    case "documents":
      data = docData;
      isLoading = docLoading;
      refetch = refetchDoc;
      createFile = createDocFile;
      deleteFile = deleteDocFile;
      shareFile = shareDocFile;
      unShareFile = unShareDocFile;
      secondFixSubFolder = "documentSubFolderId";
      break;

    case "second-fixed-list-material":
      data = secondFixData;
      isLoading = secondFixLoading;
      refetch = refetchSecondFix;
      createFile = createSecondFixFile;
      deleteFile = deleteSecondFixFile;
      shareFile = shareSecondFixFile;
      unShareFile = unShareSecondFixFile;
      secondFixSubFolder = "secondFixSubFolder";
      break;

    default:
      return (
        <div className="p-6">
          <p className="text-red-600">Invalid page route.</p>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 underline mt-2"
          >
            Go Back
          </button>
        </div>
      );
  }

  const files =
    data?.data?.map((file: any) => ({
      id: file._id,
      name: file.title || file.originalName,
      size: file.size,
      url: file.url,
      sharedWith: file.sharedWith || [],
      room: file.room,
      surface: file.surface,
      productCode: file.productCode,
      suplierName: file.supplierName,
      text: file.text,
    })) || [];

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleDocumentFilesSelected = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || !subFolderId || !projectId) return;

    try {
      for (const file of uploadedFiles) {
        await createFile({
          file,
          title: file.name,
          projectId,
          [secondFixSubFolder]: subFolderId,
        }).unwrap();
      }
      successAlert("Files uploaded successfully");
      refetch();
    } catch (err) {
      console.error("Failed to upload file:", err);
      errorAlert("Failed to upload files");
    } finally {
      e.currentTarget.value = "";
    }
  };

  const handleFileAction = async (action: string, file: any) => {
    switch (action) {
      case "view":
        if (file.url) window.open(file.url, "_blank");
        break;

      case "share":
        setSelectedFile(file);
        setShareModalOpen(true);
        break;

      case "unshare":
        setSelectedFileId(file.id);
        setUnshareModalOpen(true);
        break;

      case "edit":
        if (baseRoute === "second-fixed-list-material") {
          setEditingFile(file);
          setDrawerOpen(true);
        }
        break;

      case "delete":
        Modal.confirm({
          title: `Delete "${file.name}"?`,
          okText: "Delete",
          okButtonProps: { danger: true },
          onOk: async () => {
            try {
              await deleteFile(file.id).unwrap();
              successAlert("File deleted successfully");
              refetch();
            } catch (error) {
              errorAlert("Failed to delete file");
            }
          },
        });
        break;

      default:
        break;
    }
  };

  const handleConfirmShare = async (selectedUsers: any[]) => {
    if (!selectedFile) return;
    try {
      await shareFile({
        id: selectedFile.id,
        sharedWith: selectedUsers.map((u) => u.userId),
      }).unwrap();
      message.success("File shared successfully");
      setShareModalOpen(false);
      setSelectedFile(null);
      refetch();
    } catch {
      message.error("Failed to share file");
    }
  };

  const handleConfirmUnshare = async (selectedUsers: any[]) => {
    if (!selectedFileId) return;
    try {
      await unShareFile({
        id: selectedFileId,
        unShareWith: selectedUsers.map((u) => u.userId),
      }).unwrap();
      message.success("File access removed successfully");
      setUnshareModalOpen(false);
      setSelectedFileId(null);
      refetch();
    } catch {
      message.error("Failed to remove access");
    }
  };

  const handleSecondFixSubmit = async (formData: any) => {
    if (!subFolderId || !projectId) return;

    try {
      const payload: any = {
        title: formData.title,
        room: formData.room,
        surface: formData.surface,
        productCode: formData.productCode,
        supplierName: formData.supplierName,
        text: formData.text,
        file: formData.file ?? undefined,
        projectId,
        [secondFixSubFolder]: subFolderId,
      };

      if (editingFile) {
        await updateSecondFixFile({
          id: editingFile.id,
          data: payload,
        }).unwrap();
        successAlert("Second Fix File updated successfully");
      } else {
        await createSecondFixFile(payload).unwrap();
        successAlert("Second Fix File created successfully");
      }

      setDrawerOpen(false);
      setEditingFile(null);
      refetch();
    } catch (err) {
      console.error(err);
      errorAlert(
        `Failed to ${editingFile ? "update" : "create"} Second Fix File`
      );
    }
  };

  if (!folder?.name) {
    return (
      <div className="p-6">
        <p className="text-red-600">Subfolder not found or missing data.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 underline mt-2"
        >
          Go Back
        </button>
      </div>
    );
  }

  const uploadTitle =
    baseRoute === "second-fixed-list-material"
      ? "Create Second Fix File"
      : "Upload Files";

  return (
    <div className="w-full px-4 gap-4 bg-white min-h-screen pt-3">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">
          📁 {folder.name} — Uploaded Files
        </h1>

        {baseRoute === "second-fixed-list-material" ? (
          <CustomCreateButton
            title={uploadTitle}
            onClick={() => {
              setEditingFile(null);
              setDrawerOpen(true);
            }}
          />
        ) : (
          <CustomCreateButton title={uploadTitle} onClick={handleUploadClick} />
        )}
      </div>

      {/* Hidden file input for Document uploads */}
      {baseRoute === "documents" && (
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleDocumentFilesSelected}
          className="hidden"
        />
      )}

      {/* File list */}
      {isLoading ? (
        <p>Loading files...</p>
      ) : files.length > 0 ? (
        <div className="w-full h-full flex flex-wrap gap-4 justify-start items-start content-start">
          {files.map((file: any) => (
            <div
              key={file.id}
              className="p-6 bg-gray-100 rounded shadow flex flex-col justify-between"
            >
              <div className="w-full flex justify-end">
                <CustomViewMoreButton
                  items={[
                    { label: "View", key: "view" },
                    ...(baseRoute === "second-fixed-list-material"
                      ? [{ label: "Edit", key: "edit" }]
                      : []),
                    { label: "Share", key: "share" },
                    { label: "Unshare", key: "unshare" },
                    { label: "Delete", key: "delete", danger: true },
                  ]}
                  onClick={(action: string) => handleFileAction(action, file)}
                />
              </div>

              <div className="flex flex-col items-start gap-2 w-full">
                <div className="text-[#2B3738] text-lg font-medium break-words">
                  {file.name}
                </div>
                {file.sharedWith && file.sharedWith.length > 0 && (
                  <div className="text-xs text-blue-500 mt-1">
                    Shared with {file.sharedWith.length} user(s)
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No files uploaded yet.</p>
      )}

      {/* Share modal */}
      <Modal
        title="Share File"
        open={shareModalOpen}
        onCancel={() => {
          setShareModalOpen(false);
          setSelectedFile(null);
        }}
        footer={null}
        width={500}
        destroyOnClose
      >
        <CustomShareSelector
          title={`Share "${selectedFile?.name || ""}"`}
          roles={["prime-admin", "basic-admin", "client"]}
          onShare={handleConfirmShare}
        />
      </Modal>

      {/* Unshare modal */}
      <Modal
        title="Remove Access"
        open={unshareModalOpen}
        onCancel={() => {
          setUnshareModalOpen(false);
          setSelectedFileId(null);
        }}
        footer={null}
        width={500}
        destroyOnClose
      >
        <CustomUnshareSelector
          title="Remove access"
          sharedUsers={
            (baseRoute === "documents"
              ? singleDocData?.data?.sharedWith
              : singleSecondFixData?.data?.sharedWith
            )?.map((u: any) => ({
              userId: u.userId._id,
              name: u.userId.name,
              role: u.userId.role,
              email: u.userId.email || "",
              profileImg: u.userId.profileImg,
            })) || []
          }
          onUnshare={handleConfirmUnshare}
        />
      </Modal>

      {/* Second Fix Drawer + Form */}
      <Drawer
        title={
          editingFile ? "Update Second Fix File" : "Create Second Fix File"
        }
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditingFile(null);
        }}
        width={600}
        destroyOnClose
      >
        <SecondFixForm
          mode={editingFile ? "edit" : "create"}
          onSubmit={handleSecondFixSubmit}
          onCancel={() => setDrawerOpen(false)}
          creating={creatingSecondFix || updatingSecondFix}
          defaultValues={
            editingFile
              ? {
                  title: editingFile.name,
                  room: editingFile.room || "",
                  surface: editingFile.surface || "",
                  productCode: editingFile.productCode || "",
                  supplierName: editingFile.suplierName || "",
                  text: editingFile.text || "",
                  file: null,
                }
              : {
                  title: "",
                  room: "",
                  surface: "",
                  productCode: "",
                  supplierName: "",
                  text: "",
                  file: null,
                }
          }
        />
      </Drawer>
    </div>
  );
};

export default SubfolderFilesPage;
