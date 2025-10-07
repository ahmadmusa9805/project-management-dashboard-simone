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
import { useState } from "react";
import { useParams } from "react-router-dom";
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
import {
  Modal,
  Checkbox,
  Button,
  Input,
  message,
  Spin,
  Row,
  Col,
  Card,
} from "antd";
import CreateFolder from "../../../components/CreateFolder";
import CustomShareSelector from "../../../components/CustomShareSelector";
// import CustomUnshareSelector from "../../../components/CustomUnshareSelector";
import { Unlink } from "lucide-react";
import ImageUploader from "../../../components/ImageUploader";
import CertificateDocumentSceoundFixViewer from "../../../components/CertificateDocumentSceoundFixViewer";
import { showDeleteAlert } from "../../../utils/deleteAlert";
import { errorAlert, successAlert } from "../../../utils/alerts";
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
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedFile] = useState<any>(null);
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

  const { data: singleHandoverData } = useGetSingleHandoverQuery(
    selectedItemId!,
    {
      skip: !selectedItemId || isFolder,
    }
  );

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

  const handleUploadSuccess = async (fileList: any[]) => {
    console.log(fileList);
    if (!projectId) return;
    try {
      for (const file of fileList) {
        await createHandover({
          projectId,
          title: file.name,
          file: file, // 👈 actual File object
        }).unwrap();
      }
      message.success("Files uploaded successfully");
      refetchHandovers();
      setUploaderOpen(false);
    } catch {
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
        setSelectedItemId(file.id); // set ID for fetching
        setIsFolder(false); // it's a single file
        setViewModalOpen(true);
        // window.open(file.url, "_blank");
        break;
      case "share":
        setSelectedItemId(file.id);
        setIsFolder(false);
        setShareModalOpen(true);
        break;
      case "unshare":
        console.log(file.id, "unshare");
        setSelectedItemId(file.id);
        setIsFolder(false);
        setUnshareModalOpen(true);

        break;
      case "delete":
        showDeleteAlert({
          title: "Are you sure?",
          text: `Delete ${file.name}? This action cannot be undone.`,
          onConfirm: async () => {
            try {
              await deleteHandover(file.id).unwrap();
              // successAlert("File deleted successfully");
              refetchHandovers();
            } catch (error) {
              errorAlert("Failed to delete file");
            }
          },
        });

        // if (window.confirm(`Delete ${file.name}?`)) {
        //   await deleteHandover(file.id);

        // }
        break;
    }
  };

  // Folder actions
  const handleFolderAction = async (action: string, folder: Folder) => {
    switch (action) {
      case "update":
        setRenameFolderId(folder._id);
        setNewFolderTitle(folder.title);
        setIsRenameModalOpen(true);
        break;
      case "delete":
        showDeleteAlert({
          title: "Are you sure?",
          text: `Delete ${folder.title}? This action cannot be undone.`,
          onConfirm: async () => {
            try {
              await deleteHandoverCombine(folder._id).unwrap();
              // successAlert("File deleted successfully");
              refetchFolders();
            } catch (error) {
              errorAlert("Failed to delete file");
            }
          },
        });

        // if (window.confirm(`Delete folder ${folder.title}?`)) {
        //   await deleteHandoverCombine(folder._id);

        // }
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
        successAlert("Shared successfully");
      } else {
        await shareHandover({
          id: selectedItemId!,
          sharedWith: selectedUsers,
        }).unwrap();
      }
      successAlert("Shared successfully");
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
        successAlert("Unshared successfully");
      } else {
        await unShareHandover({
          id: selectedItemId!,
          unShareWith: selectedUsers.map((u) => u.userId),
        }).unwrap();
        successAlert("Unshared successfully");
      }
      message.success("Unshared successfully");
      setUnshareModalOpen(false);
      setSelectedItemId(null);
    } catch {
      message.error("Failed to unshare");
    }
  };

  console.log(selectedFile, "selectedFile");
  // console.log(singleFolderData, "singleFolderData");
  // console.log(singleHandoverData, "singleHandoverData");

  return (
    <div className="w-full  gap-4 bg-white min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between   py-10">
        <h1 className="text-2xl font-semibold">Handover</h1>
        <div className="flex gap-2">
          <CustomCreateButton
            title="Create Handover"
            onClick={() => setUploaderOpen(true)}
          />
          <CustomCreateButton
            title="Create Folder from Selected"
            onClick={() => setIsCreateFolderModalOpen(true)}
            disabled={selectedFileIds.length === 0}
          />
          {/* <Button
            type="primary"
            className="py-10 flex justify-between"
            onClick={() => setIsCreateFolderModalOpen(true)}
            disabled={selectedFileIds.length === 0}
          >
            Create Folder from Selected
          </Button> */}
        </div>
      </div>

      {selectedFileIds.length > 0 && (
        <div className="mb-4 p-3 bg-[#e6f4ea] rounded-md">
          <p className="text-[#0d542b]">
            {selectedFileIds.length} file
            {selectedFileIds.length !== 1 ? "s" : ""} selected
          </p>
          <Button
            type="link"
            size="small"
            onClick={() => setSelectedFileIds([])}
            style={{ color: "#0d542b" }} // <-- use inline style to override AntD
            className="p-0"
          >
            Clear selection
          </Button>
        </div>
      )}

      {/* <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      /> */}
      {/* Files */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : files.length > 0 ? (
        <Row gutter={[16, 16]} className="">
          {files.map((file) => (
            <Col span={6} key={file.id}>
              <Card
                title={
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      📄 {file.name}
                    </h3>
                    <Checkbox
                      checked={selectedFileIds.includes(file.id)}
                      onChange={() => toggleFileSelection(file.id)}
                    />
                  </div>
                }
                hoverable
                style={{ backgroundColor: "#f1f1f1" }}
                bodyStyle={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  height: "60px", // keep same height as folders
                  padding: "12px 24px",
                }}
                // onClick={() => handleFileAction("view", file)}
                extra={
                  <CustomViewMoreButton
                    items={[
                      { key: "view", label: "👁️ View" },
                      { key: "share", label: "🔗 Share" },
                      {
                        key: "unshare",
                        label: (
                          <div className="flex items-center gap-1">
                            <Unlink className="text-green-500" size={14} />
                            Unshare
                          </div>
                        ),
                      },
                      { key: "delete", label: "🗑️ Delete", danger: true },
                    ]}
                    onClick={(action: string) => handleFileAction(action, file)}
                  />
                }
              />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center flex items-center justify-center w-full min-h-screen">
          <p className="text-gray-500">No handover documents yet.</p>
        </div>
      )}

      {/* Folders */}
      {folders.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-semibold ">📂 Created Folders</h2>
          <Row gutter={[16, 16]} className="mt-10">
            {folders.map((folder) => (
              <Col span={6} key={folder._id}>
                <Card
                  title={
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      📁 {folder.title}
                    </h3>
                  }
                  style={{ backgroundColor: "#E8F5E9" }}
                  bodyStyle={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    height: "60px",
                    padding: "12px 24px",
                  }}
                  onClick={() => console.log("Open folder", folder._id)}
                  extra={
                    <CustomViewMoreButton
                      items={[
                        { key: "share", label: "🔗 Share" },
                        {
                          key: "unshare",
                          label: (
                            <div className="flex items-center gap-1">
                              <Unlink className="text-green-500" size={14} />
                              Unshare
                            </div>
                          ),
                        },
                        { key: "delete", label: "🗑️ Delete", danger: true },
                      ]}
                      onClick={(action: string) =>
                        handleFolderAction(action, folder)
                      }
                    />
                  }
                >
                  {/* <p className="text-sm text-gray-600">
              {folder.files.length} file
              {folder.files.length !== 1 ? "s" : ""}
            </p> */}
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* {creating && <p className="text-sm text-gray-500 mt-2">Uploading...</p>} */}

      <Modal
        title="Upload Handover Documents"
        open={uploaderOpen}
        onCancel={() => setUploaderOpen(false)}
        footer={null}
        width={500}
      >
        <ImageUploader
          uploading={creating}
          fileType="pdf" // 👈 or "image", depending on what handovers should be
          onUploadSuccess={handleUploadSuccess}
        />
      </Modal>

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

      {/* View modal */}
      <Modal
        title={"File Viewer"}
        open={viewModalOpen}
        onCancel={() => {
          setViewModalOpen(false);
          setSelectedItemId(null);
        }}
        footer={null}
        width={900}
        destroyOnClose
      >
        <CertificateDocumentSceoundFixViewer
          propfileUrl={singleHandoverData?.file}
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
          roles={["superAdmin", "primeAdmin", "basicAdmin", "client"]}
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
        {((isFolder && singleFolderData) ||
          (!isFolder && singleHandoverData)) && (
          <CustomUnshareSelector
            sharedUsers={(
              (isFolder
                ? singleFolderData?.sharedWith
                : singleHandoverData?.sharedWith) || []
            ).map((u: any) => ({
              userId: u.userId._id,
              name: u.userId.name,
              role: u.userId.role || "unknown",
              email: u.userId.email || "",
              profileImg: u.userId.profileImg,
            }))}
            onUnshare={handleConfirmUnshare}
          />
        )}
      </Modal>
    </div>
  );
};

export default HandoverToolPage;
