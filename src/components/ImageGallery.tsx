/* eslint-disable no-irregular-whitespace */
// // ImageGallery.tsx

// /* eslint-disable @typescript-eslint/no-unused-expressions */
// import { Trash2Icon } from "lucide-react";
// import React, { useState } from "react";
// import { Modal } from "antd";

// // ✅ This interface now correctly represents a SINGLE image
// interface ImageData {
//   _id: string; // ID of the parent record for deletion
//   file: string; // The URL for this specific image
//   uploadedAt: string;
// }

// interface ImageGalleryProps {
//   images: ImageData[];
//   onDelete?: (id: string) => void;
// }

// const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onDelete }) => {
//   const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

//   return (
//     <>
//       <div
//         style={{
//           width: "100%",
//           display: "flex",
//           flexWrap: "wrap",
//           gap: 12,
//         }}
//       >
//         {images.map((img) => (
//           <div
//             // ✅ Using the file URL for a unique key as multiple images can share one _id
//             key={img.file}
//             style={{
//               position: "relative",
//               width: 280,
//               height: 224,
//               borderRadius: 4,
//               overflow: "hidden",
//               boxShadow: "0 0 6px rgba(0,0,0,0.1)",
//               cursor: "pointer",
//             }}
//             onClick={() => setSelectedImage(img)} // Open modal on image click
//           >
//             <img
//               // ✅ Use the direct file URL, not file[0]
//               src={img.file}
//               alt={`Site visual`}
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 objectFit: "cover",
//                 display: "block",
//               }}
//             />

//             <button
//               onClick={(e) => {
//                 e.stopPropagation(); // Prevent opening modal when deleting
//                 onDelete && onDelete(img._id);
//               }}
//               style={{
//                 position: "absolute",
//                 top: 8,
//                 right: 8,
//                 width: 28,
//                 height: 28,
//                 borderRadius: "50%",
//                 backgroundColor: "rgba(218, 69, 63, 0.9)",
//                 border: "none",
//                 color: "white",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//               aria-label={`Delete image record ${img._id}`}
//             >
//               <Trash2Icon size={16} />
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* This Modal will now correctly show the single clicked image */}
//       <Modal
//         open={!!selectedImage}
//         onCancel={() => setSelectedImage(null)}
//         footer={null}
//         centered
//         width="50vw"
//         styles={{ body: { maxHeight: "80vh", overflow: "hidden" } }}
//       >
//         {selectedImage && (
//           <img
//             // ✅ Use the selected image's direct file URL
//             src={selectedImage.file}
//             alt={`Enlarged view`}
//             style={{
//               width: "100%",
//               height: "auto",
//               maxHeight: "80vh",
//               objectFit: "contain",
//               borderRadius: 8,
//             }}
//           />
//         )}
//       </Modal>
//     </>
//   );
// };

// export default ImageGallery;

// ImageGallery.tsx

/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Trash2Icon } from "lucide-react";
import React, { useState } from "react";
import { Modal } from "antd";

interface ImageData {
  _id: string; // ID of the parent record for deletion
  file: string; // The URL for this specific image
  uploadedAt: string;
}

interface ImageGalleryProps {
  images: ImageData[];
  onUpdate?: (id: string, fileUrl: string) => void; // Update the prop signature
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onUpdate }) => {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
               {" "}
        {images.map((img) => (
          <div
            key={img.file}
            style={{
              position: "relative",
              width: 280,
              height: 224,
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: "0 0 6px rgba(0,0,0,0.1)",
              cursor: "pointer",
            }}
            onClick={() => setSelectedImage(img)}
          >
                       {" "}
            <img
              src={img.file}
              alt={`Site visual`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
                       {" "}
            <button
              onClick={(e) => {
                e.stopPropagation(); // ✅ Call onDelete with both id and file
                onUpdate && onUpdate(img._id, img.file);
              }}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 28,
                height: 28,
                borderRadius: "50%",
                backgroundColor: "rgba(218, 69, 63, 0.9)",
                border: "none",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label={`Delete image record ${img._id}`}
            >
                            <Trash2Icon size={16} />           {" "}
            </button>
                     {" "}
          </div>
        ))}
             {" "}
      </div>
           {" "}
      <Modal
        open={!!selectedImage}
        onCancel={() => setSelectedImage(null)}
        footer={null}
        centered
        width="50vw"
        styles={{ body: { maxHeight: "80vh", overflow: "hidden" } }}
      >
               {" "}
        {selectedImage && (
          <img
            src={selectedImage.file}
            alt={`Enlarged view`}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "80vh",
              objectFit: "contain",
              borderRadius: 8,
            }}
          />
        )}
             {" "}
      </Modal>
         {" "}
    </>
  );
};

export default ImageGallery;
