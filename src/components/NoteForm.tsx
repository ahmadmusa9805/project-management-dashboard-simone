/* eslint-disable @typescript-eslint/no-explicit-any */

// import type React from "react";
// import { useEffect } from "react";
// import { Controller, useForm } from "react-hook-form";
// import dayjs from "dayjs";
// import { useParams } from "react-router-dom";
// import { Checkbox, DatePicker, Input } from "antd";
// import ToastEditor from "./ToastEditor";
// import Dragger from "antd/es/upload/Dragger";
// import { CloudUpload } from "lucide-react";

// interface NoteFormProps {
//   mode: "create" | "edit";
//   initialData?: any;
//   closeDrawer?: () => void;
//   creating: boolean;
//   updating: boolean;
//   onSave: (formData: any) => void;
//   onDelete?: () => void;
// }

// const NoteForm: React.FC<NoteFormProps> = ({
//   // closeDrawer,
//   // creating,
//   // updating,
//   mode,
//   initialData,
//   onSave,
//   onDelete,
// }) => {
//   const projectId = useParams().projectId;
//   const {
//     control,
//     handleSubmit,
//     reset,
//     watch,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       title: "",
//       date: dayjs(),
//       noteDesc: "",
//       value: "",
//       approved: false,
//       adminComment: "",
//       clientComment: "",
//       file: undefined as File | undefined,
//     },
//   });

//   // Set initial values
//   useEffect(() => {
//     if (initialData) {
//       reset({
//         ...initialData,
//         noteDesc: initialData.description || "",
//         clientComment: initialData.clientComment || "",
//         adminComment: initialData.adminComment || "",
//         approved: initialData.status === "approved",
//         date: initialData.date ? dayjs(initialData.date) : dayjs(),
//       });
//     }
//   }, [initialData, reset]);

//   const onSubmit = (data: any) => {
//     const fileInput = document.querySelector(
//       'input[type="file"]'
//     ) as HTMLInputElement;
//     const selectedFile = fileInput?.files?.[0];

//     const formData = {
//       projectId: projectId,
//       title: data.title,
//       description: data.noteDesc,
//       file: selectedFile || "", // Ensure file is null instead of undefined
//       value: Number(data.value),
//       date: data.date.toISOString(),
//       clientComment: data.clientComment,
//       adminComment: data.adminComment,
//       status: data.approved ? "approved" : "pending",
//       isDeleted: false,
//     };

//     console.log("Form Data:", formData);
//     onSave(formData);
//   };

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="w-full h-full p-3 pb-6 bg-white flex flex-col gap-4"
//     >
//       {/* Header */}
//       <div className="w-full h-12 border-b border-[#E6E7E7] px-4 py-2 flex justify-between items-center">
//         <div className="text-[#172B4D] text-[20px] font-bold">
//           {watch("date")?.format("ddd, DD MMM, YYYY")}
//         </div>
//       </div>
//       {/* Date */}
//       <div className="w-full px-4 flex flex-col gap-3">
//         <label className="text-[#2B3738] text-sm font-medium">Date</label>
//         <Controller
//           control={control}
//           name="date"
//           render={({ field }) => (
//             <DatePicker {...field} format="YYYY-MM-DD" className="w-full" />
//           )}
//         />
//       </div>

//       {/* Title */}
//       <div className="w-full px-4 flex flex-col gap-3">
//         <label className="text-[#2B3738] text-sm font-medium">Notes</label>
//         <Controller
//           name="title"
//           control={control}
//           render={({ field }) => (
//             <ToastEditor
//               initialValue={field.value}
//               onChange={field.onChange}
//               height="300px"
//             />
//           )}
//         />
//       </div>

//       {/* Note Description */}
//       <div className="w-full px-4 flex flex-col gap-3">
//         <label className="text-[#2B3738] text-sm font-medium">
//           Extra cost Description
//         </label>
//         <Controller
//           name="noteDesc"
//           control={control}
//           render={({ field }) => (
//             <ToastEditor
//               initialValue={field.value}
//               onChange={field.onChange}
//               height="300px"
//             />
//           )}
//         />
//       </div>

//       <div className="w-full px-4 flex flex-col gap-3">
//         <Controller
//           control={control}
//           name="file"
//           render={({ field }) => (
//             <div className="flex flex-col gap-1">
//               <label className="font-medium">Upload File</label>
//               <Dragger
//                 name="file"
//                 accept=".pdf"
//                 beforeUpload={(file) => {
//                   field.onChange(file);
//                   return false;
//                 }}
//                 multiple={false}
//                 fileList={
//                   field.value
//                     ? [
//                         {
//                           uid:
//                             (field.value as any).uid ||
//                             field.value.name ||
//                             `${Date.now()}`,
//                           name: field.value.name,
//                           status: "done" as const,
//                           originFileObj: field.value,
//                           lastModified: field.value.lastModified,
//                           lastModifiedDate:
//                             (field.value as any).lastModifiedDate || new Date(),
//                           size: field.value.size,
//                           type: field.value.type,
//                           percent: 100,
//                         } as any, // Cast to UploadFile to satisfy type checker
//                       ]
//                     : []
//                 }
//                 onRemove={() => field.onChange(undefined)}
//                 style={{ padding: "8px" }}
//               >
//                 <p className="text-center flex flex-col items-center">
//                   <CloudUpload size={24} color="#83ac72" strokeWidth={2.5} />
//                 </p>
//                 <p className="text-[10px]">Click or drag file to upload</p>
//               </Dragger>
//             </div>
//           )}
//         />
//       </div>

//       {/* Value */}
//       <div className="w-full px-4 flex flex-col gap-3">
//         <label className="text-[#2B3738] text-sm font-medium">Extra Cost</label>
//         <Controller
//           name="value"
//           control={control}
//           rules={{ required: "Value is required" }}
//           render={({ field }) => (
//             <Input
//               {...field}
//               type="number"
//               placeholder="Enter value..."
//               onChange={(e) => field.onChange(e.target.value)}
//             />
//           )}
//         />
//         {errors.value && (
//           <span className="text-red-500 text-sm">{errors.value.message}</span>
//         )}
//       </div>

//       {/* Edit Only Section */}
//       {mode === "edit" && (
//         <>
//           <div className="w-full px-4 flex items-center gap-3">
//             <Controller
//               name="approved"
//               control={control}
//               render={({ field }) => (
//                 <Checkbox
//                   checked={field.value}
//                   onChange={(e) => field.onChange(e.target.checked)}
//                 >
//                   Approved
//                 </Checkbox>
//               )}
//             />
//           </div>

//           <div className="w-full px-4 flex flex-col gap-3">
//             <label className="text-[#2B3738] text-sm font-medium">
//               Client Comment
//             </label>
//             <Controller
//               name="clientComment"
//               control={control}
//               render={({ field }) => (
//                 <Input.TextArea
//                   {...field}
//                   rows={2}
//                   placeholder="Enter client comment..."
//                 />
//               )}
//             />
//           </div>

//           <div className="w-full px-4 flex flex-col gap-3">
//             <label className="text-[#2B3738] text-sm font-medium">
//               Admin Reply
//             </label>
//             <Controller
//               name="adminComment"
//               control={control}
//               render={({ field }) => (
//                 <Input.TextArea
//                   {...field}
//                   rows={2}
//                   placeholder="Enter admin reply..."
//                 />
//               )}
//             />
//           </div>
//         </>
//       )}

//       {/* Footer Buttons */}
//       <div className="w-full px-4 flex gap-4 justify-end mt-4">
//         {mode === "edit" && onDelete && (
//           <button
//             type="button"
//             onClick={onDelete}
//             className="px-6 py-2 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-50"
//           >
//             Delete Note
//           </button>
//         )}
//         <button
//           type="submit"
//           className="px-6 py-2 bg-[#001D01] text-white text-sm font-medium rounded hover:bg-[#003F03]"
//         >
//           Save Note
//         </button>
//       </div>
//     </form>
//   );
// };

// export default NoteForm;

// import type React from "react";
// import { useEffect } from "react";
// import { Controller, useForm } from "react-hook-form";
// import dayjs from "dayjs";
// import { useParams } from "react-router-dom";
// import { DatePicker, Input } from "antd";
// import ToastEditor from "./ToastEditor";
// import Dragger from "antd/es/upload/Dragger";
// import { CloudUpload } from "lucide-react";

// interface NoteFormProps {
//   mode: "create" | "edit";
//   isViewOnly?: boolean;
//   initialData?: any;
//   closeDrawer?: () => void;
//   creating: boolean;
//   updating: boolean;
//   onSave: (formData: any) => void;
//   onDelete?: () => void;
// }

// const NoteForm: React.FC<NoteFormProps> = ({
//   mode,
//   isViewOnly = false,
//   initialData,
//   onSave,
//   onDelete,
// }) => {
//   const projectId = useParams().projectId;
//   const {
//     control,
//     handleSubmit,
//     reset,
//     watch,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       title: "",
//       date: dayjs(),
//       noteDesc: "",
//       value: "",
//       adminComment: "",
//       clientComment: "",
//       file: undefined as File | undefined,
//     },
//   });

//   // Reset form when initialData changes
//   useEffect(() => {
//     if (initialData) {
//       reset({
//         ...initialData,
//         noteDesc: initialData.description || "",
//         clientComment: initialData.clientComment || "",
//         adminComment: initialData.adminComment || "",
//         date: initialData.date ? dayjs(initialData.date) : dayjs(),
//         file: initialData.file || undefined,
//       });
//     }
//   }, [initialData, reset]);

//   const onSubmit = (data: any) => {
//     const formData = {
//       projectId,
//       title: data.title,
//       description: data.noteDesc,
//       file: data.file || "", // use field value
//       value: Number(data.value),
//       date: data.date.toISOString(),
//       clientComment: data.clientComment,
//       adminComment: data.adminComment,
//       status: initialData?.status || "pending",
//       isDeleted: false,
//     };

//     console.log("Form Data:", formData);
//     onSave(formData);
//   };

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="w-full h-full p-3 pb-6 bg-white flex flex-col gap-4"
//     >
//       {/* Header */}
//       <div className="w-full h-12 border-b border-[#E6E7E7] px-4 py-2 flex justify-between items-center">
//         <div className="text-[#172B4D] text-[20px] font-bold">
//           {watch("date")?.format("ddd, DD MMM, YYYY")}
//         </div>
//       </div>

//       {/* Date */}
//       <div className="w-full px-4 flex flex-col gap-3">
//         <label className="text-[#2B3738] text-sm font-medium">Date</label>
//         <Controller
//           control={control}
//           name="date"
//           render={({ field }) => (
//             <DatePicker
//               {...field}
//               format="YYYY-MM-DD"
//               className="w-full"
//               disabled={isViewOnly}
//             />
//           )}
//         />
//       </div>

//       {/* Title */}
//       <div className="w-full px-4 flex flex-col gap-3">
//         <label className="text-[#2B3738] text-sm font-medium">Notes</label>
//         <Controller
//           name="title"
//           control={control}
//           render={({ field }) => (
//             <ToastEditor
//               initialValue={field.value}
//               onChange={field.onChange}
//               height="300px"
//               readOnly={isViewOnly}
//             />
//           )}
//         />
//       </div>

//       {/* Description */}
//       <div className="w-full px-4 flex flex-col gap-3">
//         <label className="text-[#2B3738] text-sm font-medium">
//           Extra cost Description
//         </label>
//         <Controller
//           name="noteDesc"
//           control={control}
//           render={({ field }) => (
//             <ToastEditor
//               initialValue={field.value}
//               onChange={field.onChange}
//               height="300px"
//               readOnly={isViewOnly}
//             />
//           )}
//         />
//       </div>

//       {/* File Upload */}
//       <div className="w-full px-4 flex flex-col gap-3">
//         <Controller
//           control={control}
//           name="file"
//           render={({ field }) => (
//             <div className="flex flex-col gap-1">
//               <label className="font-medium">Upload File</label>
//               <Dragger
//                 disabled={isViewOnly}
//                 name="file"
//                 accept=".pdf"
//                 beforeUpload={(file) => {
//                   field.onChange(file);
//                   return false;
//                 }}
//                 multiple={false}
//                 fileList={
//                   field.value
//                     ? [
//                         {
//                           uid: (field.value as any).uid || field.value.name,
//                           name: field.value.name,
//                           status: "done" as const,
//                           originFileObj: field.value,
//                         } as any,
//                       ]
//                     : []
//                 }
//                 onRemove={() => field.onChange(undefined)}
//                 style={{ padding: "8px" }}
//               >
//                 <p className="text-center flex flex-col items-center">
//                   <CloudUpload size={24} color="#83ac72" strokeWidth={2.5} />
//                 </p>
//                 <p className="text-[10px]">Click or drag file to upload</p>
//               </Dragger>
//             </div>
//           )}
//         />
//       </div>

//       {/* Value */}
//       <div className="w-full px-4 flex flex-col gap-3">
//         <label className="text-[#2B3738] text-sm font-medium">Extra Cost</label>
//         <Controller
//           name="value"
//           control={control}
//           rules={{ required: "Value is required" }}
//           render={({ field }) => (
//             <Input
//               {...field}
//               type="number"
//               placeholder="Enter value..."
//               disabled={isViewOnly}
//               onChange={(e) => field.onChange(e.target.value)}
//             />
//           )}
//         />
//         {errors.value && (
//           <span className="text-red-500 text-sm">{errors.value.message}</span>
//         )}
//       </div>

//       {/* Client + Admin Comments */}
//       {mode === "edit" && (
//         <>
//           <div className="w-full px-4 flex flex-col gap-3">
//             <label className="text-[#2B3738] text-sm font-medium">
//               Client Comment
//             </label>
//             <Controller
//               name="clientComment"
//               control={control}
//               render={({ field }) => (
//                 <Input.TextArea
//                   {...field}
//                   rows={2}
//                   readOnly
//                   placeholder="Client comment..."
//                 />
//               )}
//             />
//           </div>

//           <div className="w-full px-4 flex flex-col gap-3">
//             <label className="text-[#2B3738] text-sm font-medium">
//               Admin Reply
//             </label>
//             <Controller
//               name="adminComment"
//               control={control}
//               render={({ field }) => (
//                 <Input.TextArea
//                   {...field}
//                   rows={2}
//                   placeholder="Enter admin reply..."
//                   disabled={isViewOnly}
//                 />
//               )}
//             />
//           </div>
//         </>
//       )}

//       {/* Footer */}
//       <div className="w-full px-4 flex gap-4 justify-end mt-4">
//         {mode === "edit" && onDelete && (
//           <button
//             type="button"
//             onClick={onDelete}
//             className="px-6 py-2 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-50"
//           >
//             Delete Note
//           </button>
//         )}
//         <button
//           type="submit"
//           className="px-6 py-2 bg-[#001D01] text-white text-sm font-medium rounded hover:bg-[#003F03]"
//         >
//           Save Note
//         </button>
//       </div>
//     </form>
//   );
// };

// export default NoteForm;

import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { DatePicker, Input } from "antd";
import ToastEditor from "./ToastEditor";
import Dragger from "antd/es/upload/Dragger";
import { CloudUpload } from "lucide-react";

interface NoteFormProps {
  mode: "create" | "edit";
  isViewOnly?: boolean;
  initialData?: any;
  closeDrawer?: () => void;
  creating: boolean;
  updating: boolean;
  onSave: (formData: any) => void;
  onDelete?: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({
  mode,
  isViewOnly = false,
  initialData,
  onSave,
  onDelete,
}) => {
  const projectId = useParams().projectId;
  const {
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
      value: "",
      adminComment: "",
      clientComment: "",
      file: undefined as File | undefined,
    },
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        noteDesc: initialData.description || "",
        clientComment: initialData.clientComment || "",
        adminComment: initialData.adminComment || "",
        value: initialData.value || "",
        date: initialData.date ? dayjs(initialData.date) : dayjs(),
        file: initialData.file || undefined,
      });
    }
  }, [initialData, reset]);

  const onSubmit = (data: any) => {
    let fileData: string | File | undefined = data.file;

    // If editing and the file is an object (new upload), handle differently
    if (data.file && typeof data.file !== "string" && "name" in data.file) {
      // This is a new File object
      fileData = data.file;
    } else if (initialData?.file && !data.file) {
      // Keep old file (string) if no new file uploaded
      fileData = initialData.file;
    }

    const formData = {
      projectId,
      title: data.title,
      description: data.noteDesc,
      file: fileData, // ✅ now correct type (string OR new file)
      value: Number(data.value),
      date: data.date.toISOString(),
      clientComment: data.clientComment,
      adminComment: data.adminComment,
      status: initialData?.status || "pending",
      isDeleted: false,
    };

    console.log("Form Data:", formData);
    onSave(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full p-3 pb-6 bg-white flex flex-col gap-4"
    >
      {/* Header */}
      <div className="w-full h-12 border-b border-[#E6E7E7] px-4 py-2 flex justify-between items-center">
        <div className="text-[#172B4D] text-[20px] font-bold">
          {watch("date")?.format("ddd, DD MMM, YYYY")}
        </div>
      </div>

      {/* Date */}
      <div className="w-full px-4 flex flex-col gap-3">
        <label className="text-[#2B3738] text-sm font-medium">Date</label>
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <DatePicker
              {...field}
              format="YYYY-MM-DD"
              className="w-full"
              disabled={isViewOnly}
            />
          )}
        />
      </div>

      {/* Title */}
      <div className="w-full px-4 flex flex-col gap-3">
        <label className="text-[#2B3738] text-sm font-medium">Notes</label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <ToastEditor
              value={field.value} // use value instead of initialValue
              onChange={field.onChange}
              height="300px"
              readOnly={isViewOnly}
              key={initialData?.id || "title"} // force remount on edit
            />
          )}
        />
      </div>

      {/* Description */}
      <div className="w-full px-4 flex flex-col gap-3 mb-5">
        <label className="text-[#2B3738] text-sm font-medium">
          Extra cost Description
        </label>
        <Controller
          name="noteDesc"
          control={control}
          render={({ field }) => (
            <ToastEditor
              value={field.value} // use value instead of initialValue
              onChange={field.onChange}
              height="300px"
              readOnly={isViewOnly}
              key={initialData?.id || "desc"} // force remount on edit
            />
          )}
        />
      </div>

      {/* File Upload */}
      <div className="w-full px-4 flex flex-col gap-3 mt-2">
        <Controller
          control={control}
          name="file"
          render={({ field }) => (
            <div className="flex flex-col gap-1">
              <label className="font-medium ">Upload File</label>
              <Dragger
                disabled={isViewOnly}
                name="file"
                accept=".pdf"
                beforeUpload={(file) => {
                  field.onChange(file);
                  return false;
                }}
                multiple={false}
                fileList={
                  field.value
                    ? [
                        {
                          uid: (field.value as any).uid || field.value.name,
                          name: field.value.name,
                          status: "done" as const,
                          originFileObj: field.value,
                        } as any,
                      ]
                    : []
                }
                onRemove={() => field.onChange(undefined)}
                style={{ padding: "8px" }}
              >
                <p className="text-center flex flex-col items-center">
                  <CloudUpload size={24} color="#83ac72" strokeWidth={2.5} />
                </p>
                <p className="text-[10px]">Click or drag file to upload</p>
              </Dragger>
            </div>
          )}
        />
      </div>

      {/* Value */}
      <div className="w-full px-4 flex flex-col gap-3">
        <label className="text-[#2B3738] text-sm font-medium">Extra Cost</label>
        <Controller
          name="value"
          control={control}
          rules={{ required: "Value is required" }}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              placeholder="Enter value..."
              disabled={isViewOnly}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        {errors.value && (
          <span className="text-red-500 text-sm">{errors.value.message}</span>
        )}
      </div>

      {/* Client + Admin Comments */}
      {mode === "edit" && (
        <>
          <div className="w-full px-4 flex flex-col gap-3">
            <label className="text-[#2B3738] text-sm font-medium">
              Client Comment
            </label>
            <Controller
              name="clientComment"
              control={control}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  rows={2}
                  readOnly
                  placeholder="Client comment..."
                />
              )}
            />
          </div>

          <div className="w-full px-4 flex flex-col gap-3">
            <label className="text-[#2B3738] text-sm font-medium">
              Admin Reply
            </label>
            <Controller
              name="adminComment"
              control={control}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  rows={2}
                  placeholder="Enter admin reply..."
                  disabled={isViewOnly}
                />
              )}
            />
          </div>
        </>
      )}

      {/* Footer */}
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
