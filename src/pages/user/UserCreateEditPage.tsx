/* eslint-disable @typescript-eslint/no-explicit-any */

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input, Select, Button, Upload, message } from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../../Redux/features/users/usersApi";
import { USER_ROLE } from "../../types/userAllTypes/user";
import { successAlert } from "../../utils/alerts";

const { Option } = Select;

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  contactNo: z.string().min(6, "Contact number required"),
  address: z.string().min(3, "Address is required"),
  postCode: z.string().min(4, "Postal code is required"),
  estimateNumber: z.string().optional(),
  projectType: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(
    ["superAdmin", "primeAdmin", "basicAdmin", "client", "labor"],
    "User type is required"
  ),
  profileImg: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  mode: "create" | "edit";

  defaultValues?: Partial<FormData>;
  onSubmitSuccess?: () => void;
  onCancel: () => void;
}

const UserCreateEditPage = ({
  mode,
  defaultValues,

  onCancel,
}: Props) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {},
  });

  const editingUserId = defaultValues?.id; // check both
  console.log("Editing user ID:", editingUserId);
  console.log(editingUserId);

  const [projectTypes, setProjectTypes] = useState(["Construction", "Repair"]);
  const [newProjectType, setNewProjectType] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const location = useLocation();
  const path = location.pathname;

  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const allowedRoles = useMemo<FormData["role"][]>(() => {
    if (path.includes("prime-admins")) {
      return mode === "edit" ? [USER_ROLE.primeAdmin] : [USER_ROLE.primeAdmin];
    } else if (path.includes("basic-admins")) {
      return [USER_ROLE.basicAdmin];
    } else if (path.includes("clients")) {
      return ["client"];
    } else {
      return [];
    }
  }, [path, mode]);

  const showClientFields = useMemo(() => {
    return path.includes("clients");
  }, [path]);

  const role = watch("role");

  useEffect(() => {
    if (mode === "create" && allowedRoles.length === 1) {
      setValue("role", allowedRoles[0]);
    }

    if (mode === "edit" && defaultValues) {
      reset(defaultValues);
    }
  }, [mode, allowedRoles, setValue, reset, defaultValues]);

  const handleAddProjectType = () => {
    if (newProjectType && !projectTypes.includes(newProjectType)) {
      setProjectTypes((prev) => [...prev, newProjectType]);
      setValue("projectType", newProjectType);
      setNewProjectType("");
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();

      // Append string fields
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("contactNo", data.contactNo);
      formData.append("password", String(data.password || ""));
      formData.append("address", data.address);
      formData.append("postCode", data.postCode);
      formData.append("estimateNumber", data.estimateNumber);
      formData.append("projectType", data.projectType);
      formData.append("role", data.role);

      // Append extra fields for client
      if (data.selectedRole === "client") {
        formData.append("estimateNumber", data.estimateNumber || "");
        formData.append("projectType", data.projectType || "");
      }

      // Append photo if selected
      if (photoFile) {
        formData.append("file", photoFile);
      }

      if (editingUserId) {
        // Update user
        await updateUser({ id: editingUserId, body: formData }).unwrap();
        successAlert("User updated");
      } else {
        // Create user
        await createUser(formData).unwrap();
        successAlert("User created");
      }

      // Reset form
      reset();
      setPhotoFile(null);
      // Close drawer/modal
    } catch (error) {
      message.error("Error while saving user");
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full bg-white p-6 flex flex-col gap-6"
    >
      <h2 className="text-2xl font-semibold text-[#000E0F]">
        {mode === "edit" ? "Edit User" : "Create a New User"}
      </h2>

      <div className="flex flex-col gap-4">
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <>
              <Input {...field} placeholder="Name" />
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name.message}</p>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <>
              <Input {...field} placeholder="Email" />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email.message}</p>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="contactNo"
          render={({ field }) => (
            <>
              <Input {...field} placeholder="Contact Number" />
              {errors.contactNo && (
                <p className="text-red-600 text-sm">
                  {errors.contactNo.message}
                </p>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="address"
          render={({ field }) => (
            <>
              <Input {...field} placeholder="Address" />
              {errors.address && (
                <p className="text-red-600 text-sm">{errors.address.message}</p>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="postCode"
          render={({ field }) => (
            <>
              <Input {...field} placeholder="Postal Code" />
              {errors.postCode && (
                <p className="text-red-600 text-sm">
                  {errors.postCode.message}
                </p>
              )}
            </>
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium">Upload Photo</h3>
        <Controller
          control={control}
          name="profileImg"
          render={() => (
            <Upload
              accept="image/*"
              listType="picture"
              maxCount={1}
              beforeUpload={(file) => {
                // ❗ Save actual File object
                setPhotoFile(file);
                return false; // prevent auto upload
              }}
              onRemove={() => setPhotoFile(null)}
            >
              <Button icon={<UploadOutlined />}>Upload Photo</Button>
            </Upload>
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium">User Type</h3>
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Input
              value={
                field.value === USER_ROLE.primeAdmin
                  ? "Prime Admin"
                  : field.value === USER_ROLE.basicAdmin
                  ? "Basic Admin"
                  : field.value === USER_ROLE.superAdmin
                  ? "Super Admin"
                  : field.value === USER_ROLE.client
                  ? "Client"
                  : field.value
              }
              disabled
            />
          )}
        />
      </div>

      {showClientFields && role === "client" && (
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium">Account Details</h3>

          {/* <Controller
            control={control}
            name="estimateNumber"
            render={({ field }) => (
              <Input {...field} placeholder="Estimate Number" />
            )}
          /> */}

          <Controller
            control={control}
            name="projectType"
            render={({ field }) => (
              <>
                <Select
                  {...field}
                  placeholder="Project name or ID"
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      <div className="flex items-center p-2 gap-2">
                        <Input
                          placeholder="Add new project name or ID"
                          value={newProjectType}
                          onChange={(e) => setNewProjectType(e.target.value)}
                        />
                        <Button
                          icon={<PlusOutlined />}
                          type="dashed"
                          onClick={handleAddProjectType}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  )}
                >
                  {projectTypes.map((type) => (
                    <Option key={type} value={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
              </>
            )}
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium">Set Default Password</h3>
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <>
              <Input.Password {...field} placeholder="Password" />
              {errors.password && (
                <p className="text-red-600 text-sm">
                  {errors.password.message}
                </p>
              )}
            </>
          )}
        />
      </div>

      <div className="flex gap-4 justify-end">
        <Button onClick={onCancel}>Cancel</Button>
        <Button htmlType="submit" type="primary" className="bg-[#001D01]">
          {mode === "edit" ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default UserCreateEditPage;
