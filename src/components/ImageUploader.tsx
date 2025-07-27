/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Upload, message, Button } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

interface ImageUploaderProps {
  onUploadSuccess?: (fileList: UploadFile[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadSuccess }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const props = {
    name: "file",
    multiple: true,
    accept: "image/*",
    fileList,
    beforeUpload: (file: UploadFile) => {
      // Prevent automatic upload: return false here to upload manually later
      const isImage = file.type?.startsWith("image/") ?? false;
      if (!isImage) {
        message.error("You can only upload image files!");
      }
      return false; // false means don't upload automatically
    },
    onChange(info: any) {
      const files = [...info.fileList].slice(-5); // Limit to last 5 uploads
      setFileList(files);
    },
    onRemove: (file: UploadFile) => {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    },
  };

  const handleUpload = () => {
    // Here, do the actual upload logic for the files in fileList
    // For demo, just simulate success and clear files
    message.success(`${fileList.length} file(s) uploaded successfully!`);
    if (onUploadSuccess) {
      onUploadSuccess(fileList);
    }
    setFileList([]);
  };

  return (
    <div>
      <Dragger {...props} style={{ padding: "20px" }}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag image(s) to this area</p>
        <p className="ant-upload-hint">
          Only image files are supported. Upload up to 5 at a time.
        </p>
      </Dragger>
      <Button
        type="primary"
        icon={<UploadOutlined />}
        onClick={handleUpload}
        disabled={fileList.length === 0}
        style={{ marginTop: 16 }}
      >
        Upload
      </Button>
    </div>
  );
};

export default ImageUploader;
