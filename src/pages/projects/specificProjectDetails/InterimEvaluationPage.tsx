/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { message, Modal, Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import CustomCreateButton from "../../../components/CustomCreateButton";
import CustomSearchInput from "../../../components/CustomSearchInput";
import ResuableDocumentForm from "../../../components/ResuableDocumentForm";
import CustomViewMoreButton from "../../../components/CustomViewMoreButton";

const { Option } = Select;

interface DocumentType {
  id: number;
  intrerimTitle: string;
  reference: string;
  amount: string;
  status: "pending" | "paid";
}

const InterimEvaluationPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editDoc, setEditDoc] = useState<DocumentType | null>(null);

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

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This will permanently delete the folder.",
      okText: "Yes, delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
        message.success("Folder deleted successfully.");
      },
    });
  };

  const handleShare = (doc: DocumentType) => {
    message.info(`Sharing "${doc.intrerimTitle}" (mock functionality)`);
  };

  const handleViewMoreAction = (key: string, doc: DocumentType) => {
    if (key === "view document") {
      navigate(`/projects/${projectId}/interim-documents`, {
        state: {
          quoteTitle: doc.intrerimTitle,
          documents: [
            {
              id: 1,
              title: "Interim Report",
              amount: parseFloat(doc.amount),
              fileUrl:
                "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            },
            {
              id: 2,
              title: "Evaluation Sheet",
              amount: 1500,
              fileUrl:
                "https://file-examples.com/wp-content/uploads/2017/10/file-example_PDF_1MB.pdf",
            },
          ],
        },
      });
    } else if (key === "edit") {
      handleEdit(doc);
    } else if (key === "delete") {
      handleDelete(doc.id);
    } else if (key === "share") {
      handleShare(doc);
    }
  };

  const handleSubmit = (data: any) => {
    if (mode === "create") {
      const newDoc: DocumentType = {
        id: Date.now(),
        ...data,
        status: "pending",
      };
      setDocuments((prev) => [...prev, newDoc]);
    } else if (editDoc) {
      const updated = documents.map((d) =>
        d.id === editDoc.id ? { ...d, ...data } : d
      );
      setDocuments(updated);
    }
    setIsDrawerOpen(false);
  };

  const handleStatusChange = (id: number, value: "pending" | "paid") => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, status: value } : doc))
    );
  };

  return (
    <div className="w-full h-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Manage Interim</h1>
        <CustomSearchInput onSearch={() => {}} />
      </div>

      <div className="flex justify-end mr-4 mb-6">
        <CustomCreateButton title="Create New Intrim" onClick={handleCreate} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div className="relative p-4 bg-white border rounded shadow  transition group cursor-pointer">
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
              <span className="text-5xl mr-4">📁</span>{doc.intrerimTitle}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Reference: {doc.reference}
            </p>
            <p className="text-sm text-gray-600">Amount: ${doc.amount}</p>

            <div className="mt-3 flex items-center gap-2">
              <Select
                value={doc.status}
                onChange={(value) =>
                  handleStatusChange(doc.id, value as "pending" | "paid")
                }
                className="w-28"
                size="small"
              >
                <Option value="pending">
                  <span className="text-yellow-700">⏳ Pending</span>
                </Option>
                <Option value="paid">
                  <span className="text-green-700">✅ Paid</span>
                </Option>
              </Select>
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
                intrerimTitle: editDoc.intrerimTitle,
                reference: editDoc.reference,
                amount: editDoc.amount,
              }
            : {}
        }
        fields={[
          {
            name: "intrerimTitle",
            label: "Interim Title",
            placeholder: "Enter Interim Title",
          },
          {
            name: "reference",
            label: "Reference",
            placeholder: "Enter reference code",
          },
          {
            name: "amount",
            label: "Amount",
            placeholder: "Enter amount",
          },
        ]}
      />
    </div>
  );
};

export default InterimEvaluationPage;
