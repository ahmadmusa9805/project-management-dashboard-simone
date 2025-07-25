/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { DatePicker, Checkbox, Button, Upload } from "antd";

import dayjs from "dayjs";

type ExpenseType = "Labor" | "Subcontractor" | "Material";

interface ExpenseFormProps {
  defaultValues?: ExpenseFormValues;
  mode?: "create" | "edit";
  onSubmit: (data: ExpenseFormValues) => void;
  onCancel: () => void;
}

export interface ExpenseFormValues {
  type: ExpenseType;
  name: string;
  quantity: number;
  cost: number;
  vatRate: number;
  includesVat: boolean;
  date: string;
  time: string;
  description: string;
  files?: any;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  defaultValues,
  mode = "create",
  onSubmit,
  onCancel,
}) => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
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
    },
  });

  const handleFormSubmit: SubmitHandler<ExpenseFormValues> = (data) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="bg-white rounded shadow-md p-6 w-full flex flex-col gap-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800">
        {mode === "create" ? "Add Expense" : "Edit Expense"}
      </h2>

      {/* Expense Type */}
      <div>
        <label className="block mb-1 font-medium">Expense Type</label>
        <select
          {...register("type", { required: "Type is required" })}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="Labor">Labor</option>
          <option value="Subcontractor">Subcontractor</option>
          <option value="Material">Material</option>
        </select>
        {errors.type && (
          <p className="text-red-500 text-sm">{errors.type.message}</p>
        )}
      </div>

      {/* Name */}
      <div>
        <label className="block mb-1 font-medium">Name</label>
        <input
          {...register("name", { required: "Name is required" })}
          className="w-full border px-3 py-2 rounded"
          placeholder="Labor name / Supplier name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Quantity */}
      <div>
        <label className="block mb-1 font-medium">Quantity / Unit / Days</label>
        <input
          type="number"
          {...register("quantity", { required: true, min: 1 })}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Cost */}
      <div>
        <label className="block mb-1 font-medium">Cost</label>
        <input
          type="number"
          {...register("cost", { required: "Cost is required", min: 0.01 })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.cost && (
          <p className="text-red-500 text-sm">{errors.cost.message}</p>
        )}
      </div>

      {/* VAT Rate and Checkbox */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <label className="block mb-1 font-medium">VAT Rate (%)</label>
          <input
            type="number"
            step="0.01"
            {...register("vatRate", { required: true })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="mt-6">
          <Controller
            name="includesVat"
            control={control}
            render={({ field }) => (
              <Checkbox {...field}>Rate includes VAT</Checkbox>
            )}
          />
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="block mb-1 font-medium">Date</label>
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <DatePicker
              {...field}
              className="w-full"
              format="YYYY-MM-DD"
              onChange={(_date, dateString) => field.onChange(dateString)}
            />
          )}
        />
      </div>

      {/* Time */}
      <div>
        <label className="block mb-1 font-medium">Time (hh:mm)</label>
        <input
          type="time"
          {...register("time", { required: true })}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          {...register("description")}
          rows={4}
          className="w-full border px-3 py-2 rounded"
          placeholder="Optional notes"
        />
      </div>

      {/* Upload */}
      <div>
        <label className="block mb-1 font-medium">Upload Files</label>
        <Controller
          control={control}
          name="files"
          render={({ field }) => (
            <Upload
              {...field}
              maxCount={1}
              beforeUpload={() => false}
              onChange={({ fileList }) => field.onChange(fileList)}
            >
              <Button>Click to Upload</Button>
            </Upload>
          )}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" htmlType="submit">
          {mode === "create" ? "Save" : "Update"}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
