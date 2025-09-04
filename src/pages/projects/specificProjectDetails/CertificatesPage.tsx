/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

// import React, { useState } from "react";
// import { Drawer, Spin, message } from "antd";
// import CertificateCard from "../../../components/CertificateCard";
// import CustomCreateButton from "../../../components/CustomCreateButton";
// import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
// import ImageUploader from "../../../components/ImageUploader";
// import type { UploadFile } from "antd/es/upload/interface";
// import { useParams } from "react-router-dom";

// import {
//   useGetAllCertificatesQuery,
//   useCreateCertificateMutation,
//   useDeleteCertificateMutation,
//   useUpdateCertificateMutation,
//   useShareCertificateMutation,
//   useUnShareCertificateMutation,
// } from "../../../Redux/features/projects/project/certificate/certificateApi";

// const CertificatesPage: React.FC = () => {
//   const projectId = useParams().projectId;

//   const { data, isLoading } = useGetAllCertificatesQuery({ projectId });

//   const [createCertificate] = useCreateCertificateMutation();
//   const [deleteCertificate] = useDeleteCertificateMutation();
//   const [updateCertificate] = useUpdateCertificateMutation();
//   const [shareCertificate] = useShareCertificateMutation();
//   const [unShareCertificate] = useUnShareCertificateMutation();

//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editingCert, setEditingCert] = useState<any>(null);

//   // ✅ Handle upload success (both create & update)
//   const handleUploadSuccess = async (fileList: UploadFile[]) => {
//     try {
//       for (const file of fileList) {
//         if (editingCert) {
//           // ✅ Update existing certificate
//           await updateCertificate({
//             id: editingCert._id,
//             data: {
//               file: file.originFileObj,
//               title: file.name,
//               projectId,
//             },
//           });
//           message.success(`Certificate "${file.name}" updated successfully`);
//         } else {
//           // ✅ Create new certificate
//           await createCertificate({
//             file: file.originFileObj,
//             title: file.name,
//             projectId,
//           });
//           message.success(`Certificate "${file.name}" uploaded successfully`);
//         }
//       }
//       setDrawerOpen(false);
//       setEditingCert(null);
//     } catch (error) {
//       message.error("Failed to upload certificate(s)");
//     }
//   };

//   // ✅ Delete certificate
//   const handleDeleteCertificate = async (id: string) => {
//     try {
//       await deleteCertificate(id);
//       message.success("Certificate deleted");
//     } catch (error) {
//       message.error("Failed to delete certificate");
//     }
//   };

//   // ✅ Share certificate
//   const handleShareCertificate = async (cert: any) => {
//     const sharedWith =
//       prompt("Enter comma-separated user IDs to share with:")?.split(",") || [];
//     if (!sharedWith.length) return;
//     try {
//       await shareCertificate({ id: cert.id, sharedWith });
//       message.success("Certificate shared successfully");
//     } catch (error) {
//       message.error("Failed to share certificate");
//     }
//   };

//   // ✅ Unshare certificate
//   const handleUnShareCertificate = async (cert: any) => {
//     const unShareWith =
//       prompt("Enter comma-separated user IDs to unshare:")?.split(",") || [];
//     if (!unShareWith.length) return;
//     try {
//       await unShareCertificate({ id: cert.id, unShareWith });
//       message.success("Certificate unshared successfully");
//     } catch (error) {
//       message.error("Failed to unshare certificate");
//     }
//   };

//   return (
//     <>
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-semibold">Certificates</h1>
//         <CustomCreateButton
//           title="Add Certificate"
//           onClick={() => {
//             setEditingCert(null);
//             setDrawerOpen(true);
//           }}
//         />
//       </div>

//       {/* Loading spinner */}
//       {isLoading ? (
//         <div className="flex justify-center items-center h-40">
//           <Spin size="large" />
//         </div>
//       ) : (
//         <div className="w-full p-5 flex flex-wrap gap-4 items-start justify-start">
//           {data?.data?.map((cert: any) => (
//             <div key={cert.id} className="relative">
//               <CertificateCard title={cert.title} size={``} />
//               <div className="absolute top-2 right-2">
//                 <CustomViewMoreButton
//                   items={[
//                     { key: "edit", label: "✏️ Edit" },
//                     { key: "share", label: "🔗 Share" },
//                     { key: "unshare", label: "🚫 Unshare" },
//                     { key: "delete", label: "🗑️ Delete", danger: true },
//                   ]}
//                   onClick={(key) => {
//                     if (key === "edit") {
//                       setEditingCert(cert);
//                       setDrawerOpen(true); // open Drawer with existing cert
//                     }
//                     if (key === "delete") handleDeleteCertificate(cert._id);
//                     if (key === "share") handleShareCertificate(cert._id);
//                     if (key === "unshare") handleUnShareCertificate(cert._id);
//                   }}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Drawer for Image Uploader (Create & Update) */}
//       <Drawer
//         title={editingCert ? "Update Certificate" : "Add New Certificate"}
//         placement="right"
//         onClose={() => {
//           setDrawerOpen(false);
//           setEditingCert(null);
//         }}
//         open={drawerOpen}
//         width={400}
//       >
//         <ImageUploader onUploadSuccess={handleUploadSuccess} />
//       </Drawer>
//     </>
//   );
// };

// export default CertificatesPage;

//TODO: Refactor and clean up the above code if needed

import type React from "react";
import { useState } from "react";
import { Modal, Spin, message } from "antd";
import { useParams } from "react-router-dom";
import CertificateCard from "../../../components/CertificateCard";
import CustomCreateButton from "../../../components/CustomCreateButton";
import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
import ImageUploader from "../../../components/ImageUploader";
import type { UploadFile } from "antd/es/upload/interface";

import {
  useGetAllCertificatesQuery,
  useCreateCertificateMutation,
  useDeleteCertificateMutation,
  useUpdateCertificateMutation,
  useShareCertificateMutation,
  useUnShareCertificateMutation,
  useGetSingleCertificateQuery,
} from "../../../Redux/features/projects/project/certificate/certificateApi";

import type { SharedUser } from "../../../Redux/features/projects/projectsApi";
import CustomShareSelector from "../../../components/CustomShareSelector";
import CustomUnshareSelector from "../../../components/CustomUnshareSelector";
import { errorAlert, successAlert } from "../../../utils/alerts";
import { showDeleteAlert } from "../../../utils/deleteAlert";
import { Unlink } from "lucide-react";

import CertificateDocumentSceoundFixViewer from "../../../components/CertificateDocumentSceoundFixViewer";
// ✅ new reusable unshare component

const CertificatesPage: React.FC = () => {
  const projectId = useParams().projectId;
  const { data: certificatesData, isLoading: certificatesLoading } =
    useGetAllCertificatesQuery({ projectId });
  const [selectedCertId, setSelectedCertId] = useState<string | null>(null);
  const { data: singleCertData } = useGetSingleCertificateQuery(
    selectedCertId!,
    {
      skip: !selectedCertId, // ✅ don’t run if null
    }
  );

  const [createCertificate, { isLoading: createLoading }] =
    useCreateCertificateMutation();
  const [deleteCertificate] = useDeleteCertificateMutation();
  const [updateCertificate, { isLoading: updateLoading }] =
    useUpdateCertificateMutation();
  const [shareCertificate] = useShareCertificateMutation();
  const [unShareCertificate] = useUnShareCertificateMutation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<any>(null);

  // Share modal state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareCert, setShareCert] = useState<any>(null);
  const [selectedCert, setSelectedCert] = useState<{ file?: string }>({});
  const [openViewModel, setOpenViewModel] = useState(false);

  // Unshare modal state
  const [unshareModalOpen, setUnshareModalOpen] = useState(false);

  // ✅ Handle upload success (both create & update)
  const handleUploadSuccess = async (fileList: UploadFile[]) => {
    try {
      for (const file of fileList) {
        if (editingCert) {
          await updateCertificate({
            id: editingCert._id,
            data: {
              file: file.originFileObj,
              title: file.name,
              projectId,
            },
          });
          successAlert(`Certificate "${file.name}" updated successfully`);
        } else {
          await createCertificate({
            file: file.originFileObj,
            title: file.name,
            projectId,
          });
          successAlert(`Certificate "${file.name}" uploaded successfully`);
        }
      }
      setDrawerOpen(false);
      setEditingCert(null);
    } catch (error) {
      message.error("Failed to upload certificate(s)");
    }
  };

  // ✅ Delete certificate
  const handleDeleteCertificate = async (cert: any) => {
    showDeleteAlert({
      title: "Are you sure?",
      text: `Delete certificate "${cert.title}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await deleteCertificate(cert._id);
          // successAlert("Certificate deleted successfully!");
        } catch (error) {
          errorAlert("Failed to delete certificate");
        }
      },
    });
    // await deleteCertificate(id);
    // message.success("Certificate deleted");
  };

  // ✅ Open Share Modal
  const handleShareCertificate = (cert: any) => {
    setShareCert(cert);
    setShareModalOpen(true);
  };

  // ✅ Confirm Share
  const handleConfirmShare = async (selectedUsers: SharedUser[]) => {
    try {
      await shareCertificate({
        id: shareCert._id,
        sharedWith: selectedUsers,
      });
      successAlert("Certificate shared successfully");
      setShareModalOpen(false);
      setShareCert(null);
    } catch (error) {
      errorAlert("Failed to share certificate");
    }
  };

  // ✅ Open Unshare Modal
  const handleUnShareCertificate = (id: any) => {
    setSelectedCertId(id);

    setUnshareModalOpen(true);
  };

  const handleView = (certificate: any) => {
    setSelectedCert(certificate);
    setOpenViewModel(true);
    console.log(certificate);
  };
  // ✅ Confirm Unshare
  const handleConfirmUnshare = async (selectedUsers: SharedUser[]) => {
    const data = selectedUsers.map((u) => u.userId);
    console.log(data);
    try {
      await unShareCertificate({
        id: selectedCertId!,
        unShareWith: selectedUsers.map((u) => u.userId), // ✅ now this will be string IDs
      });
      successAlert("Certificate unshared successfully");
      setUnshareModalOpen(false);
    } catch (error) {
      errorAlert("Failed to unshare certificate");
    }
  };

  return (
    <>
      <div className="w-full px-4 gap-4 bg-white min-h-screen pt-3">
        {" "}
        <div className="flex justify-between items-center mb-4 mt-10">
          <h1 className="text-2xl font-semibold">Certificates</h1>
          <CustomCreateButton
            title="Add Certificate"
            onClick={() => {
              setEditingCert(null);
              setDrawerOpen(true);
            }}
          />
        </div>
        {/* Loading spinner */}
        {certificatesLoading ? (
          <div className="flex justify-center items-center h-40">
            <Spin size="large" />
          </div>
        ) : (
          <div className="w-full p-5 flex flex-wrap gap-4 items-start justify-start">
            {certificatesData?.data?.map((cert: any) => (
              <div className="">
                <div
                  key={cert._id}
                  className="relative hover:bg-[#e6f4ea] bg-[#f1f1f1] cursor-pointer"
                  onClick={() => handleView(cert)}
                >
                  <CertificateCard title={cert.title} size={``} />
                  <div className="absolute top-2 right-2">
                    <CustomViewMoreButton
                      items={[
                        { key: "view", label: "👁️ View Certificate" },
                        { key: "edit", label: "✏️ Edit Certificate" },
                        { key: "share", label: "🔗 Share Certificate" },
                        {
                          key: "unshare",
                          label: (
                            <div className="flex items-center gap-1">
                              <Unlink className="text-green-500" size={14} />
                              Unshare Certificate
                            </div>
                          ),
                        },
                        {
                          key: "delete",
                          label: "🗑️ Delete Certificate",
                          danger: true,
                        },
                      ]}
                      onClick={(key) => {
                        if (key === "edit") {
                          setEditingCert(cert);
                          setDrawerOpen(true);
                        }
                        if (key === "delete") handleDeleteCertificate(cert);
                        if (key === "share") handleShareCertificate(cert);
                        if (key === "unshare")
                          handleUnShareCertificate(cert._id);
                        if (key === "view") handleView(cert);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Drawer for Image Uploader */}
        <Modal
          title={editingCert ? "Update Certificate" : "Add New Certificate"}
          open={drawerOpen}
          onCancel={() => {
            setDrawerOpen(false);
            setEditingCert(null);
          }}
          footer={null}
          width={500}
        >
          <ImageUploader
            uploading={createLoading || updateLoading}
            onUploadSuccess={handleUploadSuccess}
          />
        </Modal>
        <Modal
          title={""}
          open={openViewModel}
          onCancel={() => {
            setOpenViewModel(false);
          }}
          footer={null}
          width={900}
        >
          <CertificateDocumentSceoundFixViewer
            propfileUrl={selectedCert?.file as string}
          ></CertificateDocumentSceoundFixViewer>
        </Modal>
        {/* Modal for Sharing */}
        <Modal
          title="Share Certificate"
          open={shareModalOpen}
          onCancel={() => {
            setShareModalOpen(false);
            setShareCert(null);
          }}
          footer={null}
          width={500}
        >
          <CustomShareSelector
            title="Share this certificate"
            roles={["prime-admin", "basic-admin", "client"]}
            onShare={handleConfirmShare}
          />
        </Modal>
        {/* Modal for Unsharing */}
        <Modal
          title="Unshare Certificate"
          open={unshareModalOpen}
          onCancel={() => {
            setUnshareModalOpen(false);
            setSelectedCertId(null);
          }}
          footer={null}
          width={500}
        >
          <CustomUnshareSelector
            title="Remove access from users"
            sharedUsers={(singleCertData?.sharedWith || []).map((u: any) => ({
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
    </>
  );
};

export default CertificatesPage;
