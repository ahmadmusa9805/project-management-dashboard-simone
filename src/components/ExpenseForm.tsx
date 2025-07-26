/* eslint-disable @typescript-eslint/no-empty-object-type */

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { DatePicker, Checkbox, Button, Input, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { ExpenseItem } from "../types/projectAllTypes/expense";

export interface ExpenseFormValues extends Omit<ExpenseItem, "id"> {}

interface ExpenseFormProps {
  defaultValues?: ExpenseFormValues;
  mode?: "create" | "edit";
  onSubmit: (data: ExpenseFormValues) => void;
  onCancel: () => void;
}

const { TextArea } = Input;
const { Option } = Select;

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  defaultValues,
  mode = "create",
  onSubmit,
  onCancel,
}) => {
  const { control, handleSubmit } = useForm<ExpenseFormValues>({
    defaultValues: defaultValues ?? {
      type: "Labor",
      name: "",
      quantity: 1,
      cost: 0,
      vatRate: 0,
      includesVat: false,
      date: dayjs().format("YYYY-MM-DD"),
      time: "00:00",
      description: "",
      files: [],
    },
  });

  const handleFormSubmit = (data: ExpenseFormValues) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="w-full bg-white rounded shadow-lg p-6 flex flex-col gap-6"
    >
      <h2 className="text-2xl font-semibold text-[#000E0F]">
        {mode === "edit" ? "Edit Expense" : "Create Expense"}
      </h2>

      {/* Expense Type */}
      <div className="flex flex-col gap-2">
        <label>Expense Type</label>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select {...field} placeholder="Select expense type">
              <Option value="Labor">Labor</Option>
              <Option value="Subcontractor">Subcontractor</Option>
              <Option value="Material">Material</Option>
            </Select>
          )}
        />
      </div>

      {/* Name */}
      <div className="flex flex-col gap-2">
        <label>Name</label>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <Input {...field} placeholder="Labor or supplier name" />
          )}
        />
      </div>

      {/* Quantity */}
      <div className="flex flex-col gap-2">
        <label>Quantity / Unit / Days</label>
        <Controller
          control={control}
          name="quantity"
          render={({ field }) => (
            <Input type="number" {...field} placeholder="Quantity" />
          )}
        />
      </div>

      {/* Cost */}
      <div className="flex flex-col gap-2">
        <label>Cost</label>
        <Controller
          control={control}
          name="cost"
          render={({ field }) => (
            <Input type="number" {...field} placeholder="Total cost" />
          )}
        />
      </div>

      {/* VAT + includes VAT */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <label>VAT Rate (%)</label>
          <Controller
            control={control}
            name="vatRate"
            render={({ field }) => (
              <Input type="number" step="0.01" {...field} />
            )}
          />
        </div>
        <Controller
          control={control}
          name="includesVat"
          render={({ field }) => (
            <Checkbox {...field} checked={field.value}>
              Rate includes VAT
            </Checkbox>
          )}
        />
      </div>

      {/* Date */}
      <div className="flex flex-col gap-2">
        <label>Date</label>
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <DatePicker
              className="w-full"
              format="YYYY-MM-DD"
              value={dayjs(field.value)}
              onChange={(_date, dateString) => field.onChange(dateString)}
            />
          )}
        />
      </div>

      {/* Time */}
      <div className="flex flex-col gap-2">
        <label>Time</label>
        <Controller
          control={control}
          name="time"
          render={({ field }) => (
            <Input type="time" {...field} className="w-full" />
          )}
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <label>Description</label>
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <TextArea {...field} rows={3} placeholder="Optional notes" />
          )}
        />
      </div>

      {/* Upload */}
      <div className="flex flex-col gap-2">
        <label>Upload Files</label>
        <Controller
          control={control}
          name="files"
          render={({ field }) => (
            <Upload
              beforeUpload={() => false}
              onChange={({ fileList }) => field.onChange(fileList)}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          )}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" htmlType="submit">
          {mode === "edit" ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
