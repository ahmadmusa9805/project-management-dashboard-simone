// import React, { useState } from "react";

// interface CreateFolderProps {
//   onCreate: (folderName: string, folderId: string) => void;
//   onCancel: () => void;
// }

// const CreateFolder: React.FC<CreateFolderProps> = ({ onCreate, onCancel }) => {
//   const [folderName, setFolderName] = useState("Untitled folder");

//   const generateFolderId = () => `folder-${Date.now()}`;

//   const handleCreate = () => {
//     const id = generateFolderId();
//     onCreate(folderName, id);
//   };

//   return (
//     <div className="w-full h-full p-6 bg-white shadow-xl rounded-md flex flex-col gap-6">
//       {/* Header & Input */}
//       <div className="flex flex-col gap-3 w-full">
//         <h2 className="text-[24px] font-medium text-[#000E0F] leading-[31.68px] tracking-[0.24px] font-['IBM Plex Sans']">
//           New folder
//         </h2>

//         <input
//           type="text"
//           value={folderName}
//           onChange={(e) => setFolderName(e.target.value)}
//           placeholder="Untitled folder"
//           className="w-full px-2 py-3 border-2 border-[#001D01] outline-none text-sm font-normal font-['IBM Plex Sans'] text-[#172B4D] placeholder:text-[#626F86] rounded"
//         />
//       </div>

//       {/* Buttons */}
//       <div className="flex items-center gap-4 w-full">
//         <button
//           onClick={onCancel}
//           className="h-12 px-6 bg-[#172B4D0F] text-[#001D01] rounded text-base font-medium font-['IBM Plex Sans'] tracking-[0.48px] hover:bg-[#172B4D1A] transition"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={handleCreate}
//           className="h-12 px-6 bg-[#001D01] text-white rounded text-base font-medium font-['IBM Plex Sans'] tracking-[0.48px] hover:bg-[#003A03] transition"
//         >
//           Create folder
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CreateFolder;

import { Button } from "antd";
import React, { useState, useEffect } from "react";

interface CreateFolderProps {
  onCreate: (folderName: string) => void;
  onCancel: () => void;
  initialValue?: string; // optional, for editing
}

const CreateFolder: React.FC<CreateFolderProps> = ({
  onCreate,
  onCancel,
  initialValue = "",
}) => {
  const [folderName, setFolderName] = useState(initialValue);

  // Update state if initialValue changes (for editing different folders)
  useEffect(() => {
    setFolderName(initialValue);
  }, [initialValue]);

  const handleCreate = () => {
    if (!folderName.trim()) return;
    onCreate(folderName); // ✅ pass name back to parent
  };

  return (
    <div className="w-full h-full p-6 bg-white shadow-md rounded-md flex flex-col gap-6">
      {/* Header & Input */}
      <div className="flex flex-col gap-3 w-full">
        <h2 className="text-[24px] font-medium text-[#000E0F]">
          {initialValue ? "Update folder" : "New folder"}
        </h2>

        <input
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="folder name"
          className="w-full px-2 py-3 border-2 border-[#001D01] outline-none text-sm rounded"
          autoFocus // ✅ focus input when modal opens
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4 w-full">
        <Button
          onClick={onCancel}
          type="text"
          className="h-12 px-6 cancel transition"
        >
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={handleCreate}
          className="h-12 px-6 text-white rounded transition"
        >
          {initialValue ? "Update folder" : "Create folder"}
        </Button>
      </div>
    </div>
  );
};

export default CreateFolder;
