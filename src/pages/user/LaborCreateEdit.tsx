/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Button, Upload } from "antd";

import { successAlert, errorAlert } from "../../utils/alerts";
import { CloudUpload } from "lucide-react";

interface Props {
  mode: "create" | "edit";
  defaultValues?: any;
  onSubmitSuccess: (item: any) => void;
  onCancel: () => void;
  creating?: boolean;
  updating?: boolean;
  createLabor: (data: FormData) => Promise<any>;
  updateLabor: (args: { id: string; body: FormData }) => Promise<any>;
}

const LaborCreateEdit: React.FC<Props> = ({
  mode,
  defaultValues,
  onSubmitSuccess,
  onCancel,
  creating,
  updating,
  createLabor,
  updateLabor,
}) => {
  const [form] = Form.useForm();
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    if (defaultValues) {
      form.setFieldsValue({ ...defaultValues });
    } else {
      form.resetFields();
      setPhotoFile(null);
    }
  }, [defaultValues, form]);

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();

      const payload = {
        name: data.name,
        description: data.description || "",
        address: data.address || "",
        position: data.position,
        dayRate: data.dayRate,
        UtrNinAddress: data.UtrNinAddress,
      };

      formData.append("data", JSON.stringify(payload));
      if (photoFile) formData.append("file", photoFile);

      let response;
      if (mode === "edit" && defaultValues?.id) {
        response = await updateLabor({ id: defaultValues.id, body: formData });
        successAlert("Labor updated successfully");
      } else {
        response = await createLabor(formData);
        successAlert("Labor created successfully");
      }

      onSubmitSuccess(response);
      form.resetFields();
      setPhotoFile(null);
    } catch (error) {
      errorAlert("Error while saving labor");
      console.error(error);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please enter name" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="description" label="Description">
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item name="address" label="Address">
        <Input />
      </Form.Item>

      <Form.Item
        name="position"
        label="Position"
        rules={[{ required: true, message: "Please enter position" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="dayRate"
        label="Day Rate"
        rules={[{ required: true, message: "Please enter day rate" }]}
      >
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="UtrNinAddress"
        label="UTR/NIN Address"
        rules={[{ required: true, message: "Please enter UTR/NIN Address" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Upload File">
        <div className="flex flex-col gap-1">
          <label className="font-medium">Contract PDF (Optional)</label>
          <Upload.Dragger
            name="file"
            accept=".pdf"
            beforeUpload={(file) => {
              setPhotoFile(file); // save file to state
              return false; // prevent auto upload
            }}
            multiple={false}
            fileList={photoFile ? [photoFile as any] : []} // show selected file
            onRemove={() => setPhotoFile(null)}
            style={{ padding: "8px" }}
          >
            <p className="text-center flex flex-col items-center">
              <CloudUpload size={24} color="#83ac72" strokeWidth={2.5} />
            </p>
            <p className="text-[10px]">Click or drag PDF to upload</p>
          </Upload.Dragger>
        </div>
      </Form.Item>

      <Form.Item className="flex justify-end gap-2">
        <Button type="text" className="cancel" onClick={onCancel}>
          Cancel
        </Button>

        <Button
          type="primary"
          style={{ marginLeft: 8 }}
          htmlType="submit"
          loading={creating || updating}
        >
          {mode === "create" ? "Create" : "Update"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LaborCreateEdit;
