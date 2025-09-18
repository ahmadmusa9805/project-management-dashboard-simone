/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { Upload, message, Button } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { UploadOutlined } from "@ant-design/icons";
import { CloudUpload } from "lucide-react";

const { Dragger } = Upload;

interface ImageUploaderProps {
  onUploadSuccess?: (fileList: UploadFile[]) => void;
  uploading?: boolean;
  fileType?: "image" | "pdf"; // ✅ switch between image or pdf mode
  label?: string;
  errorMessage?: string;
  // onClose: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUploadSuccess,
  uploading,
  fileType = "image",
  label = "Upload Files",
  // onClose,
  errorMessage,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const props = {
    name: "file",
    multiple: fileType === "image", // multiple only for images
    accept: fileType === "image" ? "*" : "*",
    fileList,
    beforeUpload: (file: UploadFile) => {
      // block auto-upload
      const isValid =
        fileType === "image"
          ? file.type?.startsWith("image/") ?? false
          : file.type === "application/pdf";

      if (!isValid) {
        message.error(
          fileType === "image"
            ? "You can upload image file"
            : "All files are allowed"
        );
      }
      return false;
    },
    onChange(info: any) {
      const files =
        fileType === "image"
          ? [...info.fileList].slice(-5) // last 5 images only
          : [info.file]; // only 1 pdf

      setFileList(files);
    },
    onRemove: (file: UploadFile) => {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    },
  };

  const handleUpload = () => {
    if (onUploadSuccess) {
      onUploadSuccess(fileList);
    }
    setFileList([]);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* ✅ Custom Label */}
      <label className="font-medium">{label}</label>

      <Dragger {...props} style={{ padding: "8px" }}>
        <p className="text-center flex flex-col items-center">
          <CloudUpload size={24} color="#83ac72" strokeWidth={2.5} />
        </p>
        <p className="text-[10px]">
          {fileType === "image"
            ? "Click or drag files to upload"
            : "Click or drag files to upload"}
        </p>
      </Dragger>

      {/* ✅ Custom Upload Button */}
      <Button
        type="primary"
        className="flex-1 mt-2  !py-2 rounded text-white text-base font-medium"
        icon={<UploadOutlined />}
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
      >
        Upload
      </Button>

      {/* ✅ Error Message (if needed) */}
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
    </div>
  );
};

export default ImageUploader;
