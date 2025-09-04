import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Typography, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Title } = Typography;

export interface DocumentFormValues {
  room: string;
  surface: string;
  productCode: string;
  supplierName: string;
  description: string;
  files?: File[];
}

interface DocumentFormProps {
  title?: string;
  defaultValues?: Partial<DocumentFormValues>;
  onCancel: () => void;
  onSave: (data: DocumentFormValues) => void;
}

const SecondFixDocumentForm: React.FC<DocumentFormProps> = (props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DocumentFormValues>({
    defaultValues: props.defaultValues,
  });

  const formTitle = props.title || "";

  const onSubmit = (data: DocumentFormValues) => {
    props.onSave(data);
  };

  return (
    <div className="w-full h-full p-6 bg-white flex flex-col gap-6">
      {/* Header */}
      <div className="border-b pb-2">
        <Title level={3} className="!text-gray-700">
           {formTitle}
        </Title>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Controller
          name="room"
          control={control}
          rules={{ required: "Room is required" }}
          render={({ field }) => (
            <Input {...field} placeholder="What room" size="large" />
          )}
        />
        {errors.room && <p className="text-red-500">{errors.room.message}</p>}

        <Controller
          name="surface"
          control={control}
          rules={{ required: "Surface is required" }}
          render={({ field }) => (
            <Input {...field} placeholder="Surface" size="large" />
          )}
        />
        {errors.surface && <p className="text-red-500">{errors.surface.message}</p>}

        <Controller
          name="productCode"
          control={control}
          rules={{ required: "Product code is required" }}
          render={({ field }) => (
            <Input {...field} placeholder="Product Code" size="large" />
          )}
        />
        {errors.productCode && (
          <p className="text-red-500">{errors.productCode.message}</p>
        )}

        <Controller
          name="supplierName"
          control={control}
          rules={{ required: "Supplier name is required" }}
          render={({ field }) => (
            <Input {...field} placeholder="Supplier Name" size="large" />
          )}
        />
        {errors.supplierName && (
          <p className="text-red-500">{errors.supplierName.message}</p>
        )}

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextArea {...field} rows={4} placeholder="Other description..." />
          )}
        />

        <Controller
          name="files"
          control={control}
          render={({ field: { onChange } }) => (
            <Upload
              multiple
              beforeUpload={(file) => {
                onChange((prev: File[] = []) => [...prev, file]);
                return false;
              }}
              onRemove={(file) => {
              onChange((prev?: File[]) => [...(prev || []), file]);

              }}
              fileList={[]}
            >
              <Button icon={<UploadOutlined />}>
                Upload files or drag & drop
              </Button>
            </Upload>
          )}
        />

        <div className="flex gap-4 justify-end mt-4">
          <Button onClick={props.onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SecondFixDocumentForm;
