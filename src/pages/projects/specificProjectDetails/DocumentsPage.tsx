import { useState } from "react";
import { Modal } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import CustomCreateButton from "../../../components/CustomCreateButton";
import CustomSearchInput from "../../../components/CustomSearchInput";
import CreateFolder from "../../../components/CreateFolder";

type Folder = {
  id: string;
  name: string;
};

interface documentsComponenetsProps {
  title?: string;
}

const DocumentsPage = ({ title }: documentsComponenetsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const navigate = useNavigate();
  const { projectId } = useParams();

  // ✅ Normalize title logic
  const pageTitle = title || "Documents";

  // ✅ Map title to baseRoute (URL segment)
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

  const handleCreateFolder = (folderName: string, folderId: string) => {
    setFolders((prev) => [...prev, { id: folderId, name: folderName }]);
    setIsModalOpen(false);
  };

  const handleFolderClick = (folder: Folder) => {
    const baseRoute = getBaseRoute();

    navigate(`/projects/${projectId}/${baseRoute}/${folder.id}`, {
      state: {
        name: folder.name,
        id: folder.id,
        from: baseRoute,
      },
    });
  };

  return (
    <div className="w-full h-full p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">{pageTitle} Manage</h1>
        <CustomSearchInput onSearch={() => {}} />
      </div>

      {/* Create Button */}
      <div className="flex justify-end mr-4 mb-6">
        <CustomCreateButton
          title="Create New Folder"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      {/* Folder List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {folders.map((folder) => (
          <div
            key={folder.id}
            onClick={() => handleFolderClick(folder)}
            className="p-4 border border-gray-300 rounded shadow bg-white text-gray-800 cursor-pointer hover:bg-gray-100 transition"
          >
            <h3 className="text-lg font-medium truncate">📁 {folder.name}</h3>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={500}
        closable={false}
      >
        <CreateFolder
          onCancel={() => setIsModalOpen(false)}
          onCreate={handleCreateFolder}
        />
      </Modal>
    </div>
  );
};

export default DocumentsPage;
