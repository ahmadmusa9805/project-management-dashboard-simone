/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
// import { message, Modal, Select } from "antd";
// import { useNavigate, useParams } from "react-router-dom";
// import CustomCreateButton from "../../../components/CustomCreateButton";
// import CustomSearchInput from "../../../components/CustomSearchInput";
// import ResuableDocumentForm from "../../../components/ResuableDocumentForm";
// import CustomViewMoreButton from "../../../components/CustomViewMoreButton";

// const { Option } = Select;

// interface DocumentType {
//   id: number;
//   folderName: string;
//   reference: string;
//   amount: string;
//   status: "pending" | "paid";
// }

// const InterimEvaluationPage = () => {
//   const navigate = useNavigate();
//   const { projectId } = useParams();

//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [documents, setDocuments] = useState<DocumentType[]>([]);
//   const [mode, setMode] = useState<"create" | "edit">("create");
//   const [editDoc, setEditDoc] = useState<DocumentType | null>(null);

//   const handleCreate = () => {
//     setMode("create");
//     setEditDoc(null);
//     setIsDrawerOpen(true);
//   };

//   const handleEdit = (doc: DocumentType) => {
//     setMode("edit");
//     setEditDoc(doc);
//     setIsDrawerOpen(true);
//   };

//   const handleDelete = (id: number) => {
//     Modal.confirm({
//       title: "Are you sure?",
//       content: "This will permanently delete the folder.",
//       okText: "Yes, delete",
//       okType: "danger",
//       cancelText: "Cancel",
//       onOk: () => {
//         setDocuments((prev) => prev.filter((doc) => doc.id !== id));
//         message.success("Folder deleted successfully.");
//       },
//     });
//   };

//   const handleShare = (doc: DocumentType) => {
//     message.info(`Sharing "${doc.folderName}" (mock functionality)`);
//   };

//   const handleViewMoreAction = (key: string, doc: DocumentType) => {
//     if (key === "view document") {
//       navigate(`/projects/${projectId}/interim-documents`, {
//         state: {
//           quoteTitle: doc.folderName,
//           documents: [
//             {
//               id: 1,
//               title: "Interim Report",
//               amount: parseFloat(doc.amount),
//               fileUrl:
//                 "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
//             },
//             {
//               id: 2,
//               title: "Evaluation Sheet",
//               amount: 1500,
//               fileUrl:
//                 "https://file-examples.com/wp-content/uploads/2017/10/file-example_PDF_1MB.pdf",
//             },
//           ],
//         },
//       });
//     } else if (key === "edit") {
//       handleEdit(doc);
//     } else if (key === "delete") {
//       handleDelete(doc.id);
//     } else if (key === "share") {
//       handleShare(doc);
//     }
//   };

//   const handleSubmit = (data: any) => {
//     if (mode === "create") {
//       const newDoc: DocumentType = {
//         id: Date.now(),
//         ...data,
//         status: "pending",
//       };
//       setDocuments((prev) => [...prev, newDoc]);
//     } else if (editDoc) {
//       const updated = documents.map((d) =>
//         d.id === editDoc.id ? { ...d, ...data } : d
//       );
//       setDocuments(updated);
//     }
//     setIsDrawerOpen(false);
//   };

//   const handleStatusChange = (id: number, value: "pending" | "paid") => {
//     setDocuments((prev) =>
//       prev.map((doc) => (doc.id === id ? { ...doc, status: value } : doc))
//     );
//   };

//   return (
//     <div className="w-full h-full p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-semibold">Manage Interim</h1>
//         <CustomSearchInput onSearch={() => {}} />
//       </div>

//       <div className="flex justify-end mr-4 mb-6">
//         <CustomCreateButton title="Create New Intrim" onClick={handleCreate} />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {documents.map((doc) => (
//           <div className="relative p-4 bg-white border rounded shadow  transition group cursor-pointer">
//             <div
//               className="absolute top-2 right-2 opacity-100 z-10"
//               onClick={(e) => e.stopPropagation()} // Prevent card click
//             >
//               <CustomViewMoreButton
//                 items={[
//                   { key: "view document", label: "View Document" },
//                   { key: "edit", label: "Edit" },
//                   { key: "delete", label: "Delete" },
//                   { key: "share", label: "Share" },
//                 ]}
//                 onClick={(key) => handleViewMoreAction(key, doc)}
//               />
//             </div>

//             <h3 className="text-lg font-semibold text-gray-800 truncate mt-2">
//               📁 {doc.folderName}
//             </h3>
//             <p className="text-sm text-gray-600 mt-1">
//               Reference: {doc.reference}
//             </p>
//             <p className="text-sm text-gray-600">Amount: ${doc.amount}</p>

//             <div className="mt-3 flex items-center gap-2">
//               <Select
//                 value={doc.status}
//                 onChange={(value) =>
//                   handleStatusChange(doc.id, value as "pending" | "paid")
//                 }
//                 className="w-28"
//                 size="small"
//               >
//                 <Option value="pending">
//                   <span className="text-yellow-700">⏳ Pending</span>
//                 </Option>
//                 <Option value="paid">
//                   <span className="text-green-700">✅ Paid</span>
//                 </Option>
//               </Select>
//             </div>
//           </div>
//         ))}
//       </div>

//       <ResuableDocumentForm
//         mode={mode}
//         open={isDrawerOpen}
//         onClose={() => setIsDrawerOpen(false)}
//         onSubmit={handleSubmit}
//         defaultValues={
//           editDoc
//             ? {
//                 folderName: editDoc.folderName,
//                 reference: editDoc.reference,
//                 amount: editDoc.amount,
//               }
//             : {}
//         }
//         fields={[
//           {
//             name: "folderName",
//             label: "Folder Name",
//             placeholder: "Enter folder name",
//           },
//           {
//             name: "reference",
//             label: "Reference",
//             placeholder: "Enter reference code",
//           },
//           {
//             name: "amount",
//             label: "Amount",
//             placeholder: "Enter amount",
//           },
//         ]}
//       />
//     </div>
//   );
// };

// export default InterimEvaluationPage;
// TODO: review and clean up the code above if needed
/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Col, Modal, Row, Spin, Statistic } from "antd";

import CustomCreateButton from "../../../components/CustomCreateButton";
// import CustomSearchInput from "../../../components/CustomSearchInput";
import ResuableDocumentForm from "../../../components/ResuableDocumentForm";
import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
import CustomShareSelector from "../../../components/CustomShareSelector";
import CustomUnshareSelector from "../../../components/CustomUnshareSelector";

import {
  useGetAllInterimsQuery,
  useCreateInterimMutation,
  useUpdateInterimMutation,
  useDeleteInterimMutation,
  useShareInterimMutation,
  useUnShareInterimMutation,
  useGetSingleInterimQuery,
} from "../../../Redux/features/projects/project/interim/interimApi";

import type { SharedUser } from "../../../Redux/features/projects/projectsApi";
import { errorAlert, successAlert } from "../../../utils/alerts";
import { showDeleteAlert } from "../../../utils/deleteAlert";
import { Unlink } from "lucide-react";

interface DocumentType {
  _id: string;
  title: string;
  projectId: string;
  value: number;
  status: "pending" | "paid";
  file?: any;
}

const InterimEvaluationPage: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  // API hooks
  const {
    data: documentsFromApi = [],
    isLoading,
    refetch,
  } = useGetAllInterimsQuery(projectId ? { projectId } : undefined);
  const [createInterim, { isLoading: creating }] = useCreateInterimMutation();
  const [updateInterim, { isLoading: updating }] = useUpdateInterimMutation();
  const [deleteInterim] = useDeleteInterimMutation();
  const [shareInterim] = useShareInterimMutation();
  const [unShareInterim] = useUnShareInterimMutation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editDoc, setEditDoc] = useState<DocumentType | null>(null);

  // Local documents state
  const [documents, setDocuments] = useState<DocumentType[]>([]);

  // Share modal state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareDoc, setShareDoc] = useState<DocumentType | null>(null);

  // Unshare modal state
  const [unshareModalOpen, setUnshareModalOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const { data: singleInterimData } = useGetSingleInterimQuery(selectedDocId!, {
    skip: !selectedDocId,
  });

  console.log(singleInterimData);
  // Sync local state with API
  useEffect(() => {
    if (Array.isArray(documentsFromApi)) {
      setDocuments(documentsFromApi);
    }
  }, [documentsFromApi]);

  const handleCreate = () => {
    setMode("create");
    setEditDoc(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (doc: DocumentType) => {
    setMode("edit");
    setEditDoc(doc);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    showDeleteAlert({
      onConfirm: async () => {
        try {
          await deleteInterim(id).unwrap();
          // successAlert("Quote deleted successfully!");
          refetch();
        } catch (err: any) {
          errorAlert(
            "Delete Error",
            err?.data?.message || "Failed to delete quote"
          );
        }
      },
    });
    // try {
    //   await deleteInterim(id).unwrap();
    //   // successAlert("Interim deleted successfully.");
    // } catch (error) {
    //   errorAlert("Failed to delete interim.");
    // }
  };

  // ✅ Open Share Modal
  const handleShareInterim = (doc: DocumentType) => {
    setShareDoc(doc);
    setShareModalOpen(true);
  };

  // ✅ Confirm Share
  const handleConfirmShare = async (selectedUsers: SharedUser[]) => {
    try {
      await shareInterim({
        id: shareDoc!._id,
        sharedWith: selectedUsers,
      }).unwrap();
      successAlert("Interim shared successfully");
      setShareModalOpen(false);
      setShareDoc(null);
    } catch (error) {
      errorAlert("Failed to share interim");
    }
  };

  // ✅ Open Unshare Modal
  const handleUnshareInterim = (id: string) => {
    setSelectedDocId(id);
    setUnshareModalOpen(true);
  };

  // ✅ Confirm Unshare
  const handleConfirmUnshare = async (selectedUsers: SharedUser[]) => {
    try {
      await unShareInterim({
        id: selectedDocId!,
        unShareWith: selectedUsers.map((u) => u.userId),
      }).unwrap();
      successAlert("Interim unshared successfully");
      setUnshareModalOpen(false);
      setSelectedDocId(null);
    } catch (error) {
      errorAlert("Failed to unshare interim");
    }
  };

  const handleViewMoreAction = (key: string, doc: DocumentType) => {
    if (key === "view Interim") {
      navigate(`/projects/${projectId}/interim-documents`, {
        state: {
          interimTitle: doc.title,
          documents: [
            {
              id: doc._id,
              title: doc.title,
              amount: Number(doc.value),
              fileUrl: doc.file,
            },
          ],
        },
      });
    }
    if (key === "edit") handleEdit(doc);
    if (key === "delete") handleDelete(doc._id);
    if (key === "share") handleShareInterim(doc);
    if (key === "unshare") handleUnshareInterim(doc._id);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (mode === "create") {
        await createInterim(data).unwrap();
        successAlert("Interim created successfully.");
      } else if (editDoc) {
        await updateInterim({ id: editDoc._id, data }).unwrap();
        successAlert("Interim updated successfully.");
      }
      setIsDrawerOpen(false);
    } catch (error) {
      errorAlert("Failed to save interim.");
    }
  };

  return (
    <div className="w-full bg-white h-full p-6 min-h-screen">
      <div className="flex justify-between  py-10">
        <h1 className="text-2xl font-semibold">Interims</h1>
        <CustomCreateButton title="Create Interim" onClick={handleCreate} />
        {/* <CustomSearchInput onSearch={() => {}} /> */}
      </div>

      {/* <div className="flex justify-end mr-4 mb-6">
        <CustomCreateButton title="Create New Interim" onClick={handleCreate} />
      </div> */}

      {/* Loading spinner */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {documents.map((doc) => (
            <Col span={6} key={doc._id}>
              <Card
                style={{ backgroundColor: "#f1f1f1" }}
                hoverable
                bodyStyle={{
                  backgroundColor: "#f1f1f1",
                  padding: "12px 24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
                onClick={() => handleViewMoreAction("view Interim", doc)}
                title={
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {doc.title}
                  </h3>
                }
                extra={
                  <CustomViewMoreButton
                    items={[
                      { key: "view Interim", label: "👁️ View Interim" },
                      { key: "edit", label: "✏️ Edit Interim" },
                      { key: "share", label: "🔗 Share Interim" },
                      {
                        key: "unshare",
                        label: (
                          <div className="flex items-center gap-1">
                            <Unlink className="text-green-500" size={14} />
                            Unshare Interim
                          </div>
                        ),
                      },
                      {
                        key: "delete",
                        label: "🗑️ Delete Interim",
                        danger: true,
                      },
                    ]}
                    onClick={(key) => {
                      handleViewMoreAction(key, doc);
                    }}
                  />
                }
              >
                <div className="flex items-center justify-between w-full">
                  <Statistic value={doc.value} prefix="£" />
                  <p
                    className={`font-semibold flex items-center ${
                      doc.status === "pending"
                        ? "text-yellow-700"
                        : "text-green-700"
                    }`}
                  >
                    {doc.status === "pending" ? "⏳ Pending" : "✅ Paid"}
                  </p>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Drawer Form */}
      <ResuableDocumentForm
        title="Interim"
        creating={creating}
        updating={updating}
        mode={mode}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleSubmit}
        defaultValues={
          editDoc
            ? {
                title: editDoc.title,
                projectId: editDoc.projectId,
                value: editDoc.value,
                status: editDoc.status,
              }
            : { projectId: projectId || "" }
        }
        fields={[
          {
            name: "title",
            label: "Title",
            placeholder: "Enter interim title",
          },
          {
            name: "value",
            label: "Value",
            placeholder: "Enter value",
          },
          {
            name: "status",
            label: "Status",
            placeholder: "Select status",
            type: "select",
            options: [
              { label: "Pending", value: "pending" },
              { label: "Paid", value: "paid" },
            ],
          },
        ]}
      />

      {/* Share Modal */}
      <Modal
        title="Share Interim"
        open={shareModalOpen}
        onCancel={() => {
          setShareModalOpen(false);
          setShareDoc(null);
        }}
        footer={null}
        width={500}
      >
        <CustomShareSelector
          title="Share this interim"
          roles={["primeAdmin", "basicAdmin", "client"]}
          onShare={handleConfirmShare}
        />
      </Modal>

      {/* Unshare Modal */}
      <Modal
        title="Unshare Interim"
        open={unshareModalOpen}
        onCancel={() => {
          setUnshareModalOpen(false);
          setSelectedDocId(null);
        }}
        footer={null}
        width={500}
      >
        <CustomUnshareSelector
          title="Remove access from users"
          sharedUsers={(singleInterimData?.sharedWith || []).map((u: any) => ({
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

export default InterimEvaluationPage;
