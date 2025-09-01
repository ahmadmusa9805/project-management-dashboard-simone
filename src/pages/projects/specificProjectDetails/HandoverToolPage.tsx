/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO: importtant ---------------------------------------------------------------------------------------------------------------------------------------------------------
/* eslint-disable @typescript-eslint/no-explicit-any */
// import DocumentsPage from "./DocumentsPage";

// import SubfolderFilesPage from "../../shared/SubfolderFilesPage";

// const HandoverToolPage = () => (
//   <div>
//     {/* <DocumentsPage title="Handover Tool"></DocumentsPage> */}
//     <SubfolderFilesPage baseRoute="handover-tool" />
//   </div>
// );
// export default HandoverToolPage;

// TODO: reviewing ---------------------------------------------------------------------------------------------------------------------------------------------------------
import type React from "react";
import { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetAllHandoversQuery,
  useCreateHandoverMutation,
  useDeleteHandoverMutation,
  useShareHandoverFileMutation,
  useUnShareHandoverFileMutation,
  useGetSingleHandoverQuery,
} from "../../../Redux/features/projects/project/handover/handoverApi";

import {
  useCreateHandoverCombineMutation,
  useGetAllHandoverCombinesQuery,
  useDeleteHandoverCombineMutation,
  useUpdateHandoverCombineMutation,
  useShareHandoverCombineMutation,
  useUnShareHandoverCombineMutation,
  useGetSingleHandoverCombineQuery,
} from "../../../Redux/features/projects/project/handover/handoverCombineApi";

import type { SharedUser } from "../../../Redux/features/projects/projectsApi";
import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
import CustomCreateButton from "../../../components/CustomCreateButton";
import { Modal, Checkbox, Button, Input, message } from "antd";
import CreateFolder from "../../../components/CreateFolder";
import CustomShareSelector from "../../../components/CustomShareSelector";
import CustomUnshareSelector from "../../../components/CustomUnshareSelector";

interface FileItem {
  id: string;
  name: string;
  size: number;
  url: string;
}

interface Folder {
  _id: string;
  title: string;
  files: any[];
}

const HandoverToolPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameFolderId, setRenameFolderId] = useState<string | null>(null);
  const [newFolderTitle, setNewFolderTitle] = useState("");

  // Share/unshare modal state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [unshareModalOpen, setUnshareModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isFolder, setIsFolder] = useState(false);

  // API hooks
  const {
    data: handoverData,
    isLoading,
    refetch: refetchHandovers,
  } = useGetAllHandoversQuery(projectId ? { projectId } : undefined, {
    skip: !projectId,
  });

  const { data: folderData, refetch: refetchFolders } =
    useGetAllHandoverCombinesQuery(projectId ? { projectId } : undefined, {
      skip: !projectId,
    });

  const { data: singleHandoverData, refetch: refetchSingleFolder } =
    useGetSingleHandoverQuery(selectedItemId!, {
      skip: !selectedItemId || isFolder,
    });

  const { data: singleFolderData } = useGetSingleHandoverCombineQuery(
    selectedItemId!,
    { skip: !selectedItemId || !isFolder }
  );

  const [createHandover, { isLoading: creating }] = useCreateHandoverMutation();
  const [deleteHandover] = useDeleteHandoverMutation();
  const [shareHandover] = useShareHandoverFileMutation();
  const [unShareHandover] = useUnShareHandoverFileMutation();

  const [createHandoverCombine, { isLoading: creatingFolder }] =
    useCreateHandoverCombineMutation();
  const [deleteHandoverCombine] = useDeleteHandoverCombineMutation();
  const [updateHandoverCombine] = useUpdateHandoverCombineMutation();
  const [shareHandoverCombine] = useShareHandoverCombineMutation();
  const [unShareHandoverCombine] = useUnShareHandoverCombineMutation();

  const files: FileItem[] =
    handoverData?.data?.map((file: any) => ({
      id: file._id,
      name: file.title || file.originalName,
      size: file.size,
      url: file.url || "#",
    })) || [];

  const folders: Folder[] =
    folderData?.data?.map((folder: any) => ({
      _id: folder._id,
      title: folder.title,
      files: folder.files,
    })) || [];

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !projectId) return;
    try {
      for (const file of Array.from(files)) {
        await createHandover({ projectId, title: file.name, file }).unwrap();
      }
      refetchHandovers();
    } catch (err) {
      message.error("Failed to upload files");
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFileIds((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleCreateFolder = async (folderName: string) => {
    if (!projectId || selectedFileIds.length === 0) return;
    try {
      await createHandoverCombine({
        projectId,
        title: folderName,
        files: selectedFileIds,
      }).unwrap();
      setIsCreateFolderModalOpen(false);
      setSelectedFileIds([]);
      refetchFolders();
    } catch {
      message.error("Failed to create folder");
    }
  };

  // File actions
  const handleFileAction = async (action: string, file: FileItem) => {
    switch (action) {
      case "view":
        window.open(file.url, "_blank");
        break;
      case "share":
        setSelectedItemId(file.id);
        setIsFolder(false);
        setShareModalOpen(true);
        break;
      case "unshare":
        setSelectedItemId(file.id);
        setIsFolder(false);
        setUnshareModalOpen(true);
        refetchSingleFolder();
        break;
      case "delete":
        if (window.confirm(`Delete ${file.name}?`)) {
          await deleteHandover(file.id);
          refetchHandovers();
        }
        break;
    }
  };

  // Folder actions
  const handleFolderAction = async (action: string, folder: Folder) => {
    switch (action) {
      case "view":
        navigate(`/handover/folder/${folder._id}`);
        break;
      case "update":
        setRenameFolderId(folder._id);
        setNewFolderTitle(folder.title);
        setIsRenameModalOpen(true);
        break;
      case "delete":
        if (window.confirm(`Delete folder ${folder.title}?`)) {
          await deleteHandoverCombine(folder._id);
          refetchFolders();
        }
        break;
      case "share":
        setSelectedItemId(folder._id);
        setIsFolder(true);
        setShareModalOpen(true);
        break;
      case "unshare":
        setSelectedItemId(folder._id);
        setIsFolder(true);
        setUnshareModalOpen(true);

        break;
    }
  };

  const handleUpdateFolder = async () => {
    if (!renameFolderId || !newFolderTitle) return;
    try {
      await updateHandoverCombine({
        id: renameFolderId,
        title: newFolderTitle,
      }).unwrap();
      setIsRenameModalOpen(false);
      setRenameFolderId(null);
      setNewFolderTitle("");
      refetchFolders();
    } catch {
      message.error("Failed to update folder");
    }
  };

  // Confirm Share
  const handleConfirmShare = async (selectedUsers: SharedUser[]) => {
    console.log(selectedUsers);
    try {
      if (isFolder) {
        await shareHandoverCombine({
          id: selectedItemId!,
          sharedWith: selectedUsers,
        }).unwrap();
      } else {
        await shareHandover({
          id: selectedItemId!,
          sharedWith: selectedUsers,
        }).unwrap();
      }
      message.success("Shared successfully");
      setShareModalOpen(false);
      setSelectedItemId(null);
    } catch {
      message.error("Failed to share");
    }
  };

  // Confirm Unshare
  const handleConfirmUnshare = async (selectedUsers: SharedUser[]) => {
    try {
      if (isFolder) {
        await unShareHandoverCombine({
          id: selectedItemId!,
          unShareWith: selectedUsers.map((u) => u.userId),
        }).unwrap();
      } else {
        await unShareHandover({
          id: selectedItemId!,
          unShareWith: selectedUsers.map((u) => u.userId),
        }).unwrap();
        refetchSingleFolder();
      }
      message.success("Unshared successfully");
      setUnshareModalOpen(false);
      setSelectedItemId(null);
    } catch {
      message.error("Failed to unshare");
    }
  };

  console.log(singleFolderData, "singleFolderData");
  console.log(singleHandoverData, "singleHandoverData");

  return (
    <div className="w-full px-4 gap-4 bg-white min-h-screen pt-3">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">📁 Handover — Uploaded Files</h1>
        <div className="flex gap-2">
          <CustomCreateButton
            title="Upload Handover Documents"
            onClick={handleUploadClick}
          />
          <Button
            type="primary"
            onClick={() => setIsCreateFolderModalOpen(true)}
            disabled={selectedFileIds.length === 0}
          >
            Create Folder from Selected
          </Button>
        </div>
      </div>

      {selectedFileIds.length > 0 && (
        <div className="mb-4 p-2 bg-blue-50 rounded-md">
          <p className="text-blue-700">
            {selectedFileIds.length} file
            {selectedFileIds.length !== 1 ? "s" : ""} selected
          </p>
          <Button
            type="link"
            size="small"
            onClick={() => setSelectedFileIds([])}
            className="p-0 text-blue-500"
          >
            Clear selection
          </Button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Folders */}
      {folders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">📂 Folders</h2>
          <div className="flex flex-wrap gap-4">
            {folders.map((folder) => (
              <div
                key={folder._id}
                className="p-4 bg-[#E8F5E9] rounded outline outline-[#C8E6C9] flex flex-col gap-2 w-64"
              >
                <div className="flex justify-between items-center">
                  <div className="text-lg font-medium">{folder.title}</div>
                  <CustomViewMoreButton
                    items={[
                      { label: "View", key: "view" },
                      { label: "Update", key: "update" },
                      { label: "Delete", key: "delete" },
                      { label: "Share", key: "share" },
                      { label: "Unshare", key: "unshare" },
                    ]}
                    onClick={(action: string) =>
                      handleFolderAction(action, folder)
                    }
                  />
                </div>
                <div className="text-sm text-gray-600">
                  {folder.files.length} file
                  {folder.files.length !== 1 ? "s" : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Files */}
      {isLoading ? (
        <p>Loading files...</p>
      ) : files.length > 0 ? (
        <div className="w-full h-full flex flex-wrap gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className={`p-4 rounded outline flex flex-col gap-4 w-64 ${
                selectedFileIds.includes(file.id)
                  ? "bg-blue-50 outline-blue-200"
                  : "bg-[#F1F1F1] outline-[#E6E7E7]"
              }`}
            >
              <div className="flex items-center justify-between">
                <Checkbox
                  checked={selectedFileIds.includes(file.id)}
                  onChange={() => toggleFileSelection(file.id)}
                >
                  Select
                </Checkbox>
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
              <div className="flex flex-col gap-2">
                <div className="text-lg font-medium break-words">
                  {file.name}
                </div>
                <div className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center flex items-center justify-center w-full min-h-screen">
          <p className="text-gray-500">No handover documents yet.</p>
        </div>
      )}

      {creating && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}

      {/* Create Folder Modal */}
      <Modal
        open={isCreateFolderModalOpen}
        onCancel={() => setIsCreateFolderModalOpen(false)}
        footer={null}
        width={500}
        closable={false}
      >
        <CreateFolder
          onCancel={() => setIsCreateFolderModalOpen(false)}
          onCreate={handleCreateFolder}
        />
        {creatingFolder && (
          <p className="text-sm text-gray-500 mt-2">Creating folder...</p>
        )}
      </Modal>

      {/* Rename Folder Modal */}
      <Modal
        open={isRenameModalOpen}
        onCancel={() => setIsRenameModalOpen(false)}
        onOk={handleUpdateFolder}
        okText="Update"
        title="Rename Folder"
      >
        <Input
          value={newFolderTitle}
          onChange={(e) => setNewFolderTitle(e.target.value)}
          placeholder="Enter new folder name"
        />
      </Modal>

      {/* Share Modal */}
      <Modal
        title="Share"
        open={shareModalOpen}
        onCancel={() => setShareModalOpen(false)}
        footer={null}
        width={500}
      >
        <CustomShareSelector
          roles={["prime-admin", "basic-admin", "client"]}
          onShare={handleConfirmShare}
        />
      </Modal>

      {/* Unshare Modal */}
      <Modal
        title="Unshare"
        open={unshareModalOpen}
        onCancel={() => {
          setUnshareModalOpen(false);
          setSelectedItemId(null);
        }}
        footer={null}
        width={500}
      >
        <CustomUnshareSelector
          sharedUsers={(
            (isFolder
              ? singleFolderData?.sharedWith
              : singleHandoverData?.sharedWith) || []
          ).map((u: any) => ({
            userId: u.userId._id,
            name: u.userId.name,
            role: u.userId.role,
            email: u.userId.email || "",
            profileImg: u.userId.profileImg,
          }))}
          onUnshare={handleConfirmUnshare}
        />
      </Modal>
    </div>
  );
};

export default HandoverToolPage;
