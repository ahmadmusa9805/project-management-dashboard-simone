
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { successAlert, errorAlert } from "../../utils/alerts";

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

      <Form.Item label="Upload File" required={mode === "create"}>
        <Upload
          beforeUpload={(file) => {
            setPhotoFile(file);
            return false; // prevent auto upload
          }}
          maxCount={1}
          fileList={photoFile ? [photoFile as any] : []} // To show selected file
          onRemove={() => setPhotoFile(null)}
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          style={{ marginLeft: 8 }}
          type="primary"
          htmlType="submit"
          loading={creating || updating}
        >
          {mode === "create" ? "Add" : "Save"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LaborCreateEdit;


