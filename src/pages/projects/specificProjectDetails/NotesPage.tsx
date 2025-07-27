import { useState } from "react";
import { Drawer } from "antd";
// Adjust path
import CustomCreateButton from "../../../components/CustomCreateButton";
import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
import NoteForm from "../../../components/NoteForm";

const NotesPage = () => {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Payment Note",
      content: "Kindly make sure the payment is completed...",
      extraDesc: "Extra cost: £524.99",
      date: "2025-10-12",
    },
  ]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);

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

  const handleFormSubmit = (formData: any) => {
    if (editingNote) {
      // Edit mode
      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingNote.id ? { ...note, ...formData } : note
        )
      );
    } else {
      // Create mode
      const newNote = {
        ...formData,
        id: Date.now(),
        date: formData.date || new Date().toISOString(),
      };
      setNotes((prev) => [...prev, newNote]);
    }

    closeDrawer();
  };

  return (
    <div className="w-full h-full p-8 bg-white flex flex-col items-end gap-8">
      <div className="w-full flex justify-between items-end gap-8">
        <h1 className="text-2xl font-medium text-[#000E0F]">My notes</h1>
        <CustomCreateButton onClick={openCreateDrawer} title="New Note" />
      </div>

      {/* Notes Grid */}
      <div className="w-full flex-1 flex flex-wrap gap-4 items-start">
        {notes.map((note) => (
          <div key={note.id} className="w-[183px] p-4 pr-2 bg-[#F1F1F1] border border-[#E6E7E7] rounded flex justify-between items-start">
            <div className="flex flex-col gap-2 w-full">
              <p className="text-[#2B3738] text-base leading-[1.4] h-[120px] font-normal">
                {note.content}
              </p>
              <p className="text-[#2B3738] text-sm font-medium leading-5">
                {note.extraDesc}
              </p>
              <p className="text-[#6B7374] text-sm font-normal leading-5">
                {note.date}
              </p>
            </div>
            <CustomViewMoreButton
              items={[
                { key: "edit", label: "✏️ Edit" },
                { key: "delete", label: "🗑️ Delete", danger: true },
              ]}
              onClick={(key) => {
                if (key === "edit") openEditDrawer(note);
                if (key === "delete") {
                  setNotes(notes.filter((n) => n.id !== note.id));
                }
              }}
            />
          </div>
        ))}
      </div>

      {/* Note Form Drawer */}
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
            editingNote
              ? () => {
                  setNotes(notes.filter((n) => n.id !== editingNote.id));
                  closeDrawer();
                }
              : undefined
          }
        />
      </Drawer>
    </div>
  );
};

export default NotesPage;
