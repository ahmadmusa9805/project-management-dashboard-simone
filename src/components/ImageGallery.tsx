import React from "react";

interface ImageData {
  id: string;
  url: string;
  uploadedAt: string;
}

interface ImageGalleryProps {
  images: ImageData[];
  onDelete?: (id: string) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onDelete }) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      {images.map((img) => (
        <div
          key={img.id}
          style={{
            position: "relative",
            width: 280,
            height: 224,
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 0 6px rgba(0,0,0,0.1)",
          }}
        >
          <img
            src={img.url}
            alt={`Image ${img.id}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          {/* Delete Button */}
          <button
            onClick={() => onDelete && onDelete(img.id)}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 24,
              height: 24,
              borderRadius: "50%",
              backgroundColor: "rgba(218, 69, 63, 0.9)",
              border: "none",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              lineHeight: 1,
              userSelect: "none",
            }}
            aria-label={`Delete image ${img.id}`}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
