import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Modal } from "antd";
import { setCurrentFile } from "../Redux/features/projects/project/shared/documentSlice";
import ReusableDocumentViewer from "./ReusableDocumentViewer";

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
    }
  };

  if (!documents) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">No documents found.</h2>
        <button
          className="text-blue-600 underline"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold mb-2">Documents for {quoteTitle}</h1>

      {documents.map((doc) => (
        <div key={doc.id} className="flex flex-col gap-4">
          <div
            className="w-full p-4 bg-[#F1F1F1] border border-[#E6E7E7] rounded flex items-center gap-4 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => handleDocumentClick(doc.fileUrl)}
          >
            {/* Icon */}
            <div className="w-10 h-10 relative overflow-hidden">
              <div className="absolute w-[31.5px] h-[37.65px] left-[4.25px] top-[1.17px] bg-white" />
              <div className="absolute w-[7.09px] h-[7.08px] left-[4.25px] top-[1.17px] bg-[#D2DBEA]" />
              <div className="absolute w-[35.29px] h-[11.72px] left-[2.35px] top-[21.29px] bg-[#F14F4A]" />
              <div className="absolute w-[21.80px] h-[5.41px] left-[9.10px] top-[12.47px] bg-[#D2DBEA]" />
              <div className="absolute w-[4.46px] h-[5.81px] left-[12.41px] top-[24.24px] bg-white" />
              <div className="absolute w-[10.65px] h-[6.10px] left-[12.26px] top-[24.10px] bg-white" />
              <div className="absolute w-[10.30px] h-[6.06px] left-[17.82px] top-[24.10px] bg-white" />
              <div className="absolute w-[4.24px] h-[6.10px] left-[24.02px] top-[24.10px] bg-white" />
            </div>

            {/* Title */}
            <div className="flex-1 flex flex-col items-start">
              <p className="text-[#2B3738] text-lg font-medium font-ibm-plex leading-6 tracking-wide">
                {doc.title}
              </p>
            </div>
          </div>

          <div className="w-full p-4 bg-[#F1F1F1] border border-[#E6E7E7] rounded flex justify-between items-center">
            <p className="text-[#2B3738] text-lg font-medium font-ibm-plex leading-6 tracking-wide">
              Value
            </p>
            <span className="text-[#2B3738] text-lg font-medium font-ibm-plex leading-6 tracking-wide">
              {doc.amount ?? "N/A"}
            </span>
          </div>
        </div>
      ))}

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width="50vw"
        height={"80vh"}
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
