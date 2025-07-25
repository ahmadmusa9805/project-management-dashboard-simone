import { useState } from "react";
import { Modal } from "antd";
import CustomCreateButton from "../../../components/CustomCreateButton";
import CustomSearchInput from "../../../components/CustomSearchInput";
import CreateFolder from "../../../components/CreateFolder";

const DocumentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folders, setFolders] = useState<string[]>([]);

  const handleCreateFolder = (folderName: string) => {
    setFolders((prev) => [...prev, folderName]);
    setIsModalOpen(false);
  };

  return (
    <div>
      {" "}
      <div className="w-full h-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Manage Documents</h1>
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
          {folders.map((folder, idx) => (
            <div
              key={idx}
              className="p-4 border border-gray-300 rounded shadow bg-white text-gray-800"
            >
              <h3 className="text-lg font-medium truncate">📁{folder}</h3>
            </div>
          ))}
        </div>

        {/* Folder Create Modal */}
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
    </div>
  );
};
export default DocumentsPage;
