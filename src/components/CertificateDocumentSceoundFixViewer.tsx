import type React from "react";

import { Download, FileText } from "lucide-react";
import { Button } from "antd";

interface CertificateDocumentSceoundFixViewerProps {
  title?: string;

  propfileUrl?: string;
  // ✅ new prop for background
}

const CertificateDocumentSceoundFixViewer: React.FC<
  CertificateDocumentSceoundFixViewerProps
> = ({
  propfileUrl,
  // ✅ default background
}) => {
  const fileUrl = propfileUrl;

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileUrl.split("/").pop() || "document";
      link.click();
    }
  };

  const isPdf = fileUrl?.toLowerCase().endsWith(".pdf");
  const isImage = fileUrl?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);

  return (
    <>
      <style>{`
        @media print {
          .print-hide { display: none !important; }
          .print-content {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 9999 !important;
            background: white !important;
          }
        }
      `}</style>

      {/* ✅ use bgColor here */}
      <div className={` min-h-[600px]`}>
        <div className="flex justify-center items-center min-h-[600px] print-content">
          {!fileUrl ? (
            <div className="text-center py-12 print-hide">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 " />
              </div>
              <p className="text-gray-500 text-lg mb-2">No file selected</p>
              <p className="text-gray-400 text-sm">
                Select a document to preview it here
              </p>
            </div>
          ) : isPdf ? (
            <div className="w-full h-screen rounded-lg shadow-lg border border-gray-200 bg-white p-2">
              <iframe
                src={fileUrl}
                title="PDF Preview"
                className="w-full h-full rounded-lg bg-gray-100 print:rounded-none print:shadow-none print:border-none print:h-screen"
              />
            </div>
          ) : isImage ? (
            <div className="w-full h-full p-3 rounded-lg bg-gray-100 overflow-auto">
              <img
                src={fileUrl || "/placeholder.svg"}
                alt="Document Preview"
                className="max-w-full h-auto rounded-lg shadow-lg border border-gray-200 print:rounded-none print:shadow-none print:border-none"
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#e6f4ea] rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-yellow-600" />
              </div>
              <p className="text-gray-600 text-lg mb-2">
                Preview not available
              </p>
              <p className="text-gray-400 text-sm">
                This file type cannot be previewed
              </p>
              <Button
                type="primary"
                onClick={handleDownload}
                className="mt-4 flex  transition-colors duration-200 mx-auto"
              >
                <Download className="w-4 h-4" />
                Download to view
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CertificateDocumentSceoundFixViewer;
