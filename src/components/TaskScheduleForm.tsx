import React from "react";
import { useForm, Controller } from "react-hook-form";

interface TaskScheduleFormProps {
  entityName: string; // "Schedule" or "Task"
  mode: "create" | "edit";
  initialData?: {
    title?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    completed?: boolean;
  } | null;
  onCancel: () => void;
  onSubmit: (formData: any) => void;
}

const TaskScheduleForm: React.FC<TaskScheduleFormProps> = ({
  entityName,
  mode,
  initialData = {},
  onCancel,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      startDate: initialData?.startDate || "",
      endDate: initialData?.endDate || "",
      description: initialData?.description || "",
      completed: initialData?.completed || false,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-2xl mx-auto p-6 bg-white flex flex-col gap-6"
    >
      <h2 className="text-2xl font-medium text-[#000E0F]">
        {mode === "create" ? `Create ${entityName}` : `Edit ${entityName}`}
      </h2>

      {/* Title */}
      <div>
        <label className="block text-xs font-semibold text-[#2B3738] mb-1 tracking-wide">
          Title
        </label>
        <Controller
          name="title"
          control={control}
          rules={{ required: "Title is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              placeholder={`${entityName} Title`}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          )}
        />
        {errors.title && (
          <p className="text-red-600 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Upload Placeholder */}
      <div className="w-full border-2 border-dashed border-gray-300 rounded px-4 py-6 flex flex-col justify-center items-center gap-4">
        <div className="w-6 h-6 relative">
          <div className="absolute w-[22px] h-[15px] left-[2px] top-[2px] bg-gray-500 rounded-sm"></div>
          <div className="absolute w-[2px] h-[11px] left-[11px] top-[11px] bg-gray-500"></div>
          <div className="absolute w-[10px] h-[6px] left-[7px] top-[11px] bg-gray-500"></div>
        </div>
        <p className="text-[#2B3738] text-base font-medium">
          Upload file or drag & drop here
        </p>
      </div>

      {/* Start & End Date – Always Visible */}
     {
      entityName==='Schedule'&&
       <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-[#2B3738] mb-1 tracking-wide">
            Start date
          </label>
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <input
                type="date"
                {...field}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            )}
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold text-[#2B3738] mb-1 tracking-wide">
            End date
          </label>
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <input
                type="date"
                {...field}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            )}
          />
        </div>
      </div>
     }

      {/* Description */}
      <div className="w-full">
        <label className="text-xl font-medium text-[#000E0F] mb-2 block">
          Description
        </label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              className="w-full h-24 border border-gray-300 rounded px-3 py-2 resize-none"
              placeholder="Description (optional)"
            />
          )}
        />
      </div>

      {/* Mark as Completed – Only in Edit */}
      {mode === "edit" && entityName==='Task'&& (
        <div className="flex items-center gap-2">
          <Controller
            name="completed"
            control={control}
            render={({ field: { value, onChange, ...rest } }) => (
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                className="w-4 h-4"
                {...rest}
              />
            )}
          />
          <label className="text-[#000E0F] font-medium">Mark as Completed</label>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-100 text-[#001D01] rounded font-medium tracking-wider"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-[#001D01] text-white rounded font-medium tracking-wider"
        >
          {mode === "create" ? `Create ${entityName}` : `Update ${entityName}`}
        </button>
      </div>
    </form>
  );
};

export default TaskScheduleForm;
