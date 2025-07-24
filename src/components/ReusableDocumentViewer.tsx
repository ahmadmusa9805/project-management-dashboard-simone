/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useSelector } from "react-redux";
import type { RootState } from "../Redux/app/store";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
      // Cleanup
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [fileUrl]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const handlePrint = () => window.print();
  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileUrl.split("/").pop() || "document.pdf";
      link.click();
    }
  };

  useEffect(() => {
    if (!fileUrl || !isPdf) return;

    console.log("📄 Fetching PDF:", fileUrl); // 👈 log

    setLoading(true);
    fetch(fileUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch PDF");
        return res.blob();
      })
      .then((blob) => {
        const blobURL = URL.createObjectURL(blob);
        console.log("✅ Blob URL created:", blobURL); // 👈 log
        setBlobUrl(blobURL);
        setLoading(false);
      })
      .catch((err) => {
        console.error("🚫 PDF loading error:", err);
        setBlobUrl(null);
        setLoading(false);
      });

    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [fileUrl]);

  return (
    <div className="w-full h-full p-4 bg-[#323639] shadow-lg">
      {/* File Info */}
      <div className="flex items-center gap-4">
        <span className="text-white text-lg font-medium">
          {fileUrl ? fileUrl.split("/").pop() : "No File Selected"}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 text-white mt-4">
        <div>
          Page {pageNumber} of {numPages ?? "..."}
        </div>
        <button onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}>
          ➖
        </button>
        <span>{Math.round(scale * 100)}%</span>
        <button onClick={() => setScale((s) => Math.min(2, s + 0.1))}>
          ➕
        </button>
        <button onClick={handlePrint}>🖨️</button>
        <button onClick={handleDownload}>⬇️</button>
      </div>

      {/* Document Preview */}
      <div className="w-full mt-6 flex justify-center bg-white rounded p-4 min-h-[400px]">
        {loading ? (
          <p className="text-black">Loading PDF…</p>
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
            alt="Document preview"
            className="max-h-[600px] rounded shadow"
          />
        ) : (
          <p className="text-white">No document to preview.</p>
        )}
      </div>
    </div>
  );
};

export default ReusableDocumentViewer;
