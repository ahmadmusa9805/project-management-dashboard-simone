import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Checkbox, DatePicker, Input } from "antd";
import dayjs from "dayjs";
import ToastEditor from "./ToastEditor";

interface NoteFormProps {
  mode: "create" | "edit";
  initialData?: any;
  onSave: (formData: any) => void;
  onDelete?: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ mode, initialData, onSave, onDelete }) => {
  const {
    register,
    control,
    handleSubmit,
   
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      date: dayjs(),
      noteDesc: "",
      extraDesc: "",
      value: "",
      approved: false,
      comment: "",
      reply: "",
    },
  });

  // Set initial values
  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        date: initialData.date ? dayjs(initialData.date) : dayjs(),
      });
    }
  }, [initialData, reset]);

  const onSubmit = (data: any) => {
    onSave({
      ...data,
      date: data.date.toISOString(), // format for saving
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full p-3 pb-6 bg-white  flex flex-col gap-4"
    >
      {/* Header */}
      <div className="w-full h-12 border-b border-[#E6E7E7] px-4 py-2 flex justify-between items-center">
        <div className="text-[#172B4D] text-[20px] font-bold">
          {watch("date")?.format("ddd, DD MMM, YYYY")}
        </div>
      </div>

      {/* Title */}
      <div className="w-full px-4 flex flex-col gap-3">
        <label className="text-[#2B3738] text-sm font-medium">Note Title</label>
        <Controller
  name="title"
  control={control}
  rules={{ required: "Title is required" }}
  render={({ field }) => (
    <Input {...field} placeholder="Enter note title..." />
  )}
/>
{errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}

      </div>

      {/* Date */}
      <div className="w-full px-4 flex flex-col gap-3">
        <label className="text-[#2B3738] text-sm font-medium">Date</label>
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <DatePicker {...field} format="YYYY-MM-DD" className="w-full" />
          )}
        />
      </div>

      {/* Note Description */}
      <div className="w-full px-4 flex flex-col gap-3">
        <label className="text-[#2B3738] text-sm font-medium">Note Description</label>
        <Controller
          name="noteDesc"
          control={control}
          render={({ field }) => (
            <ToastEditor initialValue={field.value} onChange={field.onChange} height="300px" />
          )}
        />
      </div>

      {/* Extra Cost Description */}
      <div className="w-full px-4 flex flex-col gap-3">
        <label className="text-[#2B3738] text-sm font-medium">Extra Cost Description</label>
        <Controller
          name="extraDesc"
          control={control}
          render={({ field }) => (
            <ToastEditor initialValue={field.value} onChange={field.onChange} height="200px" />
          )}
        />
      </div>

      {/* Value */}
      <div className="w-full px-4 flex flex-col gap-3">
        <label className="text-[#2B3738] text-sm font-medium">Value</label>
        <Input {...register("value")} placeholder="Enter value..." />
      </div>

      {/* Edit Only Section */}
      {mode === "edit" && (
        <>
          <div className="w-full px-4 flex items-center gap-3">
            <Controller
              name="approved"
              control={control}
              render={({ field }) => (
                <Checkbox checked={field.value} onChange={e => field.onChange(e.target.checked)}>
                  Approved
                </Checkbox>
              )}
            />
          </div>

          <div className="w-full px-4 flex flex-col gap-3">
            <label className="text-[#2B3738] text-sm font-medium">Comment</label>
            <Input.TextArea {...register("comment")} rows={2} />
          </div>

          <div className="w-full px-4 flex flex-col gap-3">
            <label className="text-[#2B3738] text-sm font-medium">Reply</label>
            <Input.TextArea {...register("reply")} rows={2} />
          </div>
        </>
      )}

      {/* Footer Buttons */}
      <div className="w-full px-4 flex gap-4 justify-end mt-4">
        {mode === "edit" && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="px-6 py-2 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-50"
          >
            Delete Note
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 bg-[#001D01] text-white text-sm font-medium rounded hover:bg-[#003F03]"
        >
          Save Note
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
