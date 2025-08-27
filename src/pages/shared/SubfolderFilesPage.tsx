// import React, { useRef, useState } from "react";
// import { useLocation, useNavigate} from "react-router-dom";
// import CustomCreateButton from "../../components/CustomCreateButton";
// import CustomViewMoreButton from "../../components/CustomViewMoreButton";

// interface UploadedFile {
//   file: File;
//   name: string;
//   size: number;
// }

// interface SubfolderFilesPageProps {
//   baseRoute?: "documents" | "second-fixed-list-material" | "handover-tool";
// }

// const SubfolderFilesPage: React.FC<SubfolderFilesPageProps> = ({ baseRoute = "documents" }) => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const folder = location.state as {
//     name: string;
//     id?: string;
//     from?: string;
//   } | null;

//   const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

//   const handleUploadClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;

//     const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
//       file,
//       name: file.name,
//       size: file.size,
//     }));

//     setUploadedFiles((prev) => [...prev, ...newFiles]);
//   };

//   const handleFileAction = (action: string, index: number) => {
//     const file = uploadedFiles[index];
//     const confirmDelete = window.confirm(`Delete ${file.name}?`);
//     switch (action) {
//       case "view":
//         alert(`Viewing file: ${file.name}`);
//         break;
//       case "share":
//         alert(`Sharing file: ${file.name}`);
//         break;
//       case "delete":
//         if (confirmDelete) {
//           setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
//         }
//         break;
//       default:
//         break;
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

//   // Customize upload button title based on baseRoute
//   const uploadTitle =
//     baseRoute === "handover-tool"
//       ? "Upload Handover Documents"
//       : baseRoute === "second-fixed-list-material"
//       ? "Upload Fixed List Files"
//       : "Upload Files";

//   return (
//     <div className="w-full h-full p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-semibold">
//           📁 {folder.name} — Uploaded Files
//         </h1>
//         <CustomCreateButton title={uploadTitle} onClick={handleUploadClick} />
//       </div>

//       {/* Hidden File Input */}
//       <input
//         ref={fileInputRef}
//         type="file"
//         multiple
//         onChange={handleFileUpload}
//         className="hidden"
//       />

//       {/* File List */}
//       {uploadedFiles.length > 0 ? (
//         <div className="w-full h-full flex flex-wrap gap-4 justify-start items-start content-start">
//           {uploadedFiles.map((file, index) => (
//             <div
//               key={index}
//               className="p-4 bg-[#F1F1F1] rounded outline outline-[#E6E7E7] outline-offset-[-1px] flex flex-col justify-start items-start gap-4"
//             >
//               {/* Top Icons */}
//               <div className="w-full flex justify-end">
//                 <CustomViewMoreButton
//                   items={[
//                     { label: "View", key: "view" },
//                     { label: "Share", key: "share" },
//                     { label: "Delete", key: "delete" },
//                   ]}
//                   onClick={(action: string) => handleFileAction(action, index)}
//                 />
//               </div>

//               {/* File Info */}
//               <div className="flex flex-col items-start gap-2 w-full">
//                 <div className="text-[#2B3738] text-lg font-medium leading-[24.3px] tracking-wide break-words">
//                   {file.name}
//                 </div>
//                 <div className="text-[#6B7374] text-sm font-normal leading-[16.24px] break-words">
//                   {(file.size / 1024).toFixed(2)} KB
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-500">No files uploaded yet.</p>
//       )}
//     </div>
//   );
// };

// export default SubfolderFilesPage;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomCreateButton from "../../components/CustomCreateButton";
import CustomViewMoreButton from "../../components/CustomViewMoreButton";

import {
  useGetAllDocumentFilesQuery,
  useCreateDocumentFileMutation,
  useDeleteDocumentFileMutation,
  useShareDocumentFileMutation,
  useUnShareDocumentFileMutation,
} from "../../Redux/features/projects/project/document/documentSubFolderFileApi";

interface SubfolderFilesPageProps {
  baseRoute?: "documents" | "second-fixed-list-material" | "handover-tool";
}

const SubfolderFilesPage: React.FC<SubfolderFilesPageProps> = ({
  baseRoute = "documents",
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId, subFolderId } = useParams();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const folder = location.state as {
    name: string;
    id?: string;
    from?: string;
  } | null;

  // ✅ API hooks
  const { data, isLoading } = useGetAllDocumentFilesQuery({
    projectId,
    documentSubFolderId: subFolderId,
  });

  const [createFile, { isLoading: creating }] = useCreateDocumentFileMutation();
  const [deleteFile] = useDeleteDocumentFileMutation();
  const [shareFile] = useShareDocumentFileMutation();
  const [unShareFile] = useUnShareDocumentFileMutation();

  const files =
    data?.data?.map((file: any) => ({
      id: file._id,
      name: file.title || file.originalName,
      size: file.size,
    })) || [];

  // ✅ File Upload
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || !subFolderId || !projectId) return;

    try {
      for (const file of files) {
        const response = await createFile({
          file: file,
          title: file.name,
          projectId,
          documentSubFolderId: subFolderId,
        }).unwrap();
        console.log("Upload successful:", response);
      }
    } catch (err) {
      console.error("Failed to upload file:", err);
    }
  };

  // ✅ File Actions
  const handleFileAction = async (action: string, file: any) => {
    switch (action) {
      case "view":
        window.open(file.url, "_blank");
        break;
      case "share":
        await shareFile({ id: file.id, sharedWith: ["userId1", "userId2"] });
        break;
      case "unshare":
        await unShareFile({ id: file.id, unShareWith: ["userId1"] });
        break;
      case "delete":
        if (window.confirm(`Delete ${file.name}?`)) {
          await deleteFile(file.id);
        }
        break;
      default:
        break;
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

  console.log(files);
  // Customize upload button title
  const uploadTitle =
    baseRoute === "handover-tool"
      ? "Upload Handover Documents"
      : baseRoute === "second-fixed-list-material"
      ? "Upload Fixed List Files"
      : "Upload Files";

  return (
    <div className="w-full h-full p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">
          📁 {folder.name} — Uploaded Files
        </h1>
        <CustomCreateButton title={uploadTitle} onClick={handleUploadClick} />
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* File List */}
      {isLoading ? (
        <p>Loading files...</p>
      ) : files.length > 0 ? (
        <div className="w-full h-full flex flex-wrap gap-4 justify-start items-start content-start">
          {files.map((file: any) => (
            <div
              key={file.id}
              className="p-4 bg-[#F1F1F1] rounded outline outline-[#E6E7E7] flex flex-col justify-start items-start gap-4"
            >
              {/* Top Icons */}
              <div className="w-full flex justify-end">
                <CustomViewMoreButton
                  items={[
                    { label: "View", key: "view" },
                    { label: "Share", key: "share" },
                    { label: "Unshare", key: "unshare" },
                    { label: "Delete", key: "delete" },
                  ]}
                  onClick={(action: string) => handleFileAction(action, file)}
                />
              </div>

              {/* File Info */}
              <div className="flex flex-col items-start gap-2 w-full">
                <div className="text-[#2B3738] text-lg font-medium break-words">
                  {file.name}
                </div>
                <div className="text-[#6B7374] text-sm font-normal">
                  {(file.size / 1024).toFixed(2)} KB
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No files uploaded yet.</p>
      )}

      {creating && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
    </div>
  );
};

export default SubfolderFilesPage;
