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
  message,
} from "antd";
import moment from "moment";
import { useCreateLaborUserMutation, useUpdateLaborUserMutation } from "../../Redux/features/users/usersApi";
import { successAlert } from "../../utils/alerts";


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
  const [createLabor, { isLoading: creating }] = useCreateLaborUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateLaborUserMutation();

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

  const handleSubmit = async (values: any) => {
    const payload = {
      ...values,
      role: "labor",
      date: values.date?.format("YYYY-MM-DD") || null,
    };
     
    try {
      let response;
      if (mode === "create") {
        console.log('before create labor data :', payload)
        response = await createLabor(payload).unwrap();
        successAlert("Labor created successfully");
      } else if (mode === "edit" && defaultValues?.id) {

         console.log('before update  labor data :', {payload})
        response = await updateUser({ id: defaultValues.id, ...payload }).unwrap();
         successAlert("Labor updated successfully");
      }
      onSubmitSuccess(response);
      form.resetFields();
    } catch (error) {
      console.error("Error submitting form", error);
      message.error("Something went wrong");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
        <Button type="primary" htmlType="submit" loading={creating || updating}>
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
