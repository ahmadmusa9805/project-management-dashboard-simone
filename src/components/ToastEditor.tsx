import React, { useEffect, useRef, useState } from "react";
import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css"; // Light theme
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css"; // Dark theme

interface ToastEditorProps {
  initialValue?: string;
  height?: string;
  previewStyle?: "vertical" | "tab";
  theme?: "light" | "dark";
  onChange?: (value: string) => void;
}

const ToastEditor: React.FC<ToastEditorProps> = ({
  initialValue = "",
  previewStyle = "vertical",
  theme = "light",
  onChange,
}) => {
  const editorRef = useRef<Editor | null>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [, setContent] = useState(initialValue);

  useEffect(() => {
    if (!editorContainerRef.current) return;

    editorRef.current = new Editor({
      el: editorContainerRef.current,
      
      previewStyle,
      initialValue,
      theme,
      usageStatistics: false,
      toolbarItems: [
        ["heading", "bold", "italic", "strike"],
        ["hr", "quote"],
        ["ul", "ol", "task"],
        ["table", "link", "image"], // Keep default image button here
        ["code", "codeblock"],
      ],
    });

    editorRef.current.on("change", () => {
      const markdown = editorRef.current?.getMarkdown() || "";
      setContent(markdown);
      onChange?.(markdown);
    });

    return () => {
      editorRef.current?.destroy();
    };
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result as string;
      editorRef.current?.insertText(`![alt text](${imageUrl})\n`);

      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };


  return (
    <div>
      <div ref={editorContainerRef} />

      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={onFileChange}
      />

      <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
        <button
          type="button"
          onClick={handleUploadClick}
          style={{
            padding: "8px 16px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Upload Image
        </button>

      </div>
    </div>
  );
};

export default ToastEditor;
