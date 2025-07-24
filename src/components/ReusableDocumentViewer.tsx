/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useSelector } from "react-redux";
import type { RootState } from "../Redux/app/store";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ReusableDocumentViewer: React.FC = () => {
  const fileUrl = useSelector((state: RootState) => state.document.currentFile);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1.0);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isPdf = fileUrl?.endsWith(".pdf");

  useEffect(() => {
    if (!fileUrl || !isPdf) return;

    setLoading(true);
    fetch(fileUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch PDF");
        return res.blob();
      })
      .then((blob) => {
        const blobURL = URL.createObjectURL(blob);
        setBlobUrl(blobURL);
        setLoading(false);
      })
      .catch((err) => {
        console.error("PDF loading error:", err);
        setBlobUrl(null);
        setLoading(false);
      });

    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [fileUrl]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileUrl.split("/").pop() || "document.pdf";
      link.click();
    }
  };

  return (
    <div className=" p-6 bg-gradient-to-r from-slate-800 to-slate-900 shadow-lg rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-xl font-semibold truncate">
          {fileUrl ? fileUrl.split("/").pop() : "No File Selected"}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition"
          >
            ⬇️ Download
          </button>
          <button
            onClick={() => window.print()}
            className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 transition"
          >
            🖨️ Print
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between text-white mb-4 bg-slate-700 px-4 py-2 rounded-md">
        <div className="flex gap-4 items-center">
          <button
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            className="hover:text-yellow-400 disabled:opacity-40"
          >
            ⬅️ Prev
          </button>

          <span className="text-sm font-medium">
            Page {pageNumber} of {numPages ?? "..."}
          </span>

          <button
            disabled={numPages !== null && pageNumber >= numPages}
            onClick={() =>
              setPageNumber((prev) => (numPages ? Math.min(prev + 1, numPages) : prev))
            }
            className="hover:text-yellow-400 disabled:opacity-40"
          >
            Next ➡️
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
            className="text-xl hover:text-yellow-400"
          >
            ➖
          </button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale((s) => Math.min(2, s + 0.1))}
            className="text-xl hover:text-yellow-400"
          >
            ➕
          </button>
        </div>
      </div>

      {/* Document Viewer */}
      <div className="bg-white p-4 rounded-md shadow-inner flex justify-center items-center min-h-[500px]">
        {loading ? (
          <p className="text-black text-lg">Loading PDF…</p>
        ) : blobUrl && isPdf ? (
          <Document
            file={blobUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(err) => console.error("Document error:", err)}
          >
            <Page pageNumber={pageNumber} scale={scale} />
          </Document>
        ) : fileUrl ? (
          <img
            src={fileUrl}
            alt="Preview"
            className="max-h-[500px] rounded-lg shadow"
          />
        ) : (
          <p className="text-white text-lg">No document to preview.</p>
        )}
      </div>
    </div>
  );
};

export default ReusableDocumentViewer;
