/* eslint-disable @typescript-eslint/no-unused-vars */
// import { useState } from "react";
// import { Drawer } from "antd";
// import {
//   useGetAllNotesQuery,
//   useCreateNoteMutation,
//   useUpdateNoteMutation,
//   useDeleteNoteMutation,
// } from "../../../Redux/features/projects/project/notes/noteApi";

// import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
// import NoteForm from "../../../components/NoteForm";
// import CustomCreateButton from "../../../components/CustomCreateButton";
// import { useParams } from "react-router-dom";

// const NotesPage = () => {
//   const projectId = useParams().projectId;
//   const {
//     data: notesResponse,
//     isLoading,
//     error,
//   } = useGetAllNotesQuery({ projectId: projectId });
//   const [createNote] = useCreateNoteMutation();
//   const [updateNote] = useUpdateNoteMutation();
//   const [deleteNote] = useDeleteNoteMutation();

//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [editingNote, setEditingNote] = useState<any>(null);

//   const notes = notesResponse || [];

//   const openCreateDrawer = () => {
//     setEditingNote(null);
//     setIsDrawerOpen(true);
//   };

//   const openEditDrawer = (note: any) => {
//     setEditingNote(note);
//     setIsDrawerOpen(true);
//   };

//   const closeDrawer = () => {
//     setIsDrawerOpen(false);
//   };

//   const handleFormSubmit = async (formData: any) => {
//     try {
//       if (editingNote) {
//         // Edit mode
//         await updateNote({ id: editingNote.id, ...formData }).unwrap();
//       } else {
//         // Create mode
//         await createNote(formData).unwrap();
//       }
//       closeDrawer();
//     } catch (error) {
//       console.error("Failed to save note:", error);
//     }
//   };

//   const handleDelete = async (noteId: string) => {
//     try {
//       await deleteNote(noteId).unwrap();
//       closeDrawer();
//     } catch (error) {
//       console.error("Failed to delete note:", error);
//     }
//   };

//   if (isLoading) return <div className="p-8">Loading notes...</div>;
//   if (error) return <div className="p-8 text-red-500">Error loading notes</div>;

//   return (
//     <div className="w-full h-full p-8 bg-white flex flex-col items-end gap-8">
//       <div className="w-full flex justify-between items-end gap-8">
//         <h1 className="text-2xl font-medium text-[#000E0F]">My notes</h1>
//         <CustomCreateButton onClick={openCreateDrawer} title="New Note" />
//       </div>

//       {/* Notes Grid */}
//       <div className="w-full flex-1 flex flex-wrap gap-4 items-start">
//         {notes.map((note: any) => (
//           <div
//             key={note.id}
//             className="w-[183px] p-4 pr-2 bg-[#F1F1F1] border border-[#E6E7E7] rounded flex justify-between items-start"
//           >
//             <div className="flex flex-col gap-2 w-full">
//               <p className="text-[#2B3738] text-base leading-[1.4] h-[120px] font-normal">
//                 {note.description}
//               </p>
//               <p className="text-[#2B3738] text-sm font-medium leading-5">
//                 Value: £{note.value}
//               </p>
//               <p className="text-[#6B7374] text-sm font-normal leading-5">
//                 {new Date(note.date).toLocaleDateString()}
//               </p>
//             </div>
//             <CustomViewMoreButton
//               items={[
//                 { key: "edit", label: "✏️ Edit" },
//                 { key: "delete", label: "🗑️ Delete", danger: true },
//               ]}
//               onClick={(key) => {
//                 if (key === "edit") openEditDrawer(note);
//                 if (key === "delete") handleDelete(note.id);
//               }}
//             />
//           </div>
//         ))}
//       </div>

//       {/* Note Form Drawer */}
//       <Drawer
//         title={editingNote ? "Edit Note" : "Create Note"}
//         placement="right"
//         closable
//         onClose={closeDrawer}
//         open={isDrawerOpen}
//         width={600}
//         destroyOnClose
//       >
//         <NoteForm
//           mode={editingNote ? "edit" : "create"}
//           initialData={editingNote}
//           onSave={handleFormSubmit}
//           onDelete={
//             editingNote ? () => handleDelete(editingNote.id) : undefined
//           }
//         />
//       </Drawer>
//     </div>
//   );
// };

// export default NotesPage;
// TODO: after review above code delete

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Drawer, Tag, Modal, message } from "antd";
import {
  useGetAllNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
  useShareNoteMutation,
  useUnShareNoteMutation,
  useGetSingleNoteQuery,
} from "../../../Redux/features/projects/project/notes/noteApi";
import { Calendar, DollarSign } from "lucide-react";
import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
import NoteForm from "../../../components/NoteForm";
import CustomCreateButton from "../../../components/CustomCreateButton";
import CustomShareSelector from "../../../components/CustomShareSelector";
import CustomUnshareSelector from "../../../components/CustomUnshareSelector";
import { useParams } from "react-router-dom";

const NotesPage = () => {
  const projectId = useParams().projectId;

  const {
    data: notesResponse,
    isLoading,
    error,
  } = useGetAllNotesQuery({
    projectId,
  });
  const [createNote] = useCreateNoteMutation();
  const [updateNote] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();
  const [shareNote] = useShareNoteMutation();
  const [unShareNote] = useUnShareNoteMutation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);

  // Share/Unshare modal states
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareNoteItem, setShareNoteItem] = useState<any>(null);
  const [unshareModalOpen, setUnshareModalOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const { data: singleNoteData } = useGetSingleNoteQuery(selectedNoteId!, {
    skip: !selectedNoteId,
  });

  const notes = notesResponse || [];

  const openCreateDrawer = () => {
    setEditingNote(null);
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (note: any) => {
    setEditingNote(note);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingNote) {
        await updateNote({ id: editingNote._id, data }).unwrap();
      } else {
        await createNote(data).unwrap();
      }
      closeDrawer();
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  const handleDelete = async (noteId: string) => {
    try {
      await deleteNote(noteId).unwrap();
      closeDrawer();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  // Share note
  const handleShareNote = (note: any) => {
    setShareNoteItem(note);
    setShareModalOpen(true);
  };

  const handleConfirmShare = async (selectedUsers: any[]) => {
    try {
      await shareNote({
        id: shareNoteItem._id,
        sharedWith: selectedUsers,
      }).unwrap();
      message.success("Note shared successfully");
      setShareModalOpen(false);
      setShareNoteItem(null);
    } catch (error) {
      message.error("Failed to share note");
    }
  };

  // Unshare note
  const handleUnShareNote = (noteId: string) => {
    setSelectedNoteId(noteId);
    setUnshareModalOpen(true);
  };

  const handleConfirmUnshare = async (selectedUsers: any[]) => {
    try {
      await unShareNote({
        id: selectedNoteId!,
        unShareWith: selectedUsers.map((u) => u.userId),
      }).unwrap();
      message.success("Note unshared successfully");
      setUnshareModalOpen(false);
      setSelectedNoteId(null);
    } catch (error) {
      message.error("Failed to unshare note");
    }
  };

  if (isLoading) return <div className="p-8">Loading notes...</div>;
  if (error) return <div className="p-8 text-red-500">Error loading notes</div>;

  return (
    <div className="w-full h-full p-8 bg-white flex flex-col items-end gap-8">
      <div className="w-full flex justify-between items-end gap-8">
        <h1 className="text-2xl font-medium text-[#000E0F]">My notes</h1>
        <CustomCreateButton onClick={openCreateDrawer} title="New Note" />
      </div>

      <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note: any) => (
          <div
            key={note.id}
            className="w-full bg-white border rounded-2xl shadow-sm p-6 relative"
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold">{note.title}</h2>
                <Tag color="gold" className="mt-1">
                  {note.status || "pending"}
                </Tag>
              </div>
              <CustomViewMoreButton
                items={[
                  { key: "edit", label: "✏️ Edit" },
                  { key: "share", label: "🔗 Share" },
                  { key: "unshare", label: "🚫 Unshare" },
                  { key: "delete", label: "🗑️ Delete", danger: true },
                ]}
                onClick={(key) => {
                  if (key === "edit") openEditDrawer(note);
                  if (key === "delete") handleDelete(note._id);
                  if (key === "share") handleShareNote(note);
                  if (key === "unshare") handleUnShareNote(note._id);
                }}
              />
            </div>

            <p className="mt-3 text-gray-700">{note.description}</p>

            <div className="flex items-center gap-2 mt-4 text-gray-600 text-sm">
              <Calendar size={16} />
              {new Date(note.date).toLocaleDateString()}
            </div>

            <div className="flex items-center gap-2 mt-2 text-black font-medium">
              <DollarSign size={16} /> ${note.value}
            </div>

            <div className="mt-4 space-y-1 text-sm">
              <p>
                <span className="font-semibold">Client: </span>
                {note.clientComment || "—"}
              </p>
              <p>
                <span className="font-semibold">Admin: </span>
                {note.adminComment || "—"}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Drawer
        title={editingNote ? "Edit Note" : "Create Note"}
        placement="right"
        closable
        onClose={closeDrawer}
        open={isDrawerOpen}
        width={600}
        destroyOnClose
      >
        <NoteForm
          mode={editingNote ? "edit" : "create"}
          initialData={editingNote}
          onSave={handleFormSubmit}
          onDelete={
            editingNote ? () => handleDelete(editingNote.id) : undefined
          }
        />
      </Drawer>

      {/* Share Modal */}
      <Modal
        title="Share Note"
        open={shareModalOpen}
        onCancel={() => {
          setShareModalOpen(false);
          setShareNoteItem(null);
        }}
        footer={null}
        width={500}
      >
        <CustomShareSelector
          title="Share this note"
          roles={["prime-admin", "basic-admin", "client"]}
          onShare={handleConfirmShare}
        />
      </Modal>

      {/* Unshare Modal */}
      <Modal
        title="Unshare Note"
        open={unshareModalOpen}
        onCancel={() => {
          setUnshareModalOpen(false);
          setSelectedNoteId(null);
        }}
        footer={null}
        width={500}
      >
        <CustomUnshareSelector
          title="Remove access from users"
          sharedUsers={(singleNoteData?.sharedWith || []).map((u: any) => ({
            userId: u.userId._id,
            name: u.userId.name,
            role: u.userId.role,
            email: u.userId.email || "",
            profileImg: u.userId.profileImg,
          }))}
          onUnshare={handleConfirmUnshare}
        />
      </Modal>
    </div>
  );
};

export default NotesPage;
