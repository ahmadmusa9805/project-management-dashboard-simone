/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
// import { Drawer, Modal, Spin } from "antd"; // ✅ Added Spin here
// import {
//   useGetAllNotesQuery,
//   useCreateNoteMutation,
//   useUpdateNoteMutation,
//   useDeleteNoteMutation,
//   useShareNoteMutation,
//   useUnShareNoteMutation,
//   useGetSingleNoteQuery,
// } from "../../../Redux/features/projects/project/notes/noteApi";
// import {
//   Calendar,
//   CheckCircle,
//   Clock,
//   DollarSign,
//   Unlink,
//   XCircle,
// } from "lucide-react";
// import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
// import NoteForm from "../../../components/NoteForm";
// import CustomCreateButton from "../../../components/CustomCreateButton";
// import CustomShareSelector from "../../../components/CustomShareSelector";
// import CustomUnshareSelector from "../../../components/CustomUnshareSelector";
// import { useParams } from "react-router-dom";
// import { errorAlert, successAlert } from "../../../utils/alerts";
// import { showDeleteAlert } from "../../../utils/deleteAlert";
// import { USER_ROLE } from "../../../types/userAllTypes/user";

// const NotesPage = () => {
//   const projectId = useParams().projectId;

//   const {
//     data: notesResponse,
//     isLoading,
//     error,
//   } = useGetAllNotesQuery({ projectId });

//   const [createNote, { isLoading: isCreating }] = useCreateNoteMutation();
//   const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();
//   const [deleteNote] = useDeleteNoteMutation();
//   const [shareNote, { isLoading: isSharing }] = useShareNoteMutation();
//   const [unShareNote, { isLoading: isUnsharing }] = useUnShareNoteMutation();

//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [editingNote, setEditingNote] = useState<any>(null);
//   const [viewMode, setViewMode] = useState<"view" | "edit" | "create">("view");

//   const [shareModalOpen, setShareModalOpen] = useState(false);
//   const [shareNoteItem, setShareNoteItem] = useState<any>(null);

//   const [unshareModalOpen, setUnshareModalOpen] = useState(false);
//   const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

//   const { data: singleNoteData } = useGetSingleNoteQuery(selectedNoteId!, {
//     skip: !selectedNoteId,
//   });

//   const notes = notesResponse || [];

//   const openDrawer = (
//     note: any = null,
//     mode: "view" | "edit" | "create" = "create"
//   ) => {
//     setEditingNote(note);
//     setViewMode(mode);
//     setIsDrawerOpen(true);
//   };

//   const closeDrawer = () => setIsDrawerOpen(false);

//   const handleFormSubmit = async (data: any) => {
//     console.log("Form Data:", data);
//     try {
//       if (viewMode === "edit" && editingNote) {
//         console.log("Editing Note:", editingNote);
//         await updateNote({ id: editingNote._id, data }).unwrap();
//         successAlert("Note updated successfully");
//       } else if (viewMode === "create") {
//         await createNote(data).unwrap();
//         successAlert("Note created successfully");
//       }
//       closeDrawer();
//     } catch (error) {
//       console.error("Failed to save note:", error);
//       errorAlert("Failed to save note");
//     }
//   };

//   const handleDelete = async (noteId: string) => {
//     showDeleteAlert({
//       onConfirm: async () => {
//         try {
//           await deleteNote(noteId).unwrap();
//           closeDrawer();
//         } catch (err: any) {
//           errorAlert(
//             "Delete Error",
//             err?.data?.message || "Failed to delete note"
//           );
//         }
//       },
//     });
//   };

//   const handleShareNote = (note: any) => {
//     setShareNoteItem(note);
//     setShareModalOpen(true);
//   };

//   const handleConfirmShare = async (selectedUsers: any[]) => {
//     try {
//       await shareNote({
//         id: shareNoteItem._id,
//         sharedWith: selectedUsers,
//       }).unwrap();
//       successAlert("Note shared successfully");
//       setShareModalOpen(false);
//       setShareNoteItem(null);
//     } catch (error) {
//       errorAlert("Failed to share note");
//     }
//   };

//   const handleUnShareNote = (noteId: string) => {
//     setSelectedNoteId(noteId);
//     setUnshareModalOpen(true);
//   };

//   const handleConfirmUnshare = async (selectedUsers: any[]) => {
//     try {
//       await unShareNote({
//         id: selectedNoteId!,
//         unShareWith: selectedUsers.map((u) => u.userId),
//       }).unwrap();
//       successAlert("Note unshared successfully");
//       setUnshareModalOpen(false);
//       setSelectedNoteId(null);
//     } catch (error) {
//       errorAlert("Failed to unshare note");
//     }
//   };

//   if (error) return <div className="p-8 text-red-500">Error loading notes</div>;

//   const stripHtml = (html: string) => {
//     if (!html) return "";
//     const doc = new DOMParser().parseFromString(html, "text/html");
//     return doc.body.textContent || "";
//   };

//   return (
//     <div className="w-full px-4 gap-4 bg-white min-h-screen pt-3">
//       {/* Header */}
//       <div className="w-full flex justify-between items-end gap-8 my-10">
//         <h1 className="text-2xl font-medium text-[#000E0F]">My notes</h1>
//         <CustomCreateButton
//           onClick={() => openDrawer(null, "create")}
//           title="New Note"
//         />
//       </div>

//       {/* Loader while fetching notes */}
//       {isLoading ? (
//         <div className="flex justify-center items-center h-40">
//           <Spin size="large" />
//         </div>
//       ) : (
//         <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {notes.map((note: any) => (
//             <div
//               key={note._id}
//               className="bg-gray-100 rounded shadow flex flex-col justify-between p-5 h-40 w-[320px] relative"
//             >
//               <div className="flex justify-between items-start">
//                 <div className="flex flex-col">
//                   <div className="text-lg font-semibold w-[200px] truncate">
//                     {stripHtml(note.title)}
//                   </div>
//                 </div>
//                 <CustomViewMoreButton
//                   items={[
//                     { key: "view", label: "👁️ View" },
//                     { key: "edit", label: "✏️ Edit" },
//                     { key: "share", label: "🔗 Share" },
//                     {
//                       key: "unshare",
//                       label: (
//                         <div className="flex items-center gap-1">
//                           <Unlink className="text-green-500" size={14} />
//                           Unshare Quote
//                         </div>
//                       ),
//                     },
//                     { key: "delete", label: "🗑️ Delete", danger: true },
//                   ]}
//                   onClick={(key) => {
//                     if (key === "view") openDrawer(note, "view");
//                     if (key === "edit") openDrawer(note, "edit");
//                     if (key === "delete") handleDelete(note._id);
//                     if (key === "share") handleShareNote(note);
//                     if (key === "unshare") handleUnShareNote(note._id);
//                   }}
//                 />
//               </div>

//               <div className="flex justify-between items-center mt-3">
//                 <div>
//                   <div className="flex items-center gap-2 mt-2 text-black font-medium">
//                     <DollarSign size={16} /> {note.value}
//                   </div>
//                   <div className="flex items-center gap-2 text-gray-600 text-sm">
//                     <Calendar size={16} />
//                     {new Date(note.date).toLocaleDateString()}
//                   </div>
//                 </div>

//                 <div>
//                   {note.status === "approved" && (
//                     <span className="flex items-center gap-1 text-green-600 font-medium">
//                       <CheckCircle size={16} /> Approved
//                     </span>
//                   )}
//                   {note.status === "pending" && (
//                     <span className="flex items-center gap-1 text-orange-500 font-medium">
//                       <Clock size={16} /> Pending
//                     </span>
//                   )}
//                   {note.status === "rejected" && (
//                     <span className="flex items-center gap-1 text-red-600 font-medium">
//                       <XCircle size={16} /> Rejected
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Drawer for Create/Edit/View */}
//       <Drawer
//         title={
//           viewMode === "view"
//             ? "View Note"
//             : viewMode === "edit"
//             ? "Edit Note"
//             : "Create Note"
//         }
//         placement="right"
//         closable
//         onClose={closeDrawer}
//         open={isDrawerOpen}
//         width={600}
//         destroyOnClose
//       >
//         <NoteForm
//           mode={viewMode}
//           isViewOnly={
//             viewMode === "view" ||
//             (editingNote &&
//               editingNote.status !== "pending" &&
//               viewMode === "edit")
//           }
//           closeDrawer={closeDrawer}
//           creating={isCreating}
//           updating={isUpdating}
//           initialData={editingNote}
//           onSave={handleFormSubmit}
//           onDelete={
//             viewMode === "edit" && editingNote
//               ? () => handleDelete(editingNote._id)
//               : undefined
//           }
//         />
//       </Drawer>

//       {/* Share Modal */}
//       <Modal
//         title="Share Note"
//         open={shareModalOpen}
//         onCancel={() => {
//           setShareModalOpen(false);
//           setShareNoteItem(null);
//         }}
//         footer={null}
//         width={500}
//       >
//         <CustomShareSelector
//           shareing={isSharing}
//           title="Share this note"
//           roles={[
//             USER_ROLE.superAdmin,
//             USER_ROLE.primeAdmin,
//             USER_ROLE.basicAdmin,
//             USER_ROLE.client,
//           ]}
//           onShare={handleConfirmShare}
//         />
//       </Modal>

//       {/* Unshare Modal */}
//       <Modal
//         title="Unshare Note"
//         open={unshareModalOpen}
//         onCancel={() => {
//           setUnshareModalOpen(false);
//           setSelectedNoteId(null);
//         }}
//         footer={null}
//         width={500}
//       >
//         <CustomUnshareSelector
//           unsharing={isUnsharing}
//           title="Remove access from users"
//           sharedUsers={(singleNoteData?.sharedWith || []).map((u: any) => ({
//             userId: u.userId._id,
//             name: u.userId.name,
//             role: u.userId.role,
//             email: u.userId.email || "",
//             profileImg: u.userId.profileImg,
//           }))}
//           onUnshare={handleConfirmUnshare}
//         />
//       </Modal>
//     </div>
//   );
// };

// export default NotesPage;

import { useState } from "react";
import { Card, Col, Drawer, Modal, Row, Spin } from "antd";
import {
  useGetAllNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
  useShareNoteMutation,
  useUnShareNoteMutation,
  useGetSingleNoteQuery,
} from "../../../Redux/features/projects/project/notes/noteApi";
import { Calendar, CheckCircle, Clock, Unlink, XCircle } from "lucide-react";
import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
import NoteForm from "../../../components/NoteForm";
import CustomCreateButton from "../../../components/CustomCreateButton";
import CustomShareSelector from "../../../components/CustomShareSelector";
import CustomUnshareSelector from "../../../components/CustomUnshareSelector";
import { useParams } from "react-router-dom";
import { errorAlert, successAlert } from "../../../utils/alerts";
import { showDeleteAlert } from "../../../utils/deleteAlert";
import { USER_ROLE } from "../../../types/userAllTypes/user";
import { useSelector } from "react-redux";
import type { RootState } from "../../../Redux/app/store";

const NotesPage = () => {
  const projectId = useParams().projectId;
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  const {
    data: notesResponse,
    isLoading,
    error,
  } = useGetAllNotesQuery({ projectId });

  const [createNote, { isLoading: isCreating }] = useCreateNoteMutation();
  const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();
  const [shareNote, { isLoading: isSharing }] = useShareNoteMutation();
  const [unShareNote, { isLoading: isUnsharing }] = useUnShareNoteMutation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"view" | "edit" | "create">("view");

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareNoteItem, setShareNoteItem] = useState<any>(null);

  const [unshareModalOpen, setUnshareModalOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const { data: singleNoteData } = useGetSingleNoteQuery(selectedNoteId!, {
    skip: !selectedNoteId,
  });

  const notes = notesResponse || [];
  console.log(notes);

  const openDrawer = (
    note: any = null,
    mode: "view" | "edit" | "create" = "create"
  ) => {
    setEditingNote(note);
    setViewMode(mode);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => setIsDrawerOpen(false);

  const handleFormSubmit = async (data: any) => {
    console.log("Form Data:", data);
    try {
      if (viewMode === "edit" && editingNote) {
        console.log("Editing Note:", editingNote);

        // ✅ Merge existing note for approved/rejected
        const payload =
          editingNote.status === "approved" || editingNote.status === "rejected"
            ? {
                adminComment: data.adminComment, // only update admin comment
              }
            : data; // normal update for pending notes

        console.log("Payload:", payload);
        await updateNote({ id: editingNote._id, data: payload }).unwrap();
        successAlert("Note updated successfully");
      } else if (viewMode === "create") {
        await createNote(data).unwrap();
        successAlert("Note created successfully");
      }
      closeDrawer();
    } catch (error) {
      console.error("Failed to save note:", error);
      errorAlert("Failed to save note");
    }
  };

  const handleDelete = async (noteId: string) => {
    showDeleteAlert({
      onConfirm: async () => {
        try {
          await deleteNote(noteId).unwrap();
          closeDrawer();
        } catch (err: any) {
          errorAlert(
            "Delete Error",
            err?.data?.message || "Failed to delete note"
          );
        }
      },
    });
  };

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
      successAlert("Note shared successfully");
      setShareModalOpen(false);
      setShareNoteItem(null);
    } catch (error) {
      errorAlert("Failed to share note");
    }
  };

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
      successAlert("Note unshared successfully");
      setUnshareModalOpen(false);
      setSelectedNoteId(null);
    } catch (error) {
      errorAlert("Failed to unshare note");
    }
  };

  if (error) return <div className="p-8 text-red-500">Error loading notes</div>;

  const stripHtml = (html: string) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  return (
    <div className="w-full  gap-4 bg-white min-h-screen p-6">
      {/* Header */}
      <div className="w-full flex justify-between  gap-8 py-10">
        <h1 className="text-2xl font-medium text-[#000E0F]">Notes</h1>
        <CustomCreateButton
          onClick={() => openDrawer(null, "create")}
          title="Create Note"
        />
      </div>

      {/* Loader while fetching notes */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {notes.map((note: any) => (
            <Col span={6} key={note._id}>
              <Card
                onClick={() => openDrawer(note, "view")}
                hoverable
                style={{
                  backgroundColor: "#f1f1f1",
                  // ✅ fixed height for consistency
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                bodyStyle={{
                  padding: "16px 12px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: 60,
                }}
                title={
                  <h3 className="text-lg font-medium text-gray-900 truncate w-[200px]">
                    {stripHtml(note.title)}
                  </h3>
                }
                extra={
                  <CustomViewMoreButton
                    items={[
                      { key: "view", label: "👁️ View" },
                      { key: "edit", label: "✏️ Edit " },

                      // ✅ Only show share/unshare if user is NOT basicAdmin
                      ...(userRole !== USER_ROLE.basicAdmin
                        ? [
                            { key: "share", label: "🔗 Share " },
                            {
                              key: "unshare",
                              label: (
                                <div className="flex items-center gap-1">
                                  <Unlink
                                    className="text-green-500"
                                    size={14}
                                  />
                                  Unshare
                                </div>
                              ),
                            },
                          ]
                        : []),
                      {
                        key: "delete",
                        label: "🗑️ Delete",
                        danger: true,
                      },

                      // { key: "view", label: "👁️ View" },
                      // { key: "edit", label: "✏️ Edit" },
                      // { key: "share", label: "🔗 Share" },
                      // {
                      //   key: "unshare",
                      //   label: (
                      //     <div className="flex items-center gap-1">
                      //       <Unlink className="text-green-500" size={14} />
                      //       Unshare Note
                      //     </div>
                      //   ),
                      // },
                      // { key: "delete", label: "🗑️ Delete", danger: true },
                    ]}
                    onClick={(key) => {
                      if (key === "view") openDrawer(note, "view");
                      if (key === "edit") openDrawer(note, "edit");
                      if (key === "delete") handleDelete(note._id);
                      if (key === "share") handleShareNote(note);
                      if (key === "unshare") handleUnShareNote(note._id);
                    }}
                  />
                }
              >
                <div className="flex justify-between items-center">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-black font-medium">
                      £ {note.value}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Calendar size={16} />
                      {new Date(note.date).toLocaleDateString()}
                    </div>
                  </div>

                  <div>
                    {note.status === "approved" && (
                      <span className="flex items-center gap-1 text-green-600 font-medium">
                        <CheckCircle size={16} /> Approved
                      </span>
                    )}
                    {note.status === "pending" && (
                      <span className="flex items-center gap-1 text-orange-500 font-medium">
                        <Clock size={16} /> Pending
                      </span>
                    )}
                    {note.status === "rejected" && (
                      <span className="flex items-center gap-1 text-red-600 font-medium">
                        <XCircle size={16} /> Rejected
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Drawer for Create/Edit/View */}
      <Drawer
        title={
          viewMode === "view"
            ? "View Note"
            : viewMode === "edit"
            ? "Edit Note"
            : "Create Note"
        }
        placement="right"
        closable
        onClose={closeDrawer}
        open={isDrawerOpen}
        width={600}
        destroyOnClose
      >
        <NoteForm
          mode={viewMode}
          isViewOnly={
            viewMode === "view" ||
            (editingNote &&
              editingNote.status !== "pending" &&
              viewMode === "edit")
          }
          closeDrawer={closeDrawer}
          creating={isCreating}
          updating={isUpdating}
          initialData={editingNote}
          onSave={handleFormSubmit}
          onDelete={
            viewMode === "edit" && editingNote
              ? () => handleDelete(editingNote._id)
              : undefined
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
          shareing={isSharing}
          title="Share this note"
          roles={[
            USER_ROLE.superAdmin,
            USER_ROLE.primeAdmin,
            USER_ROLE.basicAdmin,
            USER_ROLE.client,
          ]}
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
          unsharing={isUnsharing}
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
