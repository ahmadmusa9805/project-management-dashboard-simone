/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Upload } from "antd";
import { CloudUpload } from "lucide-react";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";

const { Dragger } = Upload;

interface TaskScheduleFormProps {
  entityName: string; // "Schedule" or "Task"
  mode: "create" | "edit";
  creating?: boolean;
  updating?: boolean;

  initialData?: {
    title?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    completed?: boolean;
    file?: File | null;
  } | null;
  onCancel: () => void;
  onSubmit: (formData: any) => void;
}

const TaskScheduleForm: React.FC<TaskScheduleFormProps> = ({
  entityName,
  creating,
  updating,
  mode,
  initialData = {},
  onCancel,
  onSubmit,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(
    initialData?.file || null
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      startDate: initialData?.startDate || "",
      endDate: initialData?.endDate || "",
      description: initialData?.description || "",
      completed: initialData?.completed || false,
      file: initialData?.file || null,
    },
  });

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setValue("file", file);
  };

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

      {/* File Upload */}
      <div>
        <label className="block text-xs font-semibold text-[#2B3738] mb-1 tracking-wide">
          File Attachment
        </label>
        <Controller
          name="file"
          control={control}
          render={({ field }) => (
            <Dragger
              name="file"
              multiple={false}
              beforeUpload={(file) => {
                field.onChange(file);
                handleFileChange(file);
                return false; // prevent auto upload
              }}
              onRemove={() => {
                field.onChange(null);
                setSelectedFile(null);
              }}
              fileList={
                field.value
                  ? [
                      {
                        uid: "-1",
                        name: field.value.name,
                        status: "done",
                      } as any,
                    ]
                  : []
              }
              accept=".jpg,.jpeg,.png,.pdf"
              style={{ padding: "16px" }}
            >
              <p className="text-center flex flex-col items-center">
                <CloudUpload size={24} color="#83ac72" strokeWidth={2.5} />
              </p>
              <p className="text-[#2B3738] text-base font-medium">
                {selectedFile
                  ? selectedFile.name
                  : "Click or drag file to upload"}
              </p>
              <p className="text-sm text-gray-500">
                Supports JPG, PNG, PDF up to 10MB
              </p>
            </Dragger>
          )}
        />
      </div>

      {/* Start & End Date – Always Visible */}
      {entityName === "Schedule" && (
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
      )}

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
      {mode === "edit" && entityName === "Task" && (
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
          <label className="text-[#000E0F] font-medium">
            Mark as Completed
          </label>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-4">
        <Button
          type="text"
          onClick={onCancel}
          className="px-6 py-2 cancel rounded font-medium tracking-wider"
        >
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          className="px-6 py-2 tracking-wider"
          loading={creating || updating}
        >
          {mode === "create" ? `Create ${entityName}` : `Update ${entityName}`}
        </Button>
      </div>
    </form>
  );
};

export default TaskScheduleForm;
