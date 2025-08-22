/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState } from "react";
// import { Drawer } from "antd";
// import CertificateCard from "../../../components/CertificateCard";
// import CustomCreateButton from "../../../components/CustomCreateButton";
// import ImageUploader from "../../../components/ImageUploader"; // ✅ reuse uploader
// import type { UploadFile } from "antd/es/upload/interface";

// const CertificatesPage: React.FC = () => {
//   const [certificates, setCertificates] = useState<
//     { id: string; title: string; size: string }[]
//   >([]);

//   const [drawerOpen, setDrawerOpen] = useState(false);

//   const handleUploadSuccess = (fileList: UploadFile[]) => {
//     const newCertificates = fileList.map((file) => ({
//       id: file.uid,
//       title: file.name,
//       size: `${Math.round((file.size ?? 0) / 1024)}KB`, // convert bytes to KB
//     }));

//     setCertificates((prev) => [...prev, ...newCertificates]);
//     setDrawerOpen(false); // ✅ close drawer after upload
//   };

//   const handleAddCertificate = () => {
//     setDrawerOpen(true);
//   };

//   return (
//     <>
//       {/* Header with Add Button */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-semibold">Certificates</h1>
//         <CustomCreateButton
//           title="Add Certificate"
//           onClick={handleAddCertificate}
//         />
//       </div>

//       {/* Certificate Cards */}
//       <div className="w-full p-5 flex flex-wrap gap-4 items-start justify-start">
//         {certificates.map((cert) => (
//           <CertificateCard key={cert.id} title={cert.title} size={cert.size} />
//         ))}
//       </div>

//       {/* Drawer for Image Uploader */}
//       <Drawer
//         title="Add New Certificate"
//         placement="right"
//         onClose={() => setDrawerOpen(false)}
//         open={drawerOpen}
//         width={400}
//       >
//         <ImageUploader onUploadSuccess={handleUploadSuccess} />
//       </Drawer>
//     </>
//   );
// };

// export default CertificatesPage;

import React, { useState } from "react";
import { Drawer, Spin, message } from "antd";
import CertificateCard from "../../../components/CertificateCard";
import CustomCreateButton from "../../../components/CustomCreateButton";
import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
import ImageUploader from "../../../components/ImageUploader";
import type { UploadFile } from "antd/es/upload/interface";
import { useParams } from "react-router-dom";

import {
  useGetAllCertificatesQuery,
  useCreateCertificateMutation,
  useDeleteCertificateMutation,
  useUpdateCertificateMutation,
  useShareCertificateMutation,
  useUnShareCertificateMutation,
} from "../../../Redux/features/projects/project/certificate/certificateApi";

const CertificatesPage: React.FC = () => {
  const projectId = useParams().projectId;

  const { data, isLoading } = useGetAllCertificatesQuery({ projectId });

  const [createCertificate] = useCreateCertificateMutation();
  const [deleteCertificate] = useDeleteCertificateMutation();
  const [updateCertificate] = useUpdateCertificateMutation();
  const [shareCertificate] = useShareCertificateMutation();
  const [unShareCertificate] = useUnShareCertificateMutation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<any>(null);

  // ✅ Handle upload success (both create & update)
  const handleUploadSuccess = async (fileList: UploadFile[]) => {
    try {
      for (const file of fileList) {
        if (editingCert) {
          // ✅ Update existing certificate
          await updateCertificate({
            id: editingCert._id,
            data: {
              file: file.originFileObj,
              title: file.name,
              projectId,
            },
          });
          message.success(`Certificate "${file.name}" updated successfully`);
        } else {
          // ✅ Create new certificate
          await createCertificate({
            file: file.originFileObj,
            title: file.name,
            projectId,
          });
          message.success(`Certificate "${file.name}" uploaded successfully`);
        }
      }
      setDrawerOpen(false);
      setEditingCert(null);
    } catch (error) {
      message.error("Failed to upload certificate(s)");
    }
  };

  // ✅ Delete certificate
  const handleDeleteCertificate = async (id: string) => {
    try {
      await deleteCertificate(id);
      message.success("Certificate deleted");
    } catch (error) {
      message.error("Failed to delete certificate");
    }
  };

  // ✅ Share certificate
  const handleShareCertificate = async (cert: any) => {
    const sharedWith =
      prompt("Enter comma-separated user IDs to share with:")?.split(",") || [];
    if (!sharedWith.length) return;
    try {
      await shareCertificate({ id: cert.id, sharedWith });
      message.success("Certificate shared successfully");
    } catch (error) {
      message.error("Failed to share certificate");
    }
  };

  // ✅ Unshare certificate
  const handleUnShareCertificate = async (cert: any) => {
    const unShareWith =
      prompt("Enter comma-separated user IDs to unshare:")?.split(",") || [];
    if (!unShareWith.length) return;
    try {
      await unShareCertificate({ id: cert.id, unShareWith });
      message.success("Certificate unshared successfully");
    } catch (error) {
      message.error("Failed to unshare certificate");
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
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
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : (
        <div className="w-full p-5 flex flex-wrap gap-4 items-start justify-start">
          {data?.data?.map((cert: any) => (
            <div key={cert.id} className="relative">
              <CertificateCard title={cert.title} size={``} />
              <div className="absolute top-2 right-2">
                <CustomViewMoreButton
                  items={[
                    { key: "edit", label: "✏️ Edit" },
                    { key: "share", label: "🔗 Share" },
                    { key: "unshare", label: "🚫 Unshare" },
                    { key: "delete", label: "🗑️ Delete", danger: true },
                  ]}
                  onClick={(key) => {
                    if (key === "edit") {
                      setEditingCert(cert);
                      setDrawerOpen(true); // open Drawer with existing cert
                    }
                    if (key === "delete") handleDeleteCertificate(cert._id);
                    if (key === "share") handleShareCertificate(cert._id);
                    if (key === "unshare") handleUnShareCertificate(cert._id);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drawer for Image Uploader (Create & Update) */}
      <Drawer
        title={editingCert ? "Update Certificate" : "Add New Certificate"}
        placement="right"
        onClose={() => {
          setDrawerOpen(false);
          setEditingCert(null);
        }}
        open={drawerOpen}
        width={400}
      >
        <ImageUploader onUploadSuccess={handleUploadSuccess} />
      </Drawer>
    </>
  );
};

export default CertificatesPage;
