/* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useEffect } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { Checkbox, DatePicker, Input } from "antd";
// import dayjs from "dayjs";
// import ToastEditor from "./ToastEditor";

// interface NoteFormProps {
//   mode: "create" | "edit";
//   initialData?: any;
//   onSave: (formData: any) => void;
//   onDelete?: () => void;
// }

// const NoteForm: React.FC<NoteFormProps> = ({ mode, initialData, onSave, onDelete }) => {
//   const {
//     register,
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
//       extraDesc: "",
//       value: "",
//       approved: false,
//       comment: "",
//       reply: "",
//     },
//   });

//   // Set initial values
//   useEffect(() => {
//     if (initialData) {
//       reset({
//         ...initialData,
//         date: initialData.date ? dayjs(initialData.date) : dayjs(),
//       });
//     }
//   }, [initialData, reset]);

//   const onSubmit = (data: any) => {
//     onSave({
//       ...data,
//       date: data.date.toISOString(), // format for saving
//     });
//   };

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="w-full h-full p-3 pb-6 bg-white  flex flex-col gap-4"
//     >
//       {/* Header */}
//       <div className="w-full h-12 border-b border-[#E6E7E7] px-4 py-2 flex justify-between items-center">
//         <div className="text-[#172B4D] text-[20px] font-bold">
//           {watch("date")?.format("ddd, DD MMM, YYYY")}
//         </div>
//       </div>

//       {/* Title */}
//       <div className="w-full px-4 flex flex-col gap-3">
//         <label className="text-[#2B3738] text-sm font-medium">Note Title</label>
//         <Controller
//   name="title"
//   control={control}
//   rules={{ required: "Title is required" }}
//   render={({ field }) => (
//     <Input {...field} placeholder="Enter note title..." />
//   )}
// />
// {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}

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

//       {/* Note Description */}
//       <div className="w-full px-4 flex flex-col gap-3">
//         <label className="text-[#2B3738] text-sm font-medium">Note Description</label>
//         <Controller
//           name="noteDesc"
//           control={control}
//           render={({ field }) => (
//             <ToastEditor initialValue={field.value} onChange={field.onChange} height="300px" />
//           )}
//         />
//       </div>

//       {/* Extra Cost Description */}
//       <div className="w-full px-4 flex flex-col gap-3">
//         <label className="text-[#2B3738] text-sm font-medium">Extra Cost Description</label>
//         <Controller
//           name="extraDesc"
//           control={control}
//           render={({ field }) => (
//             <ToastEditor initialValue={field.value} onChange={field.onChange} height="200px" />
//           )}
//         />
//       </div>

//       {/* Value */}
//       <div className="w-full px-4 flex flex-col gap-3">
//         <label className="text-[#2B3738] text-sm font-medium">Value</label>
//         <Input {...register("value")} placeholder="Enter value..." />
//       </div>

//       {/* Edit Only Section */}
//       {mode === "edit" && (
//         <>
//           <div className="w-full px-4 flex items-center gap-3">
//             <Controller
//               name="approved"
//               control={control}
//               render={({ field }) => (
//                 <Checkbox checked={field.value} onChange={e => field.onChange(e.target.checked)}>
//                   Approved
//                 </Checkbox>
//               )}
//             />
//           </div>

//           <div className="w-full px-4 flex flex-col gap-3">
//             <label className="text-[#2B3738] text-sm font-medium">Comment</label>
//             <Input.TextArea {...register("comment")} rows={2} />
//           </div>

//           <div className="w-full px-4 flex flex-col gap-3">
//             <label className="text-[#2B3738] text-sm font-medium">Reply</label>
//             <Input.TextArea {...register("reply")} rows={2} />
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
// import { useForm, Controller } from "react-hook-form";
// import { Checkbox, DatePicker, Input } from "antd";
// import dayjs from "dayjs";
// import ToastEditor from "./ToastEditor";
// import { useParams } from "react-router-dom";

// interface NoteFormProps {
//   mode: "create" | "edit";
//   initialData?: any;
//   onSave: (formData: any) => void;
//   onDelete?: () => void;
// }

// const NoteForm: React.FC<NoteFormProps> = ({
//   mode,
//   initialData,
//   onSave,
//   onDelete,
// }) => {
//   const projectId = useParams().projectId;
//   const {
//     register,
//     control,
//     handleSubmit,
//     reset,
//     watch,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       title: "",
//       date: dayjs(),
//       noteDesc: "", // maps -> description
//       value: "",
//       approved: false, // maps -> status
//       comment: "", // maps -> clientComment
//       reply: "", // maps -> adminComment
//       file: undefined as File | undefined, // Added proper file field for API compatibility
//     },
//   });

//   // Set initial values
//   useEffect(() => {
//     if (initialData) {
//       reset({
//         ...initialData,
//         noteDesc: initialData.description || "",
//         comment: initialData.clientComment || "",
//         reply: initialData.adminComment || "",
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

//     onSave({
//       projectId: projectId, // get from context/props if needed
//       title: data.title,
//       description: data.noteDesc,
//       file: selectedFile, // Pass actual File object for FormData
//       value: Number(data.value),
//       date: data.date.toISOString(),
//       clientComment: data.comment,
//       adminComment: data.reply,
//       status: data.approved ? "approved" : "pending",
//       isDeleted: false,
//     });
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

//       {/* Title */}
//       <div className="w-full px-4 flex flex-col gap-3">
//         <label className="text-[#2B3738] text-sm font-medium">Note Title</label>
//         <Controller
//           name="title"
//           control={control}
//           rules={{ required: "Title is required" }}
//           render={({ field }) => (
//             <Input {...field} placeholder="Enter note title..." />
//           )}
//         />
//         {errors.title && (
//           <span className="text-red-500 text-sm">{errors.title.message}</span>
//         )}
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

//       {/* Note Description */}
//       <div className="w-full px-4 flex flex-col gap-3">
//         <label className="text-[#2B3738] text-sm font-medium">
//           Note Description
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
//         <label className="text-[#2B3738] text-sm font-medium">
//           Attachment (optional)
//         </label>
//         <input
//           type="file"
//           accept="image/*,application/pdf,.doc,.docx"
//           className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//         />
//       </div>

//       {/* Value */}
//       <div className="w-full px-4 flex flex-col gap-3">
//         <label className="text-[#2B3738] text-sm font-medium">Value</label>
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
//             <Input.TextArea {...register("comment")} rows={2} />
//           </div>

//           <div className="w-full px-4 flex flex-col gap-3">
//             <label className="text-[#2B3738] text-sm font-medium">
//               Admin Reply
//             </label>
//             <Input.TextArea {...register("reply")} rows={2} />
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
// import { Checkbox, DatePicker, Input } from "antd";
// import ToastEditor from "./ToastEditor";

// interface NoteFormProps {
//   mode: "create" | "edit";
//   initialData?: any;
//   onSave: (formData: any) => void;
//   onDelete?: () => void;
// }

// const NoteForm: React.FC<NoteFormProps> = ({
//   mode,
//   initialData,
//   onSave,
//   onDelete,
// }) => {
//   const projectId = useParams().projectId;
//   const {
//     register,
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
//       file: selectedFile || null, // Ensure file is null instead of undefined
//       value: Number(data.value),
//       date: data.date.toISOString(),
//       clientComment: data.comment,
//       adminComment: data.reply,
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

//       {/* Title */}
//       <div className="w-full px-4 flex flex-col gap-3">
//         <label className="text-[#2B3738] text-sm font-medium">Note Title</label>
//         <Controller
//           name="title"
//           control={control}
//           rules={{ required: "Title is required" }}
//           render={({ field }) => (
//             <Input {...field} placeholder="Enter note title..." />
//           )}
//         />
//         {errors.title && (
//           <span className="text-red-500 text-sm">{errors.title.message}</span>
//         )}
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

//       {/* Note Description */}
//       <div className="w-full px-4 flex flex-col gap-3">
//         <label className="text-[#2B3738] text-sm font-medium">
//           Note Description
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
//         <label className="text-[#2B3738] text-sm font-medium">
//           Attachment (optional)
//         </label>
//         <input
//           type="file"
//           accept="image/*,application/pdf,.doc,.docx"
//           className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//         />
//       </div>

//       {/* Value */}
//       <div className="w-full px-4 flex flex-col gap-3">
//         <label className="text-[#2B3738] text-sm font-medium">Value</label>
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
//             <Input.TextArea {...register("clientComment")} rows={2} />
//           </div>

//           <div className="w-full px-4 flex flex-col gap-3">
//             <label className="text-[#2B3738] text-sm font-medium">
//               Admin Reply
//             </label>
//             <Input.TextArea {...register("adminComment")} rows={2} />
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

import type React from "react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { Checkbox, DatePicker, Input } from "antd";
import ToastEditor from "./ToastEditor";

interface NoteFormProps {
  mode: "create" | "edit";
  initialData?: any;
  onSave: (formData: any) => void;
  onDelete?: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({
  mode,
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
      approved: false,
      adminComment: "",
      clientComment: "",
      file: undefined as File | undefined,
    },
  });

  // Set initial values
  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        noteDesc: initialData.description || "",
        clientComment: initialData.clientComment || "",
        adminComment: initialData.adminComment || "",
        approved: initialData.status === "approved",
        date: initialData.date ? dayjs(initialData.date) : dayjs(),
      });
    }
  }, [initialData, reset]);

  const onSubmit = (data: any) => {
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const selectedFile = fileInput?.files?.[0];

    const formData = {
      projectId: projectId,
      title: data.title,
      description: data.noteDesc,
      file: selectedFile || "", // Ensure file is null instead of undefined
      value: Number(data.value),
      date: data.date.toISOString(),
      clientComment: data.clientComment,
      adminComment: data.adminComment,
      status: data.approved ? "approved" : "pending",
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
        {errors.title && (
          <span className="text-red-500 text-sm">{errors.title.message}</span>
        )}
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
        <label className="text-[#2B3738] text-sm font-medium">
          Note Description
        </label>
        <Controller
          name="noteDesc"
          control={control}
          render={({ field }) => (
            <ToastEditor
              initialValue={field.value}
              onChange={field.onChange}
              height="300px"
            />
          )}
        />
      </div>

      <div className="w-full px-4 flex flex-col gap-3">
        <label className="text-[#2B3738] text-sm font-medium">
          Attachment (optional)
        </label>
        <input
          type="file"
          accept="image/*,application/pdf,.doc,.docx"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* Value */}
      <div className="w-full px-4 flex flex-col gap-3">
        <label className="text-[#2B3738] text-sm font-medium">Value</label>
        <Controller
          name="value"
          control={control}
          rules={{ required: "Value is required" }}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              placeholder="Enter value..."
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        {errors.value && (
          <span className="text-red-500 text-sm">{errors.value.message}</span>
        )}
      </div>

      {/* Edit Only Section */}
      {mode === "edit" && (
        <>
          <div className="w-full px-4 flex items-center gap-3">
            <Controller
              name="approved"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                >
                  Approved
                </Checkbox>
              )}
            />
          </div>

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
                  placeholder="Enter client comment..."
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
                />
              )}
            />
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
