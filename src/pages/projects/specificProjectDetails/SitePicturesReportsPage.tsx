/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import CreateFolder from "../../../components/CreateFolder";
import CustomCreateButton from "../../../components/CustomCreateButton";
import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
import { useEffect, useState } from "react";
import {
  useGetAllSitePictureFoldersQuery,
  useCreateSitePictureFolderMutation,
  useDeleteSitePictureFolderMutation,
  useShareSitePictureFolderMutation,
  useUnshareSitePictureFolderMutation,
} from "../../../Redux/features/projects/project/siteReportPictures/sitePictureFolderApi";

const autoCreateFolders = [
  { id: "demolitions", title: "Demolitions", isStatic: true },
  { id: "structural-works", title: "Structural works", isStatic: true },
  { id: "internal-works", title: "Internal works", isStatic: true },
  { id: "m-e", title: "M/E", isStatic: true },
  { id: "finishing", title: "Finishing", isStatic: true },
];

const reportFolder = { id: "report", title: "Report", isStatic: true };

const SitePicturesReportsPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const { data, isLoading, refetch } = useGetAllSitePictureFoldersQuery({
    projectId,
  });
  const [createFolder] = useCreateSitePictureFolderMutation();
  const [deleteFolder] = useDeleteSitePictureFolderMutation();
  const [shareFolder] = useShareSitePictureFolderMutation();
  const [unshareFolder] = useUnshareSitePictureFolderMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-create static folders (except Report)
  useEffect(() => {
    if (!isLoading && projectId) {
      const dbFolders = data?.data?.filter((f: any) => f.isStatic) || [];
      const existingTitles = dbFolders.map((f: any) => f.title);
      const foldersToCreate = autoCreateFolders.filter(
        (f) => !existingTitles.includes(f.title)
      );

      if (foldersToCreate.length > 0) {
        (async () => {
          for (const folder of foldersToCreate) {
            await createFolder({
              title: folder.title,
              projectId,
              isStatic: true,
            });
          }
          if (refetch) refetch();
        })();
      }
    }
  }, [isLoading, data, projectId, createFolder, refetch]);

  const handleFolderClick = (folderId: string) => {
    navigate(`/projects/${projectId}/site-pictures-reports/${folderId}`);
  };

  const handleCreateFolder = async (folderName: string) => {
    await createFolder({ title: folderName, projectId });
    setIsModalOpen(false);
    refetch();
  };

  // Check if a folder is static (from autoCreateFolders or Report)
  const isStaticFolder = (folder: any) => {
    return (
      folder.isStatic ||
      autoCreateFolders.some((f) => f.title === folder.title) ||
      folder.id === "report"
    );
  };

  // Handle actions from ViewMoreButton
  const handleFolderAction = async (folder: any, key: string) => {
    switch (key) {
      case "delete":
        await deleteFolder(folder._id || folder.id);
        refetch();
        break;
      case "share":
        await shareFolder({ id: folder._id || folder.id, data: {} });
        refetch();
        break;
      case "unshare":
        await unshareFolder({ id: folder._id || folder.id, data: {} });
        refetch();
        break;
      case "edit":
        // Add edit logic if needed
        break;
      default:
        break;
    }
  };

  if (isLoading) return <p>Loading...</p>;

  // Merge DB folders + static Report folder for display
  const allFolders = [...data.data, reportFolder];

  return (
    <div className="self-stretch px-8 py-6 bg-white inline-flex flex-col justify-start items-end gap-8">
      {/* Header */}
      <div className="self-stretch inline-flex justify-between items-center">
        <h1 className="text-gray-950 text-2xl font-medium">
          Site Pictures & Reports
        </h1>
        <CustomCreateButton
          title="Create New Category"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      {/* Folder Grid */}
      <div className="self-stretch flex-1 flex flex-wrap gap-4">
        {allFolders.map((folder: any) => {
          const isStatic = isStaticFolder(folder);

          return (
            <div
              key={folder._id || folder.id}
              className="w-80 h-28 px-3 py-8 bg-zinc-100 rounded-[3px] flex justify-between items-center gap-4 cursor-pointer hover:bg-zinc-200 transition"
            >
              <div
                className="flex flex-col flex-1"
                onClick={() => handleFolderClick(folder._id || folder.id)}
              >
                <div className="text-gray-950 text-lg font-medium truncate">
                  {folder.title}
                </div>
                {!isStatic && (
                  <span className="text-xs text-gray-500">Custom Folder</span>
                )}
              </div>

              {/* Hide ViewMoreButton for static Report folder */}
              {!(folder.isStatic && folder.id === "report") && (
                <CustomViewMoreButton
                  items={[
                    { label: "Share", key: "share" },
                    { label: "Unshare", key: "unshare" },
                    // Only show Edit and Delete for non-static folders
                    ...(isStatic
                      ? []
                      : [
                          { label: "Edit", key: "edit" },
                          { label: "Delete", key: "delete" },
                        ]),
                  ]}
                  onClick={(key) => handleFolderAction(folder, key)}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Modal for creating custom folder */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <CreateFolder
          onCancel={() => setIsModalOpen(false)}
          onCreate={handleCreateFolder}
        />
      </Modal>
    </div>
  );
};

export default SitePicturesReportsPage;
