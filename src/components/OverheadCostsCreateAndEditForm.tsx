/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input, Button, Upload, Select, InputNumber } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";
import {
  useCreateOverheadCostMutation,
  useUpdateOverheadCostMutation,
} from "../Redux/features/overheadCosts/overheadCostsApi";
import { errorAlert, successAlert } from "../utils/alerts";
import { useGetProjectsWithstatusQuery } from "../Redux/features/projects/projectsApi";
// Assuming this exists

const { TextArea } = Input;
const { Option } = Select;

// Zod Schema based on your TOverCost model
const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name is required"), // Maps to 'title' in API if needed
  projectId: z.string().min(1, "Project selection is required"),
  reference: z.string().min(2, "Reference is required"),
  description: z.string().optional(),
  vat: z.number().min(0, "VAT cannot be negative"),
  value: z.number().min(1, "Value is required"),
  // file is handled separately via state
});

type FormData = z.infer<typeof schema>;

interface Props {
  mode: "create" | "edit";
  defaultValues?: any; // strict typing depends on your response type
  onSubmitSuccess?: () => void;
  onCancel: () => void;
}

const OverheadCostCreateEditForm = ({
  mode,
  defaultValues,
  onSubmitSuccess,
  onCancel,
}: Props) => {
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const {
    control,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      projectId: undefined,
      reference: "",
      description: "",
      vat: 0,
      value: 0,
      ...defaultValues,
    },
  });

  const {
    data: projects = {
      data: [],
    },
  } = useGetProjectsWithstatusQuery({
    status: "ongoing",
  });

  console.log(projects, "projects");
  // // Fetch Projects for the dropdown
  // const { data: projectData } = useGetAllProjectsQuery({ limit: 1000 });
  // const projects = projectData?.data || [];

  const [createOverheadCost, { isLoading: isCreating }] =
    useCreateOverheadCostMutation();
  const [updateOverheadCost, { isLoading: isUpdating }] =
    useUpdateOverheadCostMutation();

  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      // Handle potential mismatch if defaultValues.projectId is an object
      const projId =
        typeof defaultValues.projectId === "object"
          ? defaultValues.projectId._id
          : defaultValues.projectId;

      reset({
        ...defaultValues,
        projectId: projId,
      });
    } else {
      reset({
        name: "",
        reference: "",
        description: "",
        vat: 0,
        value: 0,
      });
    }
  }, [mode, defaultValues, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      // const formData = new FormData();

      // // Construct payload based on your API slice requirement
      // const payload = {
      //   name: data.name, // The API might expect 'title', check your backend
      //   title: data.name, // Sending both just in case based on your API snippet
      //   projectId: data.projectId,
      //   reference: data.reference,
      //   description: data.description,
      //   vat: Number(data.vat),
      //   value: Number(data.value),
      // };

      // formData.append("data", JSON.stringify(payload));

      // if (photoFile) {
      //   formData.append("file", photoFile);
      // }

      if (mode === "edit" && defaultValues?._id) {
        await updateOverheadCost({
          id: defaultValues._id,
          data: data,
        }).unwrap(); // Adjusted to match your API signature
        successAlert("Cost updated successfully");
      } else {
        await createOverheadCost(data).unwrap(); // Your API slice logic implies passing object, which internal logic converts to FormData, or we pass FormData directly.
        // Based on your slice: query: (data) => ... formData.append...
        // We should pass the raw data object + file property to the mutation
        // IF the mutation wrapper handles the FormData creation.
        // HOWEVER, looking closely at your slice, it manually creates FormData.
        // So we should pass an object like { ...payload, file: photoFile } to the mutation.

        // Rethinking based on the slice provided in prompt:
        // query: (data) => { const formData = new FormData(); ... }
        // So we pass a plain JS object to the mutation.

        // const mutationData = { ...payload, file: photoFile };
        // if (mode === "edit" && defaultValues?._id) {
        //   await updateOverheadCost({
        //     id: defaultValues._id,
        //     data: mutationData,
        //   }).unwrap();
        // } else {
        //   await createOverheadCost(mutationData).unwrap();
        // }
        successAlert("Cost created successfully");
      }

      reset();
      setPhotoFile(null);
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (error) {
      errorAlert("Error while saving overhead cost");
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full bg-white p-6 flex flex-col gap-6"
    >
      <h2 className="text-2xl font-semibold text-[#000E0F]">
        {mode === "edit" ? "Edit Overhead Cost" : "Create New Overhead Cost"}
      </h2>

      <div className="flex flex-col gap-4">
        {/* Name / Title */}
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <>
              <Input {...field} placeholder="Cost Name / Title" />
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name.message}</p>
              )}
            </>
          )}
        />

        {/* Project Selection */}
        <Controller
          control={control}
          name="projectId"
          render={({ field }) => (
            <>
              <Select
                {...field}
                showSearch
                placeholder="Select Project"
                optionFilterProp="children"
                className="w-full"
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {projects?.data?.map((proj: any) => (
                  <Option key={proj._id} value={proj._id}>
                    {proj.projectName}
                  </Option>
                ))}
              </Select>
              {errors.projectId && (
                <p className="text-red-600 text-sm">
                  {errors.projectId.message}
                </p>
              )}
            </>
          )}
        />

        {/* Reference */}
        <Controller
          control={control}
          name="reference"
          render={({ field }) => (
            <>
              <Input {...field} placeholder="Reference (e.g. INV-001)" />
              {errors.reference && (
                <p className="text-red-600 text-sm">
                  {errors.reference.message}
                </p>
              )}
            </>
          )}
        />

        {/* Value & VAT Row */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="text-sm font-medium mb-1 block">Value (£)</label>
            <Controller
              control={control}
              name="value"
              render={({ field }) => (
                <InputNumber
                  {...field}
                  className="w-full"
                  min={0}
                  placeholder="Amount"
                />
              )}
            />
            {errors.value && (
              <p className="text-red-600 text-sm">{errors.value.message}</p>
            )}
          </div>
          <div className="w-1/2">
            <label className="text-sm font-medium mb-1 block">VAT (%)</label>
            <Controller
              control={control}
              name="vat"
              render={({ field }) => (
                <InputNumber
                  {...field}
                  className="w-full"
                  min={0}
                  max={100}
                  placeholder="%"
                />
              )}
            />
            {errors.vat && (
              <p className="text-red-600 text-sm">{errors.vat.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <TextArea
              {...field}
              rows={3}
              placeholder="Description (Optional)"
            />
          )}
        />
      </div>

      {/* File Upload */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium">Upload Document</h3>
        <Upload.Dragger
          accept=".pdf,.png,.jpg,.jpeg"
          beforeUpload={(file) => {
            setPhotoFile(file);
            return false;
          }}
          multiple={false}
          fileList={photoFile ? [photoFile as any] : []}
          onRemove={() => setPhotoFile(null)}
          style={{ padding: "20px" }}
        >
          <p className="text-center flex flex-col items-center">
            <CloudUploadOutlined style={{ fontSize: 24, color: "#0d542b" }} />
          </p>
          <p className="text-sm text-center">Click or drag file to upload</p>
        </Upload.Dragger>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end mt-4">
        <Button type="text" className="cancel" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          htmlType="submit"
          type="primary"
          className="bg-[#001D01]"
          loading={isCreating || isUpdating}
        >
          {mode === "edit" ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default OverheadCostCreateEditForm;
