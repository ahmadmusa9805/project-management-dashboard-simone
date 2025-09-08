/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useGetMeUserQuery,
  useUpdateUserMutation,
} from "../../Redux/features/users/usersApi";
import {
  useChangePasswordMutation,
  useLoginMutation,
} from "../../Redux/features/auth/authApi";
import type { User } from "../../Redux/features/users/users.types";
import PasswordUpdateModal from "../../components/PasswordUpdateModal";
import { successAlert, errorAlert } from "../../utils/alerts";
import { CameraIcon } from "lucide-react";
import { Tooltip } from "antd"; // ✅ added
import { USER_ROLE } from "../../types/userAllTypes/user";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../Redux/features/auth/authSlice";
import { persistor, type RootState } from "../../Redux/app/store";
// import { clearCredentials } from "../../Redux/features/auth/authSlice";
// import { useNavigate } from "react-router-dom";

interface UserProfileEditProps {
  user?: User;
}

type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

const UserProfileEdit: React.FC<UserProfileEditProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [actionType, setActionType] = useState<
    "updateDetails" | "changePassword" | null
  >(null);
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState(
    user?.profileImg || "https://placehold.co/80x80"
  );
  const { refetch } = useGetMeUserQuery(undefined, { skip: !token });
  const [login] = useLoginMutation();
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      firstName: user?.name?.split(" ")[0] || "",
      lastName: user?.name?.split(" ")[1] || "",
      phone: user?.contactNo,
      email: user?.email,
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmitUserDetails = async (data: FormData) => {
    if (!user?._id) {
      return;
    }

    setActionType("updateDetails");

    const formData = new FormData();

    formData.append(
      "data",
      JSON.stringify({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        contactNo: data.phone,
      })
    );
    if (profileImage) formData.append("file", profileImage);

    try {
      await updateUser({ id: user._id, body: formData }).unwrap();

      if (actionType === "updateDetails") {
        successAlert("User updated", "Profile updated successfully.");
      }
      setIsEditing(false);
      setActionType(null);
    } catch (err) {
      console.error(err);
      errorAlert("Failed to update user.");
      setActionType(null);
    }
  };

  const handleChangePassword = async (
    current: string,
    newPass: string,
    confirm: string
  ) => {
    if (newPass !== confirm) {
      errorAlert("Passwords do not match");
      return;
    }

    try {
      const data = { oldPassword: current, newPassword: newPass };
      const result = await changePassword(data).unwrap();

      console.log("Password Change Result:", result);

      // Silent re-login
      if (user?.email) {
        const loginResult = await login({
          email: user.email,
          password: newPass,
        }).unwrap();
        console.log("Login Result:", loginResult);
        dispatch(setCredentials(loginResult)); // Update token in Redux
        // await persistor.persist();
        const persistAuth = localStorage.getItem("persist:auth");

        if (persistAuth) {
          const parsed = JSON.parse(persistAuth);

          // update token only
          parsed.token = JSON.stringify(loginResult.accessToken);

          // save back
          localStorage.setItem("persist:auth", JSON.stringify(parsed));
        }

        await persistor.flush();
        // ensures token is fully persisted // Persist new token
      }

      await refetch();

      successAlert("Password updated", "Password changed successfully.");

      setIsPasswordModalOpen(false);
      setActionType(null);
    } catch (err: any) {
      // dispatch(clearCredentials());
      console.error(err);
      errorAlert(err?.data?.message || "Failed to change password.");
      setActionType(null);
    }
  };

  // const handleChangePassword = async (
  //   current: string,
  //   newPass: string,
  //   confirm: string
  // ) => {
  //   if (newPass !== confirm) {
  //     errorAlert("Passwords do not match");
  //     return;
  //   }

  //   setActionType("changePassword");

  //   try {
  //     const data = { oldPassword: current, newPassword: newPass };
  //     await changePassword(data).unwrap();

  //     // if (actionType === "changePassword") {
  //     //   successAlert("Password updated", "Password changed successfully.");
  //     // }

  //     // After successful password change, re-login the user silently to get a new token.

  //     // Use the email from the component's state or props.
  //     const email = user?.email;
  //     if (email) {
  //       const loginResult = await login({ email, password: newPass }).unwrap();
  //       dispatch(setCredentials(loginResult));
  //       successAlert(
  //         "Password updated",
  //         "You have successfully changed your password."
  //       );
  //     } else {
  //       throw new Error("User email not found.");
  //     }
  //     setIsPasswordModalOpen(false);
  //     setActionType(null);
  //   } catch (err: any) {
  //     console.error(err);
  //     errorAlert(err?.data?.message || "Failed to change password.");
  //     setActionType(null);
  //   }
  // };

  const renderInput = (
    label: string,
    name: keyof FormData,
    disabled: boolean = false,
    placeholder?: string
  ) => {
    const isEmailField = name === "email";
    const isSuperAdmin = user?.role === USER_ROLE.superAdmin; // ✅ check role

    const fieldDisabled =
      !isEditing || disabled || (isEmailField && !isSuperAdmin);

    const inputElement = (
      <input
        type="text"
        {...register(name, { required: `${label} is required` })}
        disabled={fieldDisabled}
        placeholder={placeholder}
        className={`w-full px-3 py-1 border border-gray-300 rounded focus:outline-none disabled:bg-gray-100 ${
          errors[name] ? "border-red-500" : ""
        }`}
      />
    );

    return (
      <div className="w-[364px] flex flex-col justify-start items-start gap-2">
        <label className="text-[#2B3738] text-sm font-normal">{label}</label>
        {isEmailField && !isSuperAdmin ? (
          <Tooltip title="You can't change your email. Please contact superadmin.">
            {inputElement}
          </Tooltip>
        ) : (
          inputElement
        )}
        {errors[name] && (
          <span className="text-sm text-red-500">{errors[name]?.message}</span>
        )}
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitUserDetails)}
      className="w-full h-full px-8 py-6 bg-white flex flex-col justify-start items-end gap-8"
    >
      {/* Header */}
      <div className="w-full flex justify-start items-end gap-8">
        <div className="text-black text-2xl font-medium font-ibm leading-8">
          Account settings
        </div>
      </div>

      {/* Profile Info */}
      <div className="w-full p-6 bg-[#F7F7F7] rounded border-2 border-[#e6f4ea] flex flex-col justify-start items-start gap-6">
        <div className="w-full flex flex-col justify-start items-start gap-12">
          <div className="w-full flex flex-col justify-start items-start gap-6">
            <div className="h-4" />
            <div className="w-full relative rounded-2xl flex flex-col justify-center items-center gap-3">
              <div className="w-20 h-20 relative rounded-2xl">
                <img
                  src={profileImagePreview}
                  alt="profile"
                  className="w-20 h-20 rounded"
                />
                <label className="p-1 rounded cursor-pointer flex items-center justify-center absolute bottom-0 right-0 bg-[#F7F7F7]">
                  <CameraIcon size={20} color="#83ac72" strokeWidth={2.5} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                    disabled={!isEditing}
                  />
                </label>
              </div>
            </div>
            <div className="w-full flex flex-col justify-start items-center gap-2">
              <h2 className="text-center font-bold ">
                {getValues("firstName") + " " + getValues("lastName")}
              </h2>
              <h2 className="text-center font-bold ">{getValues("email")}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Info and Update */}
      <div className="w-full flex flex-col justify-start items-start gap-12">
        {/* Enable Edit toggle and Update button */}
        <div className="w-full flex gap-65 items-center">
          <div className="min-h-[32px] px-4 bg-[#0d542b] rounded flex justify-center items-center gap-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isEditing}
                onChange={(e) => setIsEditing(e.target.checked)}
              />
              <span className="text-white font-medium">Enable Edit</span>
            </label>
          </div>
          {isEditing && (
            <button
              type="submit"
              className="px-4 py-[5px] bg-[#0d542b] text-white font-semibold rounded"
              disabled={isUpdatingUser}
            >
              <span className="text-white">
                {isUpdatingUser ? "Updating..." : "Update Details"}
              </span>
            </button>
          )}
        </div>

        {/* Inputs */}
        <div className="w-full flex justify-start items-center gap-[51px]">
          {renderInput("First Name", "firstName", false, "John")}
          {renderInput("Last Name", "lastName", false, "Doe")}
        </div>
        <div className="w-full flex justify-start items-center gap-[51px]">
          {renderInput("Phone Number", "phone", false, "+8801XXXXXXXXX")}
          {renderInput("Email", "email", false, "example@example.com")}
        </div>

        {/* Change Password Button */}
        <div className="w-full flex flex-col justify-start items-start gap-6">
          <div className="w-full flex gap-65 items-center">
            <div className="min-h-[32px] px-6 bg-[#0d542b] rounded font-medium text-white flex justify-center items-center gap-1 cursor-pointer">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsPasswordModalOpen(true);
                }}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      <PasswordUpdateModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSave={handleChangePassword}
        isSaving={isChangingPassword}
      />
    </form>
  );
};

export default UserProfileEdit;
