/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Upload, Drawer } from "antd";
import { UploadOutlined } from "@ant-design/icons";

// Types
type DocumentField = {
  name: string;
  label: string;
  placeholder: string;
};

type DocumentFormProps = {
  mode: "create" | "edit";
  fields: DocumentField[];
  defaultValues?: Record<string, any>;
  onSubmit: (data: any) => void;
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
  const { control, handleSubmit } = useForm({ defaultValues });

  return (
    <Drawer
      title={mode === "create" ? "New Docs" : "Edit Docs"}
      placement="right"
      width={480}
      onClose={onClose}
      open={open}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
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

        <div className="w-full h-20 flex flex-col gap-2.5">
          <div className="w-full flex justify-start items-center">
            <div className="w-full flex justify-center items-center px-2 py-3 border border-[#000E0F1A] gap-1">
              <Upload beforeUpload={() => false} showUploadList={false}>
                <Button
                  icon={<UploadOutlined />}
                  className="text-[#2B3738] text-base font-medium leading-6"
                >
                  Upload docs or drag & drop here
                </Button>
              </Upload>
            </div>
          </div>
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
