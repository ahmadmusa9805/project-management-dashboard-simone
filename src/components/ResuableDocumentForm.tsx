

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Drawer, Upload } from "antd";

import { CloudUpload } from "lucide-react";

const { Dragger } = Upload;

type DocumentField = {
  name: string;
  label: string;
  placeholder: string;
};

type DocumentFormProps = {
  mode: "create" | "edit";
  fields: DocumentField[];
  defaultValues?: Record<string, any>;
  onSubmit: (data: FormData) => void;
  open: boolean;
  onClose: () => void;
};

const ResuableDocumentForm: React.FC<DocumentFormProps> = ({
  mode,
  fields,
  defaultValues = {},
  onSubmit,
  open,
  onClose,
}) => {
 const { control, handleSubmit, reset } = useForm();

 useEffect(() => {
  reset(defaultValues);
}, [defaultValues, reset]);

  const handleFormSubmit = (values: any) => {
  

    onSubmit(values);
  };

  return (
    <Drawer
      title={mode === "create" ? "New Quote" : "Edit Quote"}
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
              render={({ field: controllerField }) => (
                <Input
                  {...controllerField}
                  id={field.name}
                  placeholder={field.placeholder}
                  className="w-full px-2 py-3 border border-[#000E0F1A] rounded outline-none"
                />
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
  name="file" // ✅ Correct field name for backend
  render={({ field }) => (
    <Dragger
      accept=".pdf"
      beforeUpload={() => false}
      multiple={false}
      onChange={(info) => field.onChange(info.file)}
      fileList={field.value ? [field.value] : []}
      onRemove={() => field.onChange(undefined)}
    >
      <p className="text-center flex flex-col items-center">
        <CloudUpload size={24} color="#83ac72" strokeWidth={2.5} />
      </p>
      <p className="text-[10px]">Click or drag PDF to upload</p>
    </Dragger>
  )}
/>

        </div>

        <div className="w-full border-t border-[#E6E7E7]" />

        <div className="w-full flex justify-start gap-3 mt-4">
          <Button
            onClick={onClose}
            className="flex-1 h-12 px-6 bg-[#172B4D0F] rounded text-[#001D01] text-base font-medium leading-6 tracking-wide"
          >
            Cancel
          </Button>
          <Button
            htmlType="submit"
            type="primary"
            className="flex-1 h-12 px-6 bg-[#001D01] rounded text-white text-base font-medium leading-6 tracking-wide"
          >
            {mode === "create" ? "Create" : "Update"}
          </Button>
        </div>
      </form>
    </Drawer>
  );
};

export default ResuableDocumentForm;
