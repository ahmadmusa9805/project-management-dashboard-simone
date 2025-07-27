import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Drawer } from "antd";
import CustomCreateButton from "./CustomCreateButton"; // adjust the path
import ReportForm from "./ReportForm"; // adjust the path
import ImageUploader from "./ImageUploader";
import ImageGallery from "./ImageGallery";
import { folderContent } from "../data/imageGalleryData";

const SitePicturesAndReportsViewPage: React.FC = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const pictures = folderContent[folderId as keyof typeof folderContent] || [];

  const isReport = folderId === "report";

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleCreate = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold capitalize">
          {folderId?.replace(/-/g, " ")}
        </h1>

        <CustomCreateButton
          title={isReport ? "Create Report" : "Upload Image"}
          onClick={handleCreate}
        />
      </div>

      {/* Drawer */}
      <Drawer
        title={isReport ? "Create Daily Report" : "Upload Image"}
        placement="right"
        width={640}
        onClose={handleCloseDrawer}
        open={isDrawerOpen}
      >
        {isReport ? (
          <ReportForm />
        ) : (
          <ImageUploader
            onUploadSuccess={(files) => {
              console.log("Uploaded Files:", files);
              // You can push these to backend or add to your local state
            }}
          />
        )}
      </Drawer>

      {/* Picture Grid */}
      {pictures.length === 0 ? (
        <p className="text-gray-600">No pictures uploaded yet.</p>
      ) : (
        <ImageGallery images={pictures} />
      )}
    </div>
  );
};

export default SitePicturesAndReportsViewPage;
