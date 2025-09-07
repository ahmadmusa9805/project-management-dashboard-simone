/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { Button, DatePicker, Input, Modal } from "antd";
import ToastEditor from "./ToastEditor";
import Dragger from "antd/es/upload/Dragger";
import { CloudUpload } from "lucide-react";
import CertificateDocumentSceoundFixViewer from "./CertificateDocumentSceoundFixViewer";

interface NoteFormProps {
  mode: "create" | "edit" | "view";
  isViewOnly?: boolean;
  initialData?: any;
  closeDrawer: () => void;
  creating: boolean;
  updating: boolean;
  onSave: (formData: any) => void;
  onDelete?: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({
  mode,
  isViewOnly = false,
  initialData,
  onSave,
  creating,
  updating,
  // onDelete,
  closeDrawer,
}) => {
  const projectId = useParams().projectId;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      date: dayjs(),
      noteDesc: "",
      value: 0,
      adminComment: undefined,
      clientComment: undefined,
      file: undefined as File | undefined,
    },
  });

  const noteStatus = initialData?.status;
  const isApprovedOrRejected =
    noteStatus === "approved" || noteStatus === "rejected";

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        noteDesc: initialData.description || "",
        clientComment: initialData.clientComment?.trim()
          ? initialData.clientComment
          : undefined,
        adminComment: initialData.adminComment?.trim()
          ? initialData.adminComment
          : undefined,
        // clientComment: initialData.clientComment || "",
        // adminComment: initialData.adminComment || "",
        value:
          initialData.value !== "" && initialData.value !== null
            ? Number(initialData.value)
            : undefined,
        date: initialData.date ? dayjs(initialData.date) : dayjs(),
        file: initialData.file || undefined,
      });
    }
  }, [initialData, reset]);

  const onSubmit = (data: any) => {
    let fileData: string | File | undefined = data.file;

    if (data.file && typeof data.file !== "string" && "name" in data.file) {
      fileData = data.file;
    } else if (initialData?.file && !data.file) {
      fileData = initialData.file;
    }

    const formData = {
      projectId,
      title: data.title,
      description: data.noteDesc,
      file: fileData,
      value: Number(data.value),
      date: data.date.toISOString(),
      clientComment: data.clientComment,
      adminComment: data.adminComment,
      status: initialData?.status || "pending",
      isDeleted: false,
    };

    console.log("Form Data:", formData);
    onSave(formData);
  };

  const isFormDisabled =
    isViewOnly || (mode === "edit" && isApprovedOrRejected);

  // ✅ Comments visibility rules
  const isClientCommentVisible =
    mode !== "create" &&
    !(
      (
        (mode === "edit" && !isApprovedOrRejected) || // hide in edit + pending
        (isViewOnly && noteStatus === "pending")
      ) // hide in view + pending
    );

  // ✅ Admin comment disabled rules
  const isAdminCommentDisabled =
    mode === "edit" && isApprovedOrRejected
      ? false
      : mode === "view" && isApprovedOrRejected
      ? false // enable only in view + approved/rejected
      : true;

  // const isDeleteButtonVisible = mode === "edit" && onDelete;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full p-3 pb-6 bg-white flex flex-col gap-4"
    >
      {/* Header */}
      <div className="w-full h-12 border-b border-[#E6E7E7] px-4 py-2 flex justify-between items-center">
        <div className="text-[#172B4D] text-[20px] font-bold">
          {watch("date")?.format("ddd, DD MMM, YYYY")}
        </div>
      </div>

      {/* Date */}
      <div className="w-full px-4 flex flex-col gap-3">
        <label className="text-[#2B3738] text-sm font-medium">Date</label>
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <DatePicker
              {...field}
              format="YYYY-MM-DD"
              className="w-full"
              disabled={isFormDisabled}
            />
          )}
        />
      </div>

      {/* Title */}
      <div className="w-full px-4 flex flex-col gap-3">
        <label className="text-[#2B3738] text-sm font-medium">Notes</label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <ToastEditor
              value={field.value}
              onChange={field.onChange}
              height="300px"
              readOnly={isFormDisabled}
              key={initialData?.id || "title"}
            />
          )}
        />
      </div>

      {/* Description */}
      <div className="w-full px-4 flex flex-col gap-3 mb-5">
        <label className="text-[#2B3738] text-sm font-medium">
          Extra cost Description
        </label>
        <Controller
          name="noteDesc"
          control={control}
          render={({ field }) => (
            <ToastEditor
              value={field.value}
              onChange={field.onChange}
              height="300px"
              readOnly={isFormDisabled}
              key={initialData?.id || "desc"}
            />
          )}
        />
      </div>

      {/* File Upload */}
      {/* <div className="w-full px-4 flex flex-col gap-3 mt-2">
        <label className="font-medium ">Upload File</label>
        <Controller
          control={control}
          name="file"
          render={({ field }) => (
            <Dragger
              disabled={isFormDisabled}
              name="file"
              accept=".pdf"
              beforeUpload={(file) => {
                field.onChange(file);
                return false;
              }}
              multiple={false}
              fileList={
                field.value
                  ? [
                      {
                        uid: (field.value as any).uid || field.value.name,
                        name: field.value.name,
                        status: "done" as const,
                        originFileObj: field.value,
                      } as any,
                    ]
                  : []
              }
              onRemove={() => field.onChange(undefined)}
              style={{ padding: "8px" }}
            >
              <p className="text-center flex flex-col items-center">
                <CloudUpload size={24} color="#83ac72" strokeWidth={2.5} />
              </p>
              <p className="text-[10px]">Click or drag file to upload</p>
            </Dragger>
          )}
        />
      </div> */}

      <div className="w-full px-4 flex flex-col gap-3 mt-2">
        <label className="font-medium ">Upload File</label>

        {!isFormDisabled ? (
          // ✅ Show Dragger (Upload) only if form is enabled
          <Controller
            control={control}
            name="file"
            render={({ field }) => (
              <Dragger
                disabled={isFormDisabled}
                name="file"
                accept=".pdf"
                beforeUpload={(file) => {
                  field.onChange(file);
                  return false;
                }}
                multiple={false}
                fileList={
                  field.value
                    ? [
                        {
                          uid: (field.value as any).uid || field.value.name,
                          name: field.value.name,
                          status: "done" as const,
                          originFileObj: field.value,
                        } as any,
                      ]
                    : []
                }
                onRemove={() => field.onChange(undefined)}
                style={{ padding: "8px" }}
              >
                <p className="text-center flex flex-col items-center">
                  <CloudUpload size={24} color="#83ac72" strokeWidth={2.5} />
                </p>
                <p className="text-[10px]">Click or drag file to upload</p>
              </Dragger>
            )}
          />
        ) : (
          // ✅ Show "View File" button only if disabled mode & file exists
          initialData?.file && (
            <>
              <div className="flex flex-col gap-2">
                <Button
                  type="primary"
                  className="px-4 py-2 text-sm font-medium text-white rounded "
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  View File
                </Button>

                {/* Viewer Component */}
                {/* <CertificateDocumentSceoundFixViewer
                propfileUrl={initialData?.file as string}
              /> */}
              </div>

              {/* Modal for showing file */}
              <Modal
                open={isModalOpen}
                title="File Viewer"
                onCancel={() => setIsModalOpen(false)}
                footer={[
                  <Button
                    type="text"
                    className="cancel"
                    key="close"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </Button>,
                ]}
                width={800} // adjust size if needed
              >
                <CertificateDocumentSceoundFixViewer
                  propfileUrl={initialData?.file as string}
                />
              </Modal>
            </>
          )
        )}
      </div>

      {/* Value */}
      <div className="w-full px-4 flex flex-col gap-3">
        <label className="text-[#2B3738] text-sm font-medium">Extra Cost</label>
        <Controller
          name="value"
          control={control}
          rules={{ required: "Value is required" }}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              placeholder="Enter value..."
              disabled={isFormDisabled}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        {errors.value && (
          <span className="text-red-500 text-sm">{errors.value.message}</span>
        )}
      </div>

      {/* Client + Admin Comments */}
      {isClientCommentVisible && (
        <>
          <div className="w-full px-4 flex flex-col gap-3">
            <label className="text-[#2B3738] text-sm font-medium">
              Client Comment
            </label>
            <Controller
              name="clientComment"
              control={control}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  rows={2}
                  readOnly={true}
                  placeholder="Client comment..."
                />
              )}
            />
          </div>

          <div className="w-full px-4 flex flex-col gap-3">
            <label className="text-[#2B3738] text-sm font-medium">
              Admin Reply
            </label>
            <Controller
              name="adminComment"
              control={control}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  rows={2}
                  placeholder="Enter admin reply..."
                  disabled={isAdminCommentDisabled}
                />
              )}
            />
          </div>
        </>
      )}

      {/* Footer */}
      <div className="w-full px-4 flex gap-4 justify-end mt-4">
        {mode === "create" && (
          <>
            <Button
              type="text"
              onClick={closeDrawer}
              className="px-6 py-2 text-sm font-medium cancel"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="px-6 py-2 bg-[#001D01] text-white text-sm font-medium rounded hover:bg-[#003F03]"
              loading={creating}
            >
              Create Note
            </Button>
          </>
        )}

        {mode === "edit" && isApprovedOrRejected && (
          <>
            <Button
              type="text"
              onClick={closeDrawer}
              className="px-6 py-2 text-sm font-medium cancel"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              className="px-6 py-2 bg-[#001D01] text-white text-sm font-medium rounded hover:bg-[#003F03]"
              loading={updating}
            >
              Reply
            </Button>
          </>
        )}

        {mode === "edit" && !isApprovedOrRejected && (
          <>
            {/* {isDeleteButtonVisible && (
              <button
                type="button"
                onClick={onDelete}
                className="px-6 py-2 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-50"
              >
                Delete Note
              </button>
            )} */}
            <Button
              type="text"
              onClick={closeDrawer}
              className="px-6 py-2 text-sm font-medium cancel"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="px-6 py-2 "
              loading={updating}
            >
              Update Note
            </Button>
          </>
        )}

        {mode === "view" && (
          <Button
            type="primary"
            htmlType="submit"
            onClick={closeDrawer}
            className="px-6 py-2 bg-[#001D01] text-white text-sm font-medium rounded hover:bg-[#003F03]"
          >
            Done
          </Button>
        )}
      </div>
    </form>
  );
};

export default NoteForm;
