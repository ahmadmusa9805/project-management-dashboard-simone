import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Modal } from "antd";
import CreateFolder from "../../components/CreateFolder";
import CustomCreateButton from "../../components/CustomCreateButton";

type Subfolder = {
  id: string;
  name: string;
};

const SubFoldersPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId, mainFolderId } = useParams();
  console.log("projectId:", projectId);

  const folder = location.state as { name: string; id: string } | null;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subfolders, setSubfolders] = useState<Subfolder[]>([]);

  const handleCreateSubfolder = (name: string, id: string) => {
    setSubfolders((prev) => [...prev, { name, id }]);
    setIsModalOpen(false);
  };

  const handleSubfolderClick = (sub: Subfolder) => {
    navigate(`/projects/${projectId}/documents/${mainFolderId}/${sub.id}`, {
      state: { name: sub.name, id: sub.id },
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
    <div className="w-full h-full p-6">
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

      {/* Subfolders List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {subfolders.map((sub) => (
          <div
            key={sub.id}
            onClick={() => handleSubfolderClick(sub)}
            className="p-4 border border-gray-300 rounded shadow bg-white text-gray-800 cursor-pointer hover:bg-gray-100 transition"
          >
            <h3 className="text-lg font-medium truncate">📂 {sub.name}</h3>
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
          onCreate={handleCreateSubfolder}
        />
      </Modal>
    </div>
  );
};

export default SubFoldersPage;
