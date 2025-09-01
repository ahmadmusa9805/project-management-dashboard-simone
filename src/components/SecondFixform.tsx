import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Select, Input, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { ErrorMessage } from "@hookform/error-message";

export interface SecondFixFormValues {
  _id?: string;
  title?: string;
  room: string;
  surface: string;
  productCode: string;
  supplierName: string;
  text: string;
  file?: File | null;
}

interface SecondFixFormProps {
  defaultValues?: SecondFixFormValues;
  mode?: "create" | "edit";
  onSubmit: (data: SecondFixFormValues) => void;
  onCancel: () => void;
  creating?: boolean;
  updating?: boolean;
}

const { TextArea } = Input;

const SecondFixForm: React.FC<SecondFixFormProps> = ({
  defaultValues,
  mode = "create",
  onSubmit,
  onCancel,
  creating,
  updating,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SecondFixFormValues>({
    defaultValues: defaultValues ?? {
      room: "",
      title: "",
      surface: "",
      productCode: "",
      supplierName: "",
      text: "",
      file: null,
    },
  });

  const handleFormSubmit = (data: SecondFixFormValues) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="w-full bg-white rounded shadow-lg p-6 flex flex-col gap-6"
    >
      <h2 className="text-2xl font-semibold text-[#000E0F]">
        {" "}
        {mode === "edit" ? "Edit Second Fix" : "Create Second Fix"}{" "}
      </h2>

      {/* Title */}
      <div className="flex flex-col gap-2">
        <label>Title</label>
        <Controller
          control={control}
          name="title"
          render={({ field }) => <Input {...field} placeholder="Enter title" />}
        />
        <ErrorMessage
          errors={errors}
          name="title"
          render={({ message }) => (
            <p className="text-red-500 text-sm">{message}</p>
          )}
        />
      </div>

      {/* Room */}
      <div className="flex flex-col gap-2">
        <label>Room</label>
        <Controller
          control={control}
          name="room"
          render={({ field }) => (
            <Select {...field} placeholder="Select room">
              <Select.Option value="living-room">Living Room</Select.Option>
              <Select.Option value="bedroom">Bedroom</Select.Option>
              <Select.Option value="kitchen">Kitchen</Select.Option>
              <Select.Option value="bathroom">Bathroom</Select.Option>
            </Select>
          )}
        />
        <ErrorMessage
          errors={errors}
          name="room"
          render={({ message }) => (
            <p className="text-red-500 text-sm">{message}</p>
          )}
        />
      </div>

      {/* Surface */}
      <div className="flex flex-col gap-2">
        <label>Surface</label>
        <Controller
          control={control}
          name="surface"
          render={({ field }) => (
            <Select {...field} placeholder="Select surface">
              <Select.Option value="wall">Wall</Select.Option>
              <Select.Option value="ceiling">Ceiling</Select.Option>
              <Select.Option value="floor">Floor</Select.Option>
              <Select.Option value="trim">Trim</Select.Option>
            </Select>
          )}
        />
        <ErrorMessage
          errors={errors}
          name="surface"
          render={({ message }) => (
            <p className="text-red-500 text-sm">{message}</p>
          )}
        />
      </div>

      {/* Product Code */}
      <div className="flex flex-col gap-2">
        <label>Product Code</label>
        <Controller
          control={control}
          name="productCode"
          render={({ field }) => (
            <Input {...field} placeholder="Enter product code" />
          )}
        />
        <ErrorMessage
          errors={errors}
          name="productCode"
          render={({ message }) => (
            <p className="text-red-500 text-sm">{message}</p>
          )}
        />
      </div>

      {/* Supplier Name */}
      <div className="flex flex-col gap-2">
        <label>Supplier Name</label>
        <Controller
          control={control}
          name="supplierName"
          render={({ field }) => (
            <Input {...field} placeholder="Enter supplier name" />
          )}
        />
        <ErrorMessage
          errors={errors}
          name="supplierName"
          render={({ message }) => (
            <p className="text-red-500 text-sm">{message}</p>
          )}
        />
      </div>

      {/* Text (Description) */}
      <div className="flex flex-col gap-2">
        <label>Description</label>
        <Controller
          control={control}
          name="text"
          render={({ field }) => (
            <TextArea {...field} rows={4} placeholder="Enter description" />
          )}
        />
        <ErrorMessage
          errors={errors}
          name="text"
          render={({ message }) => (
            <p className="text-red-500 text-sm">{message}</p>
          )}
        />
      </div>

      {/* File Upload */}
      <div className="flex flex-col gap-2">
        <label>Upload Files</label>
        <Controller
          control={control}
          name="file"
          render={({ field }) => (
            <Upload
              beforeUpload={() => false}
              onChange={({ fileList }) => {
                field.onChange(fileList?.[0]?.originFileObj ?? undefined);
              }}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          )}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" htmlType="submit" loading={creating || updating}>
          {mode === "edit" ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default SecondFixForm;
