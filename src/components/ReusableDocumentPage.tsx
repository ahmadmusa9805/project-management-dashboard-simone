import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Modal } from "antd";
import { setCurrentFile } from "../Redux/features/projects/project/shared/documentSlice";
import ReusableDocumentViewer from "./ReusableDocumentViewer";
import { ChevronLeft, FileText } from "lucide-react";
import { errorAlert } from "../utils/alerts";

interface DocumentItem {
  id: number;
  title: string;
  iconColor?: string;
  amount?: number;
  fileUrl?: string;
}

interface LocationState {
  quoteTitle: string;
  documents: DocumentItem[];
}

const ReusableDocumentPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation() as { state: LocationState };
  const { quoteTitle, documents } = state || {};
  const [modalOpen, setModalOpen] = useState(false);

  const handleDocumentClick = (fileUrl?: string) => {
    if (fileUrl) {
      dispatch(setCurrentFile(fileUrl));
      setModalOpen(true);
    } else {
      errorAlert("No File Found", "Please select a document first.");
    }
  };

  console.log("Documents:", documents);
  // if (!documents) {
  //   return (
  //     <div className="p-4">
  //       <h2 className="text-xl font-semibold mb-4">No documents found.</h2>
  //       <button
  //         className="text-blue-600 underline"
  //         onClick={() => navigate(-1)}
  //       >
  //         ← Back
  //       </button>
  //     </div>
  //   );
  // }

  return (
    <div className="w-full px-4 gap-4 bg-white min-h-screen pt-3">
      <div className="flex items-center gap-1 pt-10 mb-3">
        <ChevronLeft
          onClick={() => navigate(-1)}
          className="w-10 h-10 cursor-pointer -translate-y-[4px]" // Adjust -translate-y value as needed
        />
        <h1 className="text-2xl font-bold leading-tight ">
          Documents for {quoteTitle}
          {/* {quoteTitle} */}
        </h1>
      </div>

      {documents.map((doc) => (
        <div key={doc.id} className="flex flex-col gap-4 my-3">
          {doc.fileUrl && (
            <div
              className="w-full p-4 bg-[#f1f1f1] hover:bg-[#e6f4ea] cursor-pointer rounded flex items-center gap-4 transition-colors"
              onClick={() => handleDocumentClick(doc.fileUrl)}
            >
              {/* File Icon */}
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded shadow">
                <FileText size={20} className="text-red-500" />
              </div>

              {/* Title */}
              <div className="flex-1 flex flex-col items-start">
                <p className="text-[#2B3738] text-lg font-medium font-ibm-plex leading-6 tracking-wide truncate">
                  {doc.title}
                </p>
              </div>
            </div>
          )}

          <div className="w-full p-4 bg-[#F1F1F1] border border-[#E6E7E7] rounded flex justify-between items-center">
            <p className="text-[#2B3738] text-lg font-medium font-ibm-plex leading-6 tracking-wide">
              Value
            </p>
            <span className="text-[#2B3738] text-lg font-medium font-ibm-plex leading-6 tracking-wide">
              $ {doc.amount ?? "N/A"}
            </span>
          </div>
        </div>
      ))}

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width="80vw"
        height={"90vh"}
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
        styles={{
          content: {
            borderRadius: "12px",
            border: "none",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          },
        }}
        destroyOnClose
        centered
      >
        <ReusableDocumentViewer quoteTitle={quoteTitle} />
      </Modal>
    </div>
  );
};

export default ReusableDocumentPage;
