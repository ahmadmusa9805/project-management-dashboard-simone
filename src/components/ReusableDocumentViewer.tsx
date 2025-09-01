import type React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../Redux/app/store";
import { Download, FileText } from "lucide-react";

interface ReusableDocumentViewerProps {
  quoteTitle?: string;
}

const ReusableDocumentViewer: React.FC<ReusableDocumentViewerProps> = () => {
  const fileUrl = useSelector((state: RootState) => state.document.currentFile);

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileUrl.split("/").pop() || "document";
      link.click();
    }
  };

  // Detect file type
  const isPdf = fileUrl?.toLowerCase().endsWith(".pdf");
  const isImage = fileUrl?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);

  return (
    <>
      {/* Add print styles to hide modal elements when printing */}
      <style>{`
        @media print {
          .print-hide {
            display: none !important;
          }
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

      <div className="bg-white">
        <div className="p-6 bg-gray-50 min-h-[600px] flex justify-center items-center print-content">
          {!fileUrl ? (
            <div className="text-center py-12 print-hide">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg mb-2">No file selected</p>
              <p className="text-gray-400 text-sm">
                Select a document to preview it here
              </p>
            </div>
          ) : isPdf ? (
            <div className="w-full max-w-4xl">
              <iframe
                src={fileUrl}
                title="PDF Preview"
                className="w-full h-[600px] rounded-lg shadow-lg border border-gray-200 bg-white print:rounded-none print:shadow-none print:border-none print:h-screen"
              />
            </div>
          ) : isImage ? (
            <div className="max-w-4xl max-h-[600px] overflow-auto">
              <img
                src={fileUrl || "/placeholder.svg"}
                alt="Document Preview"
                className="max-w-full h-auto rounded-lg shadow-lg border border-gray-200 print:rounded-none print:shadow-none print:border-none"
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-yellow-600" />
              </div>
              <p className="text-gray-600 text-lg mb-2">
                Preview not available
              </p>
              <p className="text-gray-400 text-sm">
                This file type cannot be previewed
              </p>
              <button
                onClick={handleDownload}
                className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 mx-auto"
              >
                <Download className="w-4 h-4" />
                Download to view
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ReusableDocumentViewer;
