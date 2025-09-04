// import React, { useEffect, useRef, useState } from "react";
// import Editor from "@toast-ui/editor";
// import "@toast-ui/editor/dist/toastui-editor.css"; // Light theme
// import "@toast-ui/editor/dist/theme/toastui-editor-dark.css"; // Dark theme

// interface ToastEditorProps {
//   initialValue?: string;
//   height?: string;
//   previewStyle?: "vertical" | "tab";
//   theme?: "light" | "dark";
//   onChange?: (value: string) => void;
// }

// const ToastEditor: React.FC<ToastEditorProps> = ({
//   initialValue = "",
//   previewStyle = "vertical",
//   theme = "light",
//   onChange,
// }) => {
//   const editorRef = useRef<Editor | null>(null);
//   const editorContainerRef = useRef<HTMLDivElement | null>(null);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const [, setContent] = useState(initialValue);

//   useEffect(() => {
//     if (!editorContainerRef.current) return;

//     editorRef.current = new Editor({
//       el: editorContainerRef.current,

//       previewStyle,
//       initialValue,
//       theme,
//       usageStatistics: false,
//       toolbarItems: [
//         ["heading", "bold", "italic", "strike"],
//         ["hr", "quote"],
//         ["ul", "ol", "task"],
//         ["code", "codeblock"],
//       ],
//     });

//     editorRef.current.on("change", () => {
//       const markdown = editorRef.current?.getMarkdown() || "";
//       setContent(markdown);
//       onChange?.(markdown);
//     });

//     return () => {
//       editorRef.current?.destroy();
//     };
//   }, []);

//   const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => {
//       const imageUrl = reader.result as string;
//       editorRef.current?.insertText(`![alt text](${imageUrl})\n`);

//       if (fileInputRef.current) fileInputRef.current.value = "";
//     };
//     reader.readAsDataURL(file);
//   };

//   return (
//     <div>
//       <div ref={editorContainerRef} />

//       <input
//         type="file"
//         accept="image/*"
//         style={{ display: "none" }}
//         ref={fileInputRef}
//         onChange={onFileChange}
//       />
//     </div>
//   );
// };

// export default ToastEditor;

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface QuillEditorProps {
  initialValue?: string;
  height?: string;
  onChange?: (value: string) => void; // returns plain text only
}

const QuillEditor: React.FC<QuillEditorProps> = ({
  initialValue = "",
  height = "400px",
  onChange,
}) => {
  const editorRef = useRef<Quill | null>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [, setContent] = useState(initialValue);

  useEffect(() => {
    if (!editorContainerRef.current) return;
    if (editorRef.current) return; // prevent double initialization

    // Initialize Quill
    editorRef.current = new Quill(editorContainerRef.current, {
      theme: "snow",
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ header: 1 }, { header: 2 }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ size: ["small", false, "large", "huge"] }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ["clean"],
        ],
      },
    });

    // Set initial content
    if (initialValue && editorRef.current.getLength() === 1) {
      editorRef.current.clipboard.dangerouslyPasteHTML(initialValue);
    }

    // Listen for changes
    editorRef.current.on("text-change", () => {
      const textValue = editorRef.current?.getText().trim() || "";
      setContent(textValue);
      onChange?.(textValue); // send plain text only
    });

    editorContainerRef.current.style.height = height;

    return () => {
      if (editorRef.current) {
        editorRef.current.root.innerHTML = "";
        editorRef.current = null;
      }
    };
  }, []);

  // Handle image upload
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result as string;
      const range = editorRef.current?.getSelection(true) || { index: 0 };
      editorRef.current?.insertEmbed(range.index, "image", imageUrl, "user");

      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div
        ref={editorContainerRef}
        style={{ borderRadius: "8px", backgroundColor: "#fff" }}
      />
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={onFileChange}
      />
    </div>
  );
};

export default QuillEditor;
