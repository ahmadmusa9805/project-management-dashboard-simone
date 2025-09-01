// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState } from "react";
// import { Upload, message, Button } from "antd";
// import type { UploadFile } from "antd/es/upload/interface";
// import { InboxOutlined, UploadOutlined } from "@ant-design/icons";

// const { Dragger } = Upload;

// interface ImageUploaderProps {
//   onUploadSuccess?: (fileList: UploadFile[]) => void;
//   uploading?: boolean;
// }

// const ImageUploader: React.FC<ImageUploaderProps> = ({
//   onUploadSuccess,
//   uploading,
// }) => {
//   const [fileList, setFileList] = useState<UploadFile[]>([]);

//   const props = {
//     name: "file",
//     multiple: true,
//     accept: "image/*",
//     fileList,
//     beforeUpload: (file: UploadFile) => {
//       // Prevent automatic upload: return false here to upload manually later
//       const isImage = file.type?.startsWith("image/") ?? false;
//       if (!isImage) {
//         message.error("You can only upload image files!");
//       }
//       return false; // false means don't upload automatically
//     },
//     onChange(info: any) {
//       const files = [...info.fileList].slice(-5); // Limit to last 5 uploads
//       setFileList(files);
//     },
//     onRemove: (file: UploadFile) => {
//       setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
//     },
//   };

//   const handleUpload = () => {
//     // Here, do the actual upload logic for the files in fileList
//     // For demo, just simulate success and clear files
//     message.success(`${fileList.length} file(s) uploaded successfully!`);
//     if (onUploadSuccess) {
//       onUploadSuccess(fileList);
//     }
//     setFileList([]);
//   };

//   return (
//     <div>
//       <Dragger {...props} style={{ padding: "20px" }}>
//         <p className="ant-upload-drag-icon">
//           <InboxOutlined />
//         </p>
//         <p className="ant-upload-text">Click or drag image(s) to this area</p>
//         <p className="ant-upload-hint">
//           Only image files are supported. Upload up to 5 at a time.
//         </p>
//       </Dragger>
//       <Button
//         className="flex-1 mt-2 h-12 px-6 bg-[#001D01] rounded text-white text-base font-medium leading-6 tracking-wide"
//         icon={<UploadOutlined />}
//         onClick={handleUpload}
//         disabled={fileList.length === 0}
//         loading={uploading}
//       >
//         Upload
//       </Button>
//     </div>
//   );
// };

// export default ImageUploader;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Upload, message, Button } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { CloudUpload } from "lucide-react";

const { Dragger } = Upload;

interface ImageUploaderProps {
  onUploadSuccess?: (fileList: UploadFile[]) => void;
  uploading?: boolean;
  fileType?: "image" | "pdf"; // ✅ switch between image or pdf mode
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUploadSuccess,
  uploading,
  fileType = "image",
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const props = {
    name: "file",
    multiple: fileType === "image", // multiple only for images
    accept: fileType === "image" ? "image/*" : ".pdf",
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
            ? "You can only upload image files!"
            : "Only PDF files are allowed!"
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
    // TODO: replace with real backend upload

    if (onUploadSuccess) {
      onUploadSuccess(fileList);
    }
    setFileList([]);
  };

  return (
    <div>
      <Dragger {...props} style={{ padding: "20px" }}>
        <p className="ant-upload-drag-icon">
          {fileType === "image" ? (
            <InboxOutlined />
          ) : (
            <CloudUpload size={24} color="#83ac72" />
          )}
        </p>
        <p className="ant-upload-text">
          {fileType === "image"
            ? "Click or drag image(s) to this area"
            : "Click or drag a PDF to this area"}
        </p>
        <p className="ant-upload-hint">
          {fileType === "image"
            ? "Only image files are supported. Upload up to 5 at a time."
            : "Only a single PDF file is allowed."}
        </p>
      </Dragger>

      <Button
        className="flex-1 mt-2 h-12 px-6 bg-[#001D01] rounded text-white text-base font-medium"
        icon={<UploadOutlined />}
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
      >
        Upload
      </Button>
    </div>
  );
};

export default ImageUploader;

//TODO:

// import React, { useState } from "react";
// import { Upload, message, Button } from "antd";
// import type { UploadFile } from "antd/es/upload/interface";
// import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
// import { useCreateSitePictureImageMutation } from "../Redux/features/projects/project/siteReportPictures/sitePicturesApi";
// import { useParams } from "react-router-dom";
// // ✅ Import the new, correct mutation from the new API slice
// // Adjust this import path

// const { Dragger } = Upload;

// interface ImageUploaderProps {
//   onUploadSuccess?: (fileList: UploadFile[]) => void;
// }

// const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadSuccess }) => {
//   const [fileList, setFileList] = useState<UploadFile[]>([]);

//   const props = {
//     name: "file",
//     multiple: true,
//     accept: "image/*",
//     fileList,
//     beforeUpload: () => false,
//     onChange(info: any) {
//       setFileList([...info.fileList].slice(-5));
//     },
//     onRemove: (file: UploadFile) => {
//       setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
//     },
//   };

//   const handleUpload = () => {
//     const formData = new FormData();
//     // ✅ The backend needs to know which folder these images belong to
//   };

//   return (
//     <div>
//       <Dragger {...props} style={{ padding: "20px" }}>
//         <p className="ant-upload-drag-icon">
//           <InboxOutlined />
//         </p>
//         <p className="ant-upload-text">Click or drag image(s) to this area</p>
//         <p className="ant-upload-hint">
//           Only image files are supported. Upload up to 5 at a time.
//         </p>
//       </Dragger>
//       <Button
//         type="primary"
//         icon={<UploadOutlined />}
//         onClick={handleUpload}
//         disabled={fileList.length === 0}
//         loading={isUploading}
//         style={{ marginTop: 16 }}
//       >
//         {isUploading ? "Uploading..." : "Upload"}
//       </Button>
//     </div>
//   );
// };

// export default ImageUploader;
