/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { DatePicker, Button, Input, Select, Upload, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { ExpenseType } from "../types/projectAllTypes/expense";
import { useGetAllLaboursQuery } from "../Redux/features/labour/labourApi";

export interface ExpenseFormValues {
  _id?: string;
  type?: ExpenseType;
  name: string;
  quantity?: number;
  unit?: string;
  unitPrice?: number;
  days?: number;
  vat?: number;
  ratePerDay?: number;
  amount?: number;
  file?: string | any;
  date?: string;
  description?: string;
  labourId?: string;
}

interface ExpenseFormProps {
  defaultValues?: ExpenseFormValues;
  mode?: "create" | "edit";
  onSubmit: (data: ExpenseFormValues) => void;
  onCancel: () => void;
  title: string;
}

const { TextArea } = Input;

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  defaultValues,
  title,
  mode = "create",
  onSubmit,
  onCancel,
}) => {
  const normalizedTitle = (defaultValues?.type || title).trim().toLowerCase();

  // Set expense options & disable type selection if already determined
  let expenseOptions: { label: string; value: ExpenseType }[] = [];
  let isTypeDisabled = false;
  let defaultTypeValue: ExpenseType | undefined;

  if (normalizedTitle === "labour") {
    expenseOptions = [{ label: "Labour", value: "Labour" }];
    isTypeDisabled = true;
    defaultTypeValue = "Labour";
  } else if (normalizedTitle === "subcontractor") {
    expenseOptions = [{ label: "Subcontractor", value: "Subcontractor" }];
    isTypeDisabled = true;
    defaultTypeValue = "Subcontractor";
  } else if (normalizedTitle === "material") {
    expenseOptions = [{ label: "Material", value: "Material" }];
    isTypeDisabled = true;
    defaultTypeValue = "Material";
  } else {
    expenseOptions = [
      { label: "Labour", value: "Labour" },
      { label: "Subcontractor", value: "Subcontractor" },
      { label: "Material", value: "Material" },
    ];
  }

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    defaultValues: defaultValues ?? {
      _id: "",
      type: defaultTypeValue,
      name: "",
      quantity: 0,
      unit: "",
      unitPrice: 0,
      days: 0,
      vat: 0,
      ratePerDay: 0,
      amount: 0,
      date: dayjs().format("YYYY-MM-DD"),
      description: "",
    },
  });

  // Fetch labour list from backend
  const { data: labourList, isLoading: labourLoading } =
    useGetAllLaboursQuery();

  console.log(labourList);
  // Watch the selected labour name in form
  const selectedLaborName = watch("name");

  const days = watch("days");
  const ratePerDay = watch("ratePerDay");

  // Use effect to calculate amount dynamically whenever days or ratePerDay changes
  useEffect(() => {
    if (typeof days === "number" && typeof ratePerDay === "number") {
      const calculatedAmount = days * ratePerDay;
      setValue("amount", calculatedAmount, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [days, ratePerDay, setValue]);

  const selectedLabourId = watch("labourId");

  useEffect(() => {
    if (selectedLabourId && labourList?.data?.length) {
      const labour = labourList.data.find(
        (lab: any) => lab._id === selectedLabourId
      );
      if (labour) {
        setValue("ratePerDay", labour.dayRate || 0);
        setValue("description", labour.description || "");
        setValue("name", labour.name);
      }
    }
  }, [selectedLabourId, labourList, setValue]);
  // When labour name changes, update ratePerDay & description automatically
  useEffect(() => {
    if (
      normalizedTitle === "labour" &&
      labourList?.data?.length &&
      selectedLaborName
    ) {
      const selectedLabor = labourList?.data?.find(
        (lab: any) => lab.name === selectedLaborName
      );
      if (selectedLabor) {
        setValue("ratePerDay", selectedLabor.dayRate || 0, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("description", selectedLabor.description || "", {
          shouldValidate: false,
        });
      }
    }
  }, [selectedLaborName, labourList, normalizedTitle, setValue]);

  const handleFormSubmit = (data: ExpenseFormValues) => {
    onSubmit(data);
  };

  const showMaterialFields = normalizedTitle === "material";
  const showLabourFields = normalizedTitle === "labour";
  const showSubcontractorFields = normalizedTitle === "subcontractor";

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
          rules={{ required: "Expense type is required" }}
          render={({ field }) => (
            <Select
              {...field}
              disabled={isTypeDisabled}
              placeholder="Select expense type"
            >
              {expenseOptions.map((opt) => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
          )}
        />
      </div>

      {/* Name */}
      <div className="flex flex-col gap-2">
        <label>Name</label>
        {showLabourFields ? (
          labourLoading ? (
            <Spin size="small" />
          ) : (
            <>
              <Controller
                control={control}
                name="labourId"
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    showSearch
                    placeholder="Select Labour"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.children as unknown as string)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    allowClear
                  >
                    {labourList?.data?.length ? (
                      labourList?.data?.map((lab: any) => (
                        <Select.Option key={lab._id} value={lab._id}>
                          {lab.name}
                        </Select.Option>
                      ))
                    ) : (
                      <Select.Option disabled>No labours found</Select.Option>
                    )}
                  </Select>
                )}
              />
              <Controller
                control={control}
                name="name"
                render={() => null} // no UI, just for storing the name
              />
            </>
          )
        ) : (
          <Controller
            control={control}
            name="name"
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <Input {...field} placeholder="Name of labour/material/vendor" />
            )}
          />
        )}
      </div>

      {/* Material-specific fields */}
      {showMaterialFields && (
        <>
          <div className="flex flex-col gap-2">
            <label>Quantity</label>
            <Controller
              control={control}
              name="quantity"
              render={({ field }) => (
                <Input type="number" {...field} placeholder="Quantity" />
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Unit</label>
            <Controller
              control={control}
              name="unit"
              render={({ field }) => (
                <Input {...field} placeholder="Unit (e.g. kg, m)" />
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Unit Price</label>
            <Controller
              control={control}
              name="unitPrice"
              render={({ field }) => (
                <Input type="number" {...field} placeholder="Unit Price" />
              )}
            />
          </div>
        </>
      )}

      {/* Labour-specific fields */}
      {showLabourFields && (
        <>
          <div className="flex flex-col gap-2">
            <label>Days</label>
            <Controller
              control={control}
              name="days"
              render={({ field }) => (
                <Input
                  type="number"
                  {...field}
                  placeholder="Number of days"
                  min={1}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    field.onChange(val > 0 ? val : 1); // Ensure minimum 1 day
                  }}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Rate Per Day</label>
            <Controller
              control={control}
              name="ratePerDay"
              render={({ field }) => (
                <Input
                  type="number"
                  {...field}
                  placeholder="Rate Per Day"
                  min={0}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    field.onChange(val >= 0 ? val : 0);
                  }}
                />
              )}
            />
          </div>
        </>
      )}

      {/* Subcontractor-specific fields */}
      {showSubcontractorFields && (
        <>
          <div className="flex flex-col gap-2">
            <label>Days</label>
            <Controller
              control={control}
              name="days"
              render={({ field }) => (
                <Input type="number" {...field} placeholder="Number of days" />
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Rate Per Day</label>
            <Controller
              control={control}
              name="ratePerDay"
              render={({ field }) => (
                <Input type="number" {...field} placeholder="Rate Per Day" />
              )}
            />
          </div>
        </>
      )}

      {/* VAT */}
      <div className="flex flex-col gap-2">
        <label>VAT (%)</label>
        <Controller
          control={control}
          name="vat"
          render={({ field }) => (
            <Input type="number" step="0.01" {...field} placeholder="VAT %" />
          )}
        />
      </div>

      {/* Amount */}
      <div className="flex flex-col gap-2">
        <label>Total Amount</label>
        <Controller
          control={control}
          name="amount"
          render={({ field }) => (
            <Input type="number" {...field} placeholder="Total Amount" />
          )}
        />
      </div>

      {/* Date */}
      <div className="flex flex-col gap-2">
        <label>Date</label>
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <DatePicker
              className="w-full"
              format="YYYY-MM-DD"
              value={field.value ? dayjs(field.value) : undefined}
              onChange={(_date, dateString) => field.onChange(dateString)}
            />
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
          name="file"
          render={({ field }) => (
            <Upload
              beforeUpload={() => false}
              onChange={({ fileList }) =>
                field.onChange(fileList?.[0]?.originFileObj)
              }
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
        <Button type="primary" htmlType="submit">
          {mode === "edit" ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
