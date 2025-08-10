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

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomCreateButton from "../../../components/CustomCreateButton";
import CustomSearchInput from "../../../components/CustomSearchInput";
import ResuableDocumentForm from "../../../components/ResuableDocumentForm";
import CustomViewMoreButton from "../../../components/CustomViewMoreButton";

import {
  useGetAllInterimsQuery,
  useCreateInterimMutation,
  useUpdateInterimMutation,
  useDeleteInterimMutation,
  useShareInterimMutation,
} from "../../../Redux/features/projects/project/interim/interimApi";
import { errorAlert, successAlert } from "../../../utils/alerts";
import { showDeleteAlert } from "../../../utils/deleteAlert";

interface DocumentType {
  _id: string;
  title: string;
  projectId: string;
  value: string;
  status: "pending" | "paid";
  file?: any;
}

const InterimEvaluationPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  // API hooks
  const { data: documentsFromApi = [], refetch } = useGetAllInterimsQuery(
    projectId ? { projectId } : undefined
  );
  const [createInterim] = useCreateInterimMutation();
  const [updateInterim] = useUpdateInterimMutation();
  const [deleteInterim] = useDeleteInterimMutation();
  const [shareInterim] = useShareInterimMutation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editDoc, setEditDoc] = useState<DocumentType | null>(null);

  // Local documents state to show updated list immediately
  const [documents, setDocuments] = useState<DocumentType[]>([]);

  // Sync local state with API data when fetched or refetched
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
          successAlert("Interim deleted successfully.");
          refetch();
        } catch (error) {
          errorAlert("Failed to delete interim.");
        }
      },
    });
  };

  const handleShare = async (doc: DocumentType) => {
    try {
      // Example: share with dummy users, adjust as per your real sharedWith data
      await shareInterim({
        id: doc._id,
        sharedWith: ["user1", "user2"],
      }).unwrap();
      successAlert(`Shared "${doc.title}" successfully.`);
      refetch();
    } catch {
      errorAlert("Failed to share interim.");
    }
  };

  const handleViewMoreAction = (key: string, doc: DocumentType) => {
    console.log(doc);
    if (key === "view document") {
      navigate(`/projects/${projectId}/interim-documents`, {
        state: {
          interimTitle: doc.title,
          documents: [
            {
              id: 1,
              title: "Interim Report",
              amount: Number(doc.value),
              fileUrl:
                "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            },
          ],
        },
      });
    } else if (key === "edit") {
      handleEdit(doc);
    } else if (key === "delete") {
      console.log(doc._id);
      handleDelete(doc._id);
    } else if (key === "share") {
      handleShare(doc);
    }
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
      refetch();
    } catch (error) {
      errorAlert("Failed to save interim.");
    }
  };

  return (
    <div className="w-full bg-white h-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Manage Interim</h1>
        <CustomSearchInput onSearch={() => {}} />
      </div>

      <div className="flex justify-end mr-4 mb-6">
        <CustomCreateButton title="Create New Interim" onClick={handleCreate} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div
            key={doc._id}
            className="relative p-4 bg-[#F1F1F1] border rounded shadow transition group cursor-pointer"
          >
            <div
              className="absolute top-2 right-2 opacity-100 z-10"
              onClick={(e) => e.stopPropagation()} // Prevent card click
            >
              <CustomViewMoreButton
                items={[
                  { key: "view document", label: "View Document" },
                  { key: "edit", label: "Edit" },
                  { key: "delete", label: "Delete" },
                  { key: "share", label: "Share" },
                ]}
                onClick={(key) => handleViewMoreAction(key, doc)}
              />
            </div>

            <h3 className="text-lg font-semibold text-gray-800 truncate mt-2">
              📁 {doc.title}
            </h3>
            <p className="text-sm text-gray-600">Value: ${doc.value}</p>

            {/* Show status only here — no editing on card */}
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`text-sm font-semibold ${
                  doc.status === "pending"
                    ? "text-yellow-700"
                    : "text-green-700"
                }`}
              >
                {doc.status === "pending" ? "⏳ Pending" : "✅ Paid"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <ResuableDocumentForm
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
                status: editDoc.status, // pass status to edit form
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
    </div>
  );
};

export default InterimEvaluationPage;
