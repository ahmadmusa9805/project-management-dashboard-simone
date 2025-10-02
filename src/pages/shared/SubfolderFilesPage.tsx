/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Modal, message, Drawer, Spin, Row, Col, Card } from "antd";
import CustomCreateButton from "../../components/CustomCreateButton";
import CustomViewMoreButton from "../../components/CustomViewMoreButton";
import CustomShareSelector from "../../components/CustomShareSelector";
import CustomUnshareSelector from "../../components/CustomUnshareSelector";
import { errorAlert, successAlert } from "../../utils/alerts";
import { ChevronLeft, Unlink } from "lucide-react";

// Document APIs
import {
  useGetAllDocumentFilesQuery,
  useCreateDocumentFileMutation,
  useDeleteDocumentFileMutation,
  useShareDocumentFileMutation,
  useUnShareDocumentFileMutation,
  useGetSingleDocumentFileQuery,
} from "../../Redux/features/projects/project/document/documentSubFolderFileApi";

// Second Fix APIs
import {
  useGetAllSecondFixFilesQuery,
  useCreateSecondFixFileMutation,
  useDeleteSecondFixFileMutation,
  useShareSecondFixFileMutation,
  useUnShareSecondFixFileMutation,
  useUpdateSecondFixFileMutation,
  useGetSingleSecondFixFileQuery,
} from "../../Redux/features/projects/project/SecondFixedList/SecondFixFileApi";
import SecondFixForm from "../../components/SecondFixform";
import { showDeleteAlert } from "../../utils/deleteAlert";

import CertificateDocumentSceoundFixViewer from "../../components/CertificateDocumentSceoundFixViewer";
import ImageUploader from "../../components/ImageUploader";

interface SubfolderFilesPageProps {
  baseRoute?: "documents" | "second-fixed-list-material" | "handover-tool";
}

interface FileItem {
  id: string;
  name: string;
  size?: string;
  url?: string;
  sharedWith?: any[];
  room?: string;
  surface?: string;
  productCode?: string;
  suplierName?: string;
  text?: string;
}

const SubfolderFilesPage: React.FC<SubfolderFilesPageProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId, subFolderId } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const folder =
    (location.state as { name: string; id?: string; from?: string } | null) ||
    null;

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [unshareModalOpen, setUnshareModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [uploaderOpen, setUploaderOpen] = useState(false);

  const baseRoute = location.pathname.split("/")[3];

  // ===== Single file queries for accurate sharing data =====
  const { data: singleDocData } = useGetSingleDocumentFileQuery(
    selectedFileId!,
    {
      skip: !selectedFileId || baseRoute !== "documents",
    }
  );

  const { data: singleSecondFixData } = useGetSingleSecondFixFileQuery(
    selectedFileId!,
    {
      skip: !selectedFileId || baseRoute !== "second-fixed-list-material",
    }
  );

  // ===== Documents hooks =====
  const {
    data: docData,
    isLoading: docLoading,
    refetch: refetchDoc,
  } = useGetAllDocumentFilesQuery(
    { projectId, documentSubFolderId: subFolderId },
    { skip: baseRoute !== "documents" }
  );

  const [createDocFile, { isLoading: creatingDoc }] =
    useCreateDocumentFileMutation();
  const [deleteDocFile] = useDeleteDocumentFileMutation();
  const [shareDocFile] = useShareDocumentFileMutation();
  const [unShareDocFile] = useUnShareDocumentFileMutation();

  // ===== Second Fix hooks =====
  const {
    data: secondFixData,
    isLoading: secondFixLoading,
    refetch: refetchSecondFix,
  } = useGetAllSecondFixFilesQuery(
    { projectId, secondFixSubFolder: subFolderId },
    { skip: baseRoute !== "second-fixed-list-material" }
  );

  const [createSecondFixFile, { isLoading: creatingSecondFix }] =
    useCreateSecondFixFileMutation();
  const [deleteSecondFixFile] = useDeleteSecondFixFileMutation();
  const [shareSecondFixFile] = useShareSecondFixFileMutation();
  const [unShareSecondFixFile] = useUnShareSecondFixFileMutation();
  const [updateSecondFixFile, { isLoading: updatingSecondFix }] =
    useUpdateSecondFixFileMutation();

  // ===== Generic mapping for current route =====
  let data: any, isLoading: boolean, refetch: () => void;
  let createFile: any, deleteFile: any, shareFile: any, unShareFile: any;
  let subFolderKey: string;

  switch (baseRoute) {
    case "documents":
      data = docData;
      isLoading = docLoading;
      refetch = refetchDoc;
      createFile = createDocFile;
      deleteFile = deleteDocFile;
      shareFile = shareDocFile;
      unShareFile = unShareDocFile;
      subFolderKey = "documentSubFolderId";
      break;

    case "second-fixed-list-material":
      data = secondFixData;
      isLoading = secondFixLoading;
      refetch = refetchSecondFix;
      createFile = createSecondFixFile;
      deleteFile = deleteSecondFixFile;
      shareFile = shareSecondFixFile;
      unShareFile = unShareSecondFixFile;
      subFolderKey = "secondFixSubFolder";
      break;

    default:
      return (
        <div className="p-6">
          <p className="text-red-600">Invalid page route.</p>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 underline mt-2"
          >
            Go Back
          </button>
        </div>
      );
  }

  const files: FileItem[] =
    data?.data?.map((file: any) => ({
      id: file._id,
      name: file.title || file.originalName,
      size: file.size,
      url: file.url,
      sharedWith: file.sharedWith || [],
      room: file.room,
      surface: file.surface,
      productCode: file.productCode,
      suplierName: file.suplierName,
      text: file.text,
    })) || [];

  const handleDocumentFilesSelected = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || !subFolderId || !projectId) return;

    try {
      for (const file of uploadedFiles) {
        await createFile({
          file,
          title: file.name,
          projectId,
          [subFolderKey]: subFolderId,
        }).unwrap();
      }
      successAlert("Files uploaded successfully");
      refetch();
    } catch (err) {
      console.error("Failed to upload file:", err);
      errorAlert("Failed to upload files");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileAction = async (action: string, file: FileItem) => {
    switch (action) {
      case "view":
        setSelectedFileId(file.id);
        setViewModalOpen(true);
        break;

      case "share":
        setSelectedFile(file);
        setShareModalOpen(true);
        break;

      case "unshare":
        setSelectedFileId(file.id);
        setUnshareModalOpen(true);
        break;

      case "edit":
        if (baseRoute === "second-fixed-list-material") {
          setEditingFile(file);
          setDrawerOpen(true);
        }
        break;

      case "delete":
        showDeleteAlert({
          title: "Are you sure?",
          text: `Delete ${file.name}? This action cannot be undone.`,
          onConfirm: async () => {
            try {
              await deleteFile(file.id).unwrap();
              // successAlert("File deleted successfully");
              refetch();
            } catch (error: any) {
              console.log(error);
              errorAlert("Failed to delete file");
            }
          },
        });
        break;

      default:
        break;
    }
  };

  const handleConfirmShare = async (selectedUsers: any[]) => {
    if (!selectedFile) return;
    try {
      await shareFile({
        id: selectedFile.id,
        sharedWith: selectedUsers,
      }).unwrap();
      successAlert("File shared successfully");
      setShareModalOpen(false);
      setSelectedFile(null);
      refetch();
    } catch {
      message.error("Failed to share file");
    }
  };

  const handleConfirmUnshare = async (selectedUsers: any[]) => {
    if (!selectedFileId) return;
    try {
      await unShareFile({
        id: selectedFileId,
        unShareWith: selectedUsers.map((u) => u.userId),
      }).unwrap();
      successAlert("File access removed successfully");
      setUnshareModalOpen(false);
      setSelectedFileId(null);
      refetch();
    } catch {
      message.error("Failed to remove access");
    }
  };

  const handleSecondFixSubmit = async (formData: any) => {
    if (!subFolderId || !projectId) return;

    try {
      const payload: any = {
        title: formData.title,
        room: formData.room,
        surface: formData.surface,
        productCode: formData.productCode,
        suplierName: formData.suplierName,
        text: formData.text,
        file: formData.file ?? undefined,
        projectId,
        [subFolderKey]: subFolderId,
      };

      if (editingFile) {
        await updateSecondFixFile({
          id: editingFile.id,
          data: payload,
        }).unwrap();
        successAlert("Second Fix File updated successfully");
      } else {
        await createSecondFixFile(payload).unwrap();
        successAlert("Second Fix File created successfully");
      }

      setDrawerOpen(false);
      setEditingFile(null);
      refetch();
    } catch (err) {
      console.error(err);
      errorAlert(
        `Failed to ${editingFile ? "update" : "create"} Second Fix File`
      );
    }
  };

  const handleImageUploaderSuccess = async (fileList: any[]) => {
    if (!projectId || !subFolderId) return;

    try {
      for (const file of fileList) {
        await createFile({
          file: file.originFileObj,
          title: file.name,
          projectId,
          [subFolderKey]: subFolderId,
        }).unwrap();
      }
      successAlert("Files uploaded successfully");
      refetch();
      setUploaderOpen(false);
    } catch (err) {
      console.error("Upload failed:", err);
      errorAlert("Failed to upload files");
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

  const uploadTitle =
    baseRoute === "second-fixed-list-material" ? "Create File" : "Upload Files";

  console.log(singleDocData, "singleDocData");
  return (
    <div className="w-full px-4 gap-4 bg-white min-h-screen pt-3">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 mt-10">
        <div className="flex items-center gap-1 pt-10 mb-3">
          <ChevronLeft
            onClick={() => navigate(-1)}
            className="w-10 h-10 cursor-pointer -translate-y-[4px]"
          />
          <h1 className="text-2xl font-semibold">{folder.name}</h1>
        </div>

        {baseRoute === "second-fixed-list-material" ? (
          <CustomCreateButton
            title={uploadTitle}
            onClick={() => {
              setEditingFile(null);
              setDrawerOpen(true);
            }}
          />
        ) : (
          <CustomCreateButton
            title={uploadTitle}
            onClick={() => setUploaderOpen(true)}
          />
        )}
      </div>

      {/* Hidden file input for direct document uploads */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleDocumentFilesSelected}
        className="hidden"
      />

      {/* File list */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : files.length > 0 ? (
        <Row gutter={[16, 16]} className="mt-10">
          {files.map((file: FileItem) => (
            <Col span={6} key={file.id}>
              <Card
                title={
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    📄 {file.name}
                  </h3>
                }
                hoverable
                style={{ backgroundColor: "#f1f1f1", cursor: "pointer" }}
                bodyStyle={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  height: "60px", // fixed height for file cards
                  padding: "12px 16px",
                }}
                extra={
                  <CustomViewMoreButton
                    items={[
                      { key: "view", label: "👁️ View File" },
                      ...(baseRoute === "second-fixed-list-material"
                        ? [{ key: "edit", label: "✏️ Edit File" }]
                        : []),
                      { key: "share", label: "🔗 Share File" },
                      {
                        key: "unshare",
                        label: (
                          <div className="flex items-center gap-1">
                            <Unlink className="text-green-500" size={14} />
                            Unshare File
                          </div>
                        ),
                      },
                      {
                        key: "delete",
                        label: "🗑️ Delete File",
                        danger: true,
                      },
                    ]}
                    onClick={(key: string) => handleFileAction(key, file)}
                  />
                }
                onClick={() => handleFileAction("view", file)}
              ></Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="flex justify-center items-center h-60 mt-20">
          <p>No files have been uploaded yet.</p>
        </div>
      )}

      {/* Upload Modal for Documents */}
      <Modal
        title="Upload Documents"
        open={uploaderOpen}
        onCancel={() => setUploaderOpen(false)}
        footer={null}
        width={500}
        destroyOnClose
      >
        <ImageUploader
          uploading={creatingDoc}
          onUploadSuccess={handleImageUploaderSuccess}
        />
      </Modal>

      {/* View modal */}
      <Modal
        title={selectedFile?.name || "File Viewer"}
        open={viewModalOpen}
        onCancel={() => {
          setViewModalOpen(false);
          setSelectedFileId(null);
        }}
        footer={null}
        width={900}
        destroyOnClose
      >
        <CertificateDocumentSceoundFixViewer
          propfileUrl={singleDocData?.file || singleSecondFixData?.file}
        />
      </Modal>

      {/* Share modal */}
      <Modal
        title="Share File"
        open={shareModalOpen}
        onCancel={() => {
          setShareModalOpen(false);
          setSelectedFile(null);
        }}
        footer={null}
        width={500}
        destroyOnClose
      >
        <CustomShareSelector
          title={`Share "${selectedFile?.name || ""}"`}
          roles={["prime-admin", "basic-admin", "client"]}
          onShare={handleConfirmShare}
        />
      </Modal>

      {/* Unshare modal */}
      <Modal
        title="Remove Access"
        open={unshareModalOpen}
        onCancel={() => {
          setUnshareModalOpen(false);
          setSelectedFileId(null);
        }}
        footer={null}
        width={500}
        destroyOnClose
      >
        <CustomUnshareSelector
          title="Remove access"
          sharedUsers={
            (baseRoute === "documents"
              ? singleDocData?.sharedWith
              : singleSecondFixData?.sharedWith
            )?.map((u: any) => ({
              userId: u.userId?._id || u.userId,
              name: u.userId?.name || "Unknown User",
              role: u.userId?.role || "Unknown Role",
              email: u.userId?.email || "",
              profileImg: u.userId?.profileImg,
            })) || []
          }
          onUnshare={handleConfirmUnshare}
        />
      </Modal>

      {/* Second Fix Drawer + Form */}
      <Drawer
        title={editingFile ? "Update File" : "Create File"}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditingFile(null);
        }}
        width={600}
        destroyOnClose
      >
        <SecondFixForm
          mode={editingFile ? "edit" : "create"}
          onSubmit={handleSecondFixSubmit}
          onCancel={() => setDrawerOpen(false)}
          creating={creatingSecondFix || updatingSecondFix}
          defaultValues={
            editingFile
              ? {
                  title: editingFile.name,
                  room: editingFile.room || "",
                  surface: editingFile.surface || "",
                  productCode: editingFile.productCode || "",
                  suplierName: editingFile.suplierName || "",
                  text: editingFile.text || "",
                  file: null,
                }
              : {
                  title: "",
                  room: "",
                  surface: "",
                  productCode: "",
                  suplierName: "",
                  text: "",
                  file: null,
                }
          }
        />
      </Drawer>
    </div>
  );
};

export default SubfolderFilesPage;
