/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import {
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Button,
  Upload,
} from "antd";
import moment from "moment"; // Required to format dates

interface Props {
  mode: "create" | "edit";
  defaultValues?: any;
  onSubmitSuccess: (item: any) => void;
  onCancel: () => void;
}

const LaborCreateEdit: React.FC<Props> = ({
  mode,
  defaultValues,
  onSubmitSuccess,
  onCancel,
}) => {
  const [form] = Form.useForm();

  // ✅ Important: Reset form fields when drawer opens in edit mode
  useEffect(() => {
    if (defaultValues) {
      form.setFieldsValue({
        ...defaultValues,
        date: defaultValues.date ? moment(defaultValues.date) : null,
      });
    } else {
      form.resetFields();
    }
  }, [defaultValues, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => {
        onSubmitSuccess({
          id: defaultValues?.id ?? Date.now(),
          ...values,
          date: values.date.format("YYYY-MM-DD"), // format back
        });
      }}
    >
      <Form.Item name="type" label="Type" rules={[{ required: true }]}>
        <Select>
          <Select.Option value="Labor">Labor</Select.Option>
          <Select.Option value="SubContractor">Sub Contractor</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="rate" label="Rate" rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        name="quantity"
        label="Quantity / Days"
        rules={[{ required: true }]}
      >
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="vatRate" label="VAT Rate (%)" initialValue={0}>
        <InputNumber min={0} max={100} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="date" label="Date" rules={[{ required: true }]}>
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item name="uploadedFile" label="Upload File (optional)">
        <Upload name="file" beforeUpload={() => false} listType="text">
          <Button>Upload</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {mode === "create" ? "Add" : "Save"}
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={onCancel}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LaborCreateEdit;
