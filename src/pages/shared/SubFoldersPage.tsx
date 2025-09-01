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

import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Modal } from "antd";
import CustomCreateButton from "../../components/CustomCreateButton";
import CreateFolder from "../../components/CreateFolder";
import {
  useCreateDocumentSubfolderMutation,
  useGetAllDocumentSubfoldersQuery,
} from "../../Redux/features/projects/project/document/documentsubFolderApi";
import {
  useCreateSecondFixSubFolderMutation,
  useGetAllSecondFixSubFoldersQuery,
} from "../../Redux/features/projects/project/SecondFixedList/SecondFixSubFolderApi";

// Import the second fix subfolders API hooks

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

  // Conditionally choose which API to use based on baseRoute
  const isSecondFixedList = baseRoute === "second-fixed-list-material";

  // ✅ Fetch subfolders - conditionally use the appropriate query
  const { data: documentData, isLoading: documentLoading } =
    useGetAllDocumentSubfoldersQuery(
      {
        projectId,
        documentId: mainFolderId,
      },
      { skip: isSecondFixedList } // Skip this query if it's Second Fixed List
    );

  const { data: secondFixData, isLoading: secondFixLoading } =
    useGetAllSecondFixSubFoldersQuery(
      {
        projectId,
        secondFixFolderId: mainFolderId,
      },
      { skip: !isSecondFixedList } // Skip this query if it's NOT Second Fixed List
    );

  // ✅ create mutations - conditionally use the appropriate mutation
  const [createDocumentSubfolder, { isLoading: creatingDocument }] =
    useCreateDocumentSubfolderMutation();
  const [createSecondFixSubFolder, { isLoading: creatingSecondFix }] =
    useCreateSecondFixSubFolderMutation();

  // Determine which data and loading state to use
  const isLoading = isSecondFixedList ? secondFixLoading : documentLoading;
  const creating = isSecondFixedList ? creatingSecondFix : creatingDocument;

  // Transform data to consistent subfolder format regardless of API
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

  // ✅ API-based subfolder creation - conditionally use the appropriate API
  const handleCreateSubfolder = async (name: string) => {
    try {
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
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to create subfolder:", err);
    }
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
          className="text-blue-500 underline mt-2"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 gap-4 bg-white min-h-screen pt-3">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">
          📁 {folder?.name || mainFolderId} — Subfolders
        </h1>
        <CustomCreateButton
          title="Create Subfolder"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      {/* Subfolder list */}
      {isLoading ? (
        <p>Loading subfolders...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {subfolders.map((sub: { id: any; name: any }) => (
            <div
              key={sub.id}
              onClick={() => handleSubfolderClick(sub)}
              className="p-4 border border-gray-300 rounded shadow bg-white text-gray-800 cursor-pointer hover:bg-gray-100 transition"
            >
              <h3 className="text-lg font-medium truncate">📂 {sub.name}</h3>
            </div>
          ))}
        </div>
      )}

      {/* Modal for creating subfolder */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={500}
        closable={false}
      >
        <CreateFolder
          onCancel={() => setIsModalOpen(false)}
          onCreate={handleCreateSubfolder}
        />
        {creating && <p className="text-sm text-gray-500 mt-2">Creating...</p>}
      </Modal>
    </div>
  );
};

export default SubFoldersPage;
