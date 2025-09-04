// import React, { useEffect } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { Input, Button, Drawer, Upload } from "antd";

// import { CloudUpload } from "lucide-react";

// const { Dragger } = Upload;

// type DocumentField = {
//   name: string;
//   label: string;
//   placeholder: string;
// };

// type DocumentFormProps = {
//   mode: "create" | "edit";
//   fields: DocumentField[];
//   defaultValues?: Record<string, any>;
//   onSubmit: (data: FormData) => void;
//   open: boolean;
//   onClose: () => void;
// };

// const ResuableDocumentForm: React.FC<DocumentFormProps> = ({
//   mode,
//   fields,
//   defaultValues = {},
//   onSubmit,
//   open,
//   onClose,
// }) => {
//   const { control, handleSubmit, reset } = useForm();

//   useEffect(() => {
//     reset(defaultValues);
//   }, [defaultValues, reset]);

//   const handleFormSubmit = (values: any) => {
//     onSubmit(values);
//   };

//   return (
//     <Drawer
//       title={mode === "create" ? "New Quote" : "Edit Quote"}
//       placement="right"
//       width={480}
//       onClose={onClose}
//       open={open}
//     >
//       <form
//         onSubmit={handleSubmit(handleFormSubmit)}
//         className="w-full flex flex-col items-start gap-3"
//       >
//         {fields.map((field) => (
//           <div key={field.name} className="w-full flex flex-col gap-2">
//             <label
//               htmlFor={field.name}
//               className="text-[#2B3738] text-xs font-medium leading-[15.6px] tracking-wide"
//             >
//               {field.label}
//             </label>
//             <Controller
//               name={field.name}
//               control={control}
//               render={({ field: controllerField }) => (
//                 <Input
//                   {...controllerField}
//                   id={field.name}
//                   placeholder={field.placeholder}
//                   className="w-full px-2 py-3 border border-[#000E0F1A] rounded outline-none"
//                 />
//               )}
//             />
//           </div>
//         ))}

//         <div className="w-full flex flex-col gap-2">
//           <label className="text-[#2B3738] text-xs font-medium">
//             Upload File (PDF only)
//           </label>
//           <Controller
//             control={control}
//             name="file" // ✅ Correct field name for backend
//             render={({ field }) => (
//               <Dragger
//                 accept=".pdf"
//                 beforeUpload={() => false}
//                 multiple={false}
//                 onChange={(info) => field.onChange(info.file)}
//                 fileList={field.value ? [field.value] : []}
//                 onRemove={() => field.onChange(undefined)}
//               >
//                 <p className="text-center flex flex-col items-center">
//                   <CloudUpload size={24} color="#83ac72" strokeWidth={2.5} />
//                 </p>
//                 <p className="text-[10px]">Click or drag PDF to upload</p>
//               </Dragger>
//             )}
//           />
//         </div>

//         <div className="w-full border-t border-[#E6E7E7]" />

//         <div className="w-full flex justify-start gap-3 mt-4">
//           <Button
//             onClick={onClose}
//             className="flex-1 h-12 px-6 bg-[#172B4D0F] rounded text-[#001D01] text-base font-medium leading-6 tracking-wide"
//           >
//             Cancel
//           </Button>
//           <Button
//             htmlType="submit"
//             type="primary"
//             className="flex-1 h-12 px-6 bg-[#001D01] rounded text-white text-base font-medium leading-6 tracking-wide"
//           >
//             {mode === "create" ? "Create" : "Update"}
//           </Button>
//         </div>
//       </form>
//     </Drawer>
//   );
// };

// export default ResuableDocumentForm;

/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: clean above code after review
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Drawer, Upload, Select } from "antd";
import { CloudUpload } from "lucide-react";

const { Dragger } = Upload;
const { Option } = Select;

type DocumentField = {
  name: string;
  label: string;
  placeholder: string;
  type?: "text" | "select";
  options?: { label: string; value: any }[];
  disabled?: boolean;
  rules?: Record<string, any>;
};

type DocumentFormProps = {
  mode: "create" | "edit";
  title?: string;
  creating?: boolean;
  updating?: boolean;
  fields: DocumentField[];
  defaultValues?: Record<string, any>;
  onSubmit: (data: any) => void;
  open: boolean;
  onClose: () => void;
};

const ResuableDocumentForm: React.FC<DocumentFormProps> = ({
  title,
  mode,
  fields,
  creating,
  updating,
  defaultValues = {},
  onSubmit,
  open,
  onClose,
}) => {
  // validation trigger on blur
  const { control, handleSubmit, reset } = useForm({ mode: "onBlur" });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const handleFormSubmit = (values: any) => {
    onSubmit(values);
  };

  return (
    <Drawer
      title={`${title} ${mode === "create" ? "Create" : "Update"}`}
      placement="right"
      width={480}
      onClose={onClose}
      open={open}
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="w-full flex flex-col items-start gap-3"
      >
        {fields.map((field) => (
          <div key={field.name} className="w-full flex flex-col gap-2">
            <label
              htmlFor={field.name}
              className="text-[#2B3738] text-xs font-medium leading-[15.6px] tracking-wide"
            >
              {field.label}
            </label>
            <Controller
              name={field.name}
              control={control}
              // ✅ default required validation if no rules provided
              rules={field.rules ?? { required: `${field.label} is required` }}
              render={({ field: controllerField, fieldState }) => (
                <>
                  {field.type === "select" && field.options ? (
                    <Select
                      {...controllerField}
                      id={field.name}
                      placeholder={field.placeholder}
                      disabled={field.disabled}
                      className="w-full"
                      size="middle"
                      onChange={(value) => controllerField.onChange(value)}
                      value={controllerField.value}
                      status={fieldState.error ? "error" : ""}
                    >
                      {field.options.map((opt) => (
                        <Option key={opt.value} value={opt.value}>
                          {opt.label}
                        </Option>
                      ))}
                    </Select>
                  ) : (
                    <Input
                      {...controllerField}
                      id={field.name}
                      placeholder={field.placeholder}
                      className="w-full px-2 py-3 border rounded outline-none"
                      disabled={field.disabled}
                      status={fieldState.error ? "error" : ""}
                    />
                  )}
                  {fieldState.error && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        ))}

        <div className="w-full flex flex-col gap-2">
          <label className="text-[#2B3738] text-xs font-medium">
            Upload File (PDF only)
          </label>
          <Controller
            control={control}
            name="file"
            rules={
              mode === "create"
                ? { required: "File is required" } // ✅ Required only when creating
                : {} // ✅ Optional when editing
            }
            render={({ field, fieldState }) => (
              <>
                <Dragger
                  accept=".pdf"
                  beforeUpload={() => false}
                  multiple={false}
                  // ✅ keep existing file if in edit mode
                  onChange={(info) => field.onChange(info.file)}
                  fileList={
                    field.value
                      ? [field.value]
                      : defaultValues.file
                      ? [defaultValues.file]
                      : []
                  }
                  onRemove={() => field.onChange(undefined)}
                  style={{
                    border: fieldState.error
                      ? "1px dashed #ff4d4f"
                      : "1px dashed #d9d9d9",
                  }}
                >
                  <p className="text-center flex flex-col items-center">
                    <CloudUpload size={24} color="#83ac72" strokeWidth={2.5} />
                  </p>
                  <p className="text-[10px]">Click or drag PDF to upload</p>
                </Dragger>
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>

        <div className="w-full border-t border-[#E6E7E7]" />

        <div className="w-full flex justify-start gap-3 mt-4">
          <Button
            onClick={onClose}
            type="text"
            className="flex-1 h-12 px-6  rounded text-base font-medium cancel leading-6 tracking-wide"
          >
            Cancel
          </Button>
          <Button
            htmlType="submit"
            type="primary"
            className="flex-1 h-12 px-6 bg-[#001D01] rounded text-white text-base font-medium leading-6 tracking-wide"
            loading={creating || updating}
          >
            {mode === "create" ? "Create" : "Update"}
          </Button>
        </div>
      </form>
    </Drawer>
  );
};

export default ResuableDocumentForm;
