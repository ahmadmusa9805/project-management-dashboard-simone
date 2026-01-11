// import React, { useEffect, useRef, useState } from "react";
// import Quill from "quill";
// import "quill/dist/quill.snow.css";

// interface QuillEditorProps {
//   readOnly?: boolean;
//   initialValue?: string;
//   height?: string;
//   onChange?: (value: string) => void; // returns plain text only
// }

// const QuillEditor: React.FC<QuillEditorProps> = ({
//   initialValue = "",
//   height = "400px",
//   onChange,
// }) => {
//   const editorRef = useRef<Quill | null>(null);
//   const editorContainerRef = useRef<HTMLDivElement | null>(null);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const [, setContent] = useState(initialValue);

//   useEffect(() => {
//     if (!editorContainerRef.current) return;
//     if (editorRef.current) return; // prevent double initialization

//     // Initialize Quill
//     editorRef.current = new Quill(editorContainerRef.current, {
//       theme: "snow",
//       modules: {
//         toolbar: [
//           ["bold", "italic", "underline", "strike"],
//           ["blockquote", "code-block"],
//           [{ header: 1 }, { header: 2 }],
//           [{ list: "ordered" }, { list: "bullet" }],
//           [{ indent: "-1" }, { indent: "+1" }],
//           [{ size: ["small", false, "large", "huge"] }],
//           [{ color: [] }, { background: [] }],
//           [{ align: [] }],
//           ["clean"],
//         ],
//       },
//     });

//     // Set initial content
//     if (initialValue && editorRef.current.getLength() === 1) {
//       editorRef.current.clipboard.dangerouslyPasteHTML(initialValue);
//     }

//     // Listen for changes
//     editorRef.current.on("text-change", () => {
//       const textValue = editorRef.current?.getText().trim() || "";
//       setContent(textValue);
//       onChange?.(textValue); // send plain text only
//     });

//     editorContainerRef.current.style.height = height;

//     return () => {
//       if (editorRef.current) {
//         editorRef.current.root.innerHTML = "";
//         editorRef.current = null;
//       }
//     };
//   }, []);

//   // Handle image upload
//   const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => {
//       const imageUrl = reader.result as string;
//       const range = editorRef.current?.getSelection(true) || { index: 0 };
//       editorRef.current?.insertEmbed(range.index, "image", imageUrl, "user");

//       if (fileInputRef.current) fileInputRef.current.value = "";
//     };
//     reader.readAsDataURL(file);
//   };

//   return (
//     <div>
//       <div
//         ref={editorContainerRef}
//         style={{ borderRadius: "8px", backgroundColor: "#fff" }}
//       />
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

// export default QuillEditor;

// import React, { useEffect, useRef, useState } from "react";
// import Quill from "quill";
// import "quill/dist/quill.snow.css";

// interface QuillEditorProps {
//   readOnly?: boolean;
//   initialValue?: string;
//   height?: string;
//   onChange?: (value: string) => void; // returns plain text only
// }

// const QuillEditor: React.FC<QuillEditorProps> = ({
//   readOnly = false,
//   initialValue = "",
//   height = "400px",
//   onChange,
// }) => {
//   const editorRef = useRef<Quill | null>(null);
//   const editorContainerRef = useRef<HTMLDivElement | null>(null);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const [, setContent] = useState(initialValue);

//   useEffect(() => {
//     if (!editorContainerRef.current) return;
//     if (editorRef.current) return; // prevent double initialization

//     // Initialize Quill
//     editorRef.current = new Quill(editorContainerRef.current, {
//       theme: "snow",
//       readOnly, // set initial readonly state
//       modules: {
//         toolbar: readOnly
//           ? false // hide toolbar if readonly
//           : [
//               ["bold", "italic", "underline", "strike"],
//               ["blockquote", "code-block"],
//               [{ header: 1 }, { header: 2 }],
//               [{ list: "ordered" }, { list: "bullet" }],
//               [{ indent: "-1" }, { indent: "+1" }],
//               [{ size: ["small", false, "large", "huge"] }],
//               [{ color: [] }, { background: [] }],
//               [{ align: [] }],
//               ["clean"],
//             ],
//       },
//     });

//     // Set initial content
//     if (initialValue && editorRef.current.getLength() === 1) {
//       editorRef.current.clipboard.dangerouslyPasteHTML(initialValue);
//     }

//     // Listen for changes (only if not readonly)
//     if (!readOnly) {
//       editorRef.current.on("text-change", () => {
//         const textValue = editorRef.current?.getText().trim() || "";
//         setContent(textValue);
//         onChange?.(textValue); // send plain text only
//       });
//     }

//     editorContainerRef.current.style.height = height;

//     return () => {
//       if (editorRef.current) {
//         editorRef.current.root.innerHTML = "";
//         editorRef.current = null;
//       }
//     };
//   }, [readOnly]);

//   // Handle image upload (disable if readonly)
//   const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (readOnly) return; // block file insert
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => {
//       const imageUrl = reader.result as string;
//       const range = editorRef.current?.getSelection(true) || { index: 0 };
//       editorRef.current?.insertEmbed(range.index, "image", imageUrl, "user");

//       if (fileInputRef.current) fileInputRef.current.value = "";
//     };
//     reader.readAsDataURL(file);
//   };

//   return (
//     <div>
//       <div
//         ref={editorContainerRef}
//         style={{ borderRadius: "8px", backgroundColor: "#fff" }}
//       />
//       {!readOnly && (
//         <input
//           type="file"
//           accept="image/*"
//           style={{ display: "none" }}
//           ref={fileInputRef}
//           onChange={onFileChange}
//         />
//       )}
//     </div>
//   );
// };

// export default QuillEditor;

import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface ToastEditorProps {
  initialValue?: string;
  readOnly?: boolean;
  value?: string;
  height?: string;
  onChange?: (value: string) => void; // HTML string
}

const ToastEditor: React.FC<ToastEditorProps> = ({
  readOnly = false,
  value = "",
  height = "150px",
  onChange,
}) => {
  const editorRef = useRef<Quill | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Initialize Quill
  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    editorRef.current = new Quill(containerRef.current, {
      theme: "snow",
      readOnly,
      modules: {
        toolbar: readOnly
          ? false
          : [
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

    editorRef.current.on("text-change", () => {
      onChange?.(editorRef.current?.root.innerHTML || "");
    });

    containerRef.current.style.height = height;
  }, [readOnly, onChange, height]);

  // Update content whenever value changes
  useEffect(() => {
    if (!editorRef.current) return;
    const current = editorRef.current.root.innerHTML;
    if (value !== current) {
      editorRef.current.clipboard.dangerouslyPasteHTML(value || "");
    }
  }, [value]);

  return <div ref={containerRef} style={{ borderRadius: "8px" }} />;
};

export default ToastEditor;
