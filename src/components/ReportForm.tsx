// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { DatePicker } from "antd";
// import dayjs from "dayjs";

// import "antd/dist/reset.css";

// import ToastEditor from "./ToastEditor"; // adjust path if needed

// const scheduleOptions = [
//   { label: "Morning Shift", value: "morning" },
//   { label: "Evening Shift", value: "evening" },
//   { label: "Night Shift", value: "night" },
// ];

// const teamOptions = [
//   { label: "Team Alpha", value: "alpha" },
//   { label: "Team Beta", value: "beta" },
//   { label: "Team Gamma", value: "gamma" },
// ];

// const statusOptions = [
//   { label: "Ongoing", value: "ongoing" },
//   { label: "In Progress", value: "in_progress" },
//   { label: "Completed", value: "completed" },
// ];

// const weatherOptions = [
//   { label: "Sunny", value: "sunny" },
//   { label: "Rainy", value: "rainy" },
//   { label: "Cloudy", value: "cloudy" },
//   { label: "Windy", value: "windy" },
//   { label: "Stormy", value: "stormy" },
// ];

// const sectionStyle: React.CSSProperties = {
//   width: "100%",
//   padding: 16,
//   outline: "1px solid #E6E7E7",
//   outlineOffset: "-1px",
//   display: "flex",
//   flexDirection: "column",
//   gap: 16,
//   marginBottom: 24,
// };

// const headerStyle: React.CSSProperties = {
//   color: "#000E0F",
//   fontSize: 18,
//   fontWeight: 600,
// };

// const descriptionStyle: React.CSSProperties = {
//   color: "#000E0F",
//   fontSize: 14,
//   fontWeight: 400,
//   lineHeight: 1.5,
// };

// const ReportForm = () => {
//   const [overviewContent, setOverviewContent] = useState("");

//   const { control, handleSubmit, reset, getValues } = useForm({
//     defaultValues: {
//       title: "",
//       date: new Date(),
//       overview: "",
//       location: "",
//       weather: "",
//       schedule: "",
//       team: "",
//       status: "",
//     },
//   });

//   const onSubmit = (data: any) => {
//     const fullData = {
//       ...data,
//       overview: overviewContent,
//     };
//     console.log("Submitted Data:", fullData);
//     alert("Form submitted! Check console for data.");
//   };

//   const handleCancel = () => {
//     reset();
//     setOverviewContent("");
//   };

//   const renderImageInput = (label: string, onChange: (url: string) => void) => (
//     <div className="mt-2">
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         Upload {label} Image
//       </label>
//       <input
//         type="file"
//         accept="image/*"
//         onChange={(e) => {
//           const file = e.target.files?.[0];
//           if (!file) return;
//           const reader = new FileReader();
//           reader.onload = () => {
//             if (typeof reader.result === "string") {
//               onChange(reader.result);
//             }
//           };
//           reader.readAsDataURL(file);
//         }}
//       />
//     </div>
//   );

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="max-w-3xl mx-auto bg-white rounded-md shadow-md p-6"
//     >
//       {/* Overview Section */}
//       <section style={sectionStyle}>
//         <h2 style={headerStyle}>Overview</h2>
//         <div className="flex items-center justify-between space-x-4">
//           <Controller
//             name="title"
//             control={control}
//             render={({ field }) => (
//               <input
//                 {...field}
//                 placeholder="Report Title"
//                 className="text-2xl font-bold flex-1 border-b border-gray-300 focus:outline-none focus:border-blue-600 px-2 py-1"
//               />
//             )}
//           />
//           <Controller
//             name="date"
//             control={control}
//             render={({ field }) => (
//               <DatePicker
//                 value={dayjs(field.value)}
//                 onChange={(date) => field.onChange(date?.toDate())}
//                 className="border rounded px-2 py-1"
//                 format="ddd, DD MMM, YYYY"
//               />
//             )}
//           />
//         </div>
//         <div className="border border-gray-300 rounded min-h-[300px] px-4 py-3">
//           <ToastEditor
//             initialValue={getValues("overview") || ""}
//             height="400px"
//             previewStyle="vertical"
//             theme="light"
//             onChange={(val) => setOverviewContent(val)}
//           />
//         </div>
//       </section>

//       {/* Weather Section */}
//       <section style={sectionStyle}>
//         <h2 style={headerStyle}>Weather</h2>
//         <p style={descriptionStyle}>
//           Attach the weather report to your daily log.
//         </p>
//         <Controller
//           name="weather"
//           control={control}
//           render={({ field }) => (
//             <select
//               {...field}
//               className="w-full border border-gray-300 rounded px-3 py-2  focus:ring-2 focus:ring-blue-500 mb-2"
//             >
//               <option value="">Select Weather Condition</option>
//               {weatherOptions.map((opt) => (
//                 <option key={opt.value} value={opt.value}>
//                   {opt.label}
//                 </option>
//               ))}
//             </select>
//           )}
//         />
//         <Controller
//           name="location"
//           control={control}
//           render={({ field }) => (
//             <input
//               {...field}
//               placeholder="Add Location"
//               className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           )}
//         />
//         {renderImageInput("Weather", () => {})}
//       </section>

//       {/* Schedule Section */}
//       <section style={sectionStyle}>
//         <h2 style={headerStyle}>Schedule</h2>
//         <p style={descriptionStyle}>
//           Capture your completed items/tasks automatically from the schedule
//           feature.
//         </p>
//         <Controller
//           name="schedule"
//           control={control}
//           render={({ field }) => (
//             <select
//               {...field}
//               className="w-full border border-gray-300 rounded px-3 py-2  focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select Schedule</option>
//               {scheduleOptions.map((opt) => (
//                 <option key={opt.value} value={opt.value}>
//                   {opt.label}
//                 </option>
//               ))}
//             </select>
//           )}
//         />
//         {renderImageInput("Schedule", () => {})}
//       </section>

//       {/* Team Section */}
//       <section style={sectionStyle}>
//         <h2 style={headerStyle}>Labor & Team</h2>
//         <p style={descriptionStyle}>
//           Team members who enter hours will automatically show here.
//         </p>
//         <Controller
//           name="team"
//           control={control}
//           render={({ field }) => (
//             <select
//               {...field}
//               className="w-full border border-gray-300 rounded px-3 py-2  focus:ring-2 focus:ring-blue-500 mb-4"
//             >
//               <option value="">Select Team</option>
//               {teamOptions.map((opt) => (
//                 <option key={opt.value} value={opt.value}>
//                   {opt.label}
//                 </option>
//               ))}
//             </select>
//           )}
//         />
//         <Controller
//           name="status"
//           control={control}
//           render={({ field }) => (
//             <select
//               {...field}
//               className="w-full border border-gray-300 rounded px-3 py-2  focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select Status</option>
//               {statusOptions.map((opt) => (
//                 <option key={opt.value} value={opt.value}>
//                   {opt.label}
//                 </option>
//               ))}
//             </select>
//           )}
//         />
//         {renderImageInput("Team", () => {})}
//       </section>

//       {/* Attachments Section */}
//       <section className="flex justify-end gap-4">
//         <button
//           type="button"
//           onClick={handleCancel}
//           className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
//         >
//           Cancel
//         </button>
//         <button
//           type="submit"
//           className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//         >
//           Save
//         </button>
//       </section>
//     </form>
//   );
// };

// export default ReportForm;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { Button, DatePicker } from "antd";
// import dayjs from "dayjs";

// import "antd/dist/reset.css";

// import ToastEditor from "./ToastEditor";

// const sectionStyle: React.CSSProperties = {
//   width: "100%",
//   padding: 16,
//   outline: "1px solid #E6E7E7",
//   outlineOffset: "-1px",
//   display: "flex",
//   flexDirection: "column",
//   gap: 16,
//   marginBottom: 24,
// };

// const headerStyle: React.CSSProperties = {
//   color: "#000E0F",
//   fontSize: 18,
//   fontWeight: 600,
// };

// const descriptionStyle: React.CSSProperties = {
//   color: "#000E0F",
//   fontSize: 14,
//   fontWeight: 400,
//   lineHeight: 1.5,
// };

// export interface ReportFormData {
//   title: string;
//   date: Date;
//   overviewText: string;
//   overviewFiles: File[];
//   weatherFiles: File[];
//   workingDaysFiles: File[];
//   LaborTeamFiles: File[];
// }

// interface ReportFormProps {
//   onSubmit: (formData: ReportFormData) => Promise<void>;
//   creating?: boolean;
//   onCancel?: () => void;
// }

// const ReportForm: React.FC<ReportFormProps> = ({
//   onSubmit,
//   creating,
//   onCancel,
// }) => {
//   const [overviewContent, setOverviewContent] = useState("");
//   const [overviewFiles, setOverviewFiles] = useState<File[]>([]);
//   const [weatherFiles, setWeatherFiles] = useState<File[]>([]);
//   const [workingDaysFiles, setWorkingDaysFiles] = useState<File[]>([]);
//   const [LaborTeamFiles, setLaborTeamFiles] = useState<File[]>([]);

//   const { control, handleSubmit, reset, setValue } = useForm<ReportFormData>({
//     defaultValues: {
//       title: "",
//       date: new Date(),
//       overviewText: "",
//       overviewFiles: [],
//       weatherFiles: [],
//       workingDaysFiles: [],
//       LaborTeamFiles: [],
//     },
//   });

//   const onSubmitHandler = async (data: ReportFormData) => {
//     onSubmit(data as any);
//   };

//   const handleCancel = () => {
//     onCancel?.();
//     reset();
//     setOverviewContent("");
//     setOverviewFiles([]);
//     setWeatherFiles([]);
//     setWorkingDaysFiles([]);
//     setLaborTeamFiles([]);
//   };

//   const handleFileChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     setFiles: React.Dispatch<React.SetStateAction<File[]>>,
//     fieldName: keyof ReportFormData
//   ) => {
//     const files = e.target.files;
//     if (!files) return;
//     const fileList = Array.from(files);
//     setFiles(fileList);
//     setValue(fieldName, fileList as any);
//   };

//   const renderImageInput = (
//     label: string,
//     files: File[],
//     setFiles: React.Dispatch<React.SetStateAction<File[]>>,
//     fieldName: keyof ReportFormData
//   ) => (
//     <div className="mt-2">
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         Upload {label} Image(s)
//       </label>
//       <input
//         type="file"
//         accept="image/*"
//         multiple
//         onChange={(e) => handleFileChange(e, setFiles, fieldName)}
//       />
//       {files.length > 0 && (
//         <ul className="text-xs text-gray-500 mt-2">
//           {files.map((file, index) => (
//             <li key={index}>{file.name}</li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmitHandler)}
//       className="max-w-3xl mx-auto bg-white rounded-md"
//     >
//       {/* Overview */}
//       <section style={sectionStyle}>
//         <h2 style={headerStyle}>Overview</h2>
//         <div className="flex items-center justify-between space-x-4">
//           <Controller
//             name="title"
//             control={control}
//             render={({ field }) => (
//               <input
//                 {...field}
//                 placeholder="Report Title"
//                 className="text-2xl font-bold flex-1 border-b border-[#0d542b]  focus:outline-none focus:border-[#0d542b] px-2 py-1"
//               />
//             )}
//           />
//           <Controller
//             name="date"
//             control={control}
//             render={({ field }) => (
//               <DatePicker
//                 value={dayjs(field.value)}
//                 onChange={(date) =>
//                   field.onChange(date?.toDate() || new Date())
//                 }
//                 className="border rounded px-2 py-1"
//                 format="ddd, DD MMM, YYYY"
//               />
//             )}
//           />
//         </div>
//         <div className="border border-gray-300 rounded min-h-[300px] px-4 py-3">
//           <ToastEditor
//             initialValue={overviewContent}
//             height="400px"
//             onChange={(val) => {
//               setOverviewContent(val);
//               setValue("overviewText", val);
//             }}
//           />
//         </div>
//         {renderImageInput(
//           "Overview",
//           overviewFiles,
//           setOverviewFiles,
//           "overviewFiles"
//         )}
//       </section>

//       {/* Weather */}
//       <section style={sectionStyle}>
//         <h2 style={headerStyle}>Weather</h2>
//         <p style={descriptionStyle}>
//           Attach the weather report to your daily log.
//         </p>
//         {renderImageInput(
//           "Weather",
//           weatherFiles,
//           setWeatherFiles,
//           "weatherFiles"
//         )}
//       </section>

//       {/* Schedule */}
//       <section style={sectionStyle}>
//         <h2 style={headerStyle}>Schedule</h2>
//         <p style={descriptionStyle}>
//           Capture completed items/tasks automatically from the schedule.
//         </p>
//         {renderImageInput(
//           "Schedule",
//           workingDaysFiles,
//           setWorkingDaysFiles,
//           "workingDaysFiles"
//         )}
//       </section>

//       {/* Team */}
//       <section style={sectionStyle}>
//         <h2 style={headerStyle}>Labor & Team</h2>
//         <p style={descriptionStyle}>
//           Team members who enter hours will automatically show here.
//         </p>
//         {renderImageInput(
//           "Team",
//           LaborTeamFiles,
//           setLaborTeamFiles,
//           "LaborTeamFiles"
//         )}
//       </section>

//       {/* Actions */}
//       <section className="flex justify-end gap-4">
//         <Button
//           type="text"
//           onClick={handleCancel}
//           className="flex-1 h-12 px-6  rounded cancel text-base font-medium leading-6 "
//         >
//           Cancel
//         </Button>
//         <Button
//           htmlType="submit"
//           type="primary"
//           className="flex-1 h-12 px-6 bg-[#001D01] rounded text-white text-base font-medium leading-6 tracking-wide"
//           loading={creating}
//         >
//           Create
//         </Button>
//       </section>
//     </form>
//   );
// };

// export default ReportForm;

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, DatePicker, Upload } from "antd";
import type { UploadFile, UploadFileStatus } from "antd/es/upload/interface";
import { CloudUpload } from "lucide-react";
import dayjs from "dayjs";

import "antd/dist/reset.css";
import ToastEditor from "./ToastEditor";

const { Dragger } = Upload;

const sectionStyle: React.CSSProperties = {
  width: "100%",
  padding: 16,
  outline: "1px solid #E6E7E7",
  outlineOffset: "-1px",
  display: "flex",
  flexDirection: "column",
  gap: 16,
  marginBottom: 24,
};

const headerStyle: React.CSSProperties = {
  color: "#000E0F",
  fontSize: 18,
  fontWeight: 600,
};

// const descriptionStyle: React.CSSProperties = {
//   color: "#000E0F",
//   fontSize: 14,
//   fontWeight: 400,
//   lineHeight: 1.5,
// };

export interface ReportFormData {
  title: string;
  date: Date;
  overviewText: string;
  overviewFiles: File[];
  weatherFiles: File[];
  workingDaysFiles: File[];
  LaborTeamFiles: File[];
  dailyReportPdf?: File; // ✅ new optional PDF upload
}

interface ReportFormProps {
  onSubmit: (formData: ReportFormData) => Promise<void>;
  creating?: boolean;
  onCancel?: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({
  onSubmit,
  creating,
  onCancel,
}) => {
  const [overviewContent, setOverviewContent] = useState("");
  const [overviewFiles, setOverviewFiles] = useState<File[]>([]);
  const [weatherFiles, setWeatherFiles] = useState<File[]>([]);
  const [workingDaysFiles, setWorkingDaysFiles] = useState<File[]>([]);
  const [LaborTeamFiles, setLaborTeamFiles] = useState<File[]>([]);
  // const [dailyReportPdf, setDailyReportPdf] = useState<File | undefined>(
  //   undefined
  // );

  const { control, handleSubmit, reset, setValue } = useForm<ReportFormData>({
    defaultValues: {
      title: "",
      date: new Date(),
      overviewText: "",
      overviewFiles: [],
      weatherFiles: [],
      workingDaysFiles: [],
      LaborTeamFiles: [],
      // dailyReportPdf: undefined,
    },
  });

  const onSubmitHandler = async (data: ReportFormData) => {
    onSubmit(data as any);
  };

  const handleCancel = () => {
    onCancel?.();
    reset();
    setOverviewContent("");
    setOverviewFiles([]);
    setWeatherFiles([]);
    setWorkingDaysFiles([]);
    setLaborTeamFiles([]);
    // setDailyReportPdf(undefined);
  };

  // ✅ Reusable Dragger Input
  const renderFileInput = (
    label: string,
    files: File[] | File | undefined,
    setFiles: React.Dispatch<any>,
    fieldName: keyof ReportFormData,
    accept: string = "image/*",
    multiple: boolean = true,
    maxFiles: number = 5 // ✅ new max files option
  ) => (
    <Controller
      name={fieldName as any}
      control={control}
      render={({ field }) => {
        const props = {
          name: "file",
          accept,
          multiple,
          beforeUpload: (file: File) => {
            if (multiple) {
              const currentFiles = Array.isArray(files) ? files : [];
              if (currentFiles.length >= maxFiles) {
                // ✅ prevent adding more than max
                alert(`You can only upload up to ${maxFiles} files.`);
                return Upload.LIST_IGNORE;
              }
              const updatedFiles = [...currentFiles, file];
              setFiles(updatedFiles);
              field.onChange(updatedFiles);
            } else {
              setFiles(file);
              field.onChange(file);
            }
            return false; // ✅ stop auto-upload
          },
          fileList: Array.isArray(files)
            ? files.map(
                (f, index) =>
                  ({
                    uid: `${f.name}-${index}`,
                    name: f.name,
                    status: "done" as UploadFileStatus,
                    originFileObj: f,
                    type: f.type,
                    size: f.size,
                  } as UploadFile)
              )
            : files
            ? [
                {
                  uid: (files as File).name,
                  name: (files as File).name,
                  status: "done" as UploadFileStatus,
                  originFileObj: files as File,
                  type: (files as File).type,
                  size: (files as File).size,
                } as UploadFile,
              ]
            : [],
          onRemove: (file: any) => {
            if (multiple) {
              const updatedFiles = (files as File[]).filter(
                (f) => f.name !== file.name
              );
              setFiles(updatedFiles);
              field.onChange(updatedFiles);
            } else {
              setFiles(undefined);
              field.onChange(undefined);
            }
          },
        };

        return (
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload {label} (max {maxFiles}){" "}
              {accept === ".pdf" ? "PDF" : "Image(s)"}
            </label>
            <Dragger {...props} style={{ padding: "8px" }}>
              <p className="text-center flex flex-col items-center">
                <CloudUpload size={24} color="#83ac72" strokeWidth={2.5} />
              </p>
              <p className="text-[10px]">
                Click or drag {accept === ".pdf" ? "PDF" : "files"} to upload
              </p>
            </Dragger>
          </div>
        );
      }}
    />
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="max-w-3xl mx-auto bg-white rounded-md"
    >
      {/* Overview */}
      <section style={sectionStyle}>
        <h2 style={headerStyle}>Overview</h2>
        <div className="flex items-center justify-between space-x-4">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Report Title"
                className="text-2xl font-bold flex-1 border-b border-[#0d542b] focus:outline-none focus:border-[#0d542b] px-2 py-1"
              />
            )}
          />
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={dayjs(field.value)}
                onChange={(date) =>
                  field.onChange(date?.toDate() || new Date())
                }
                className="border rounded px-2 py-1"
                format="ddd, DD MMM, YYYY"
              />
            )}
          />
        </div>
        <div className="border border-gray-300 rounded min-h-[300px] px-4 py-3">
          <ToastEditor
            initialValue={overviewContent}
            height="150px"
            onChange={(val) => {
              setOverviewContent(val);
              setValue("overviewText", val);
            }}
          />
        </div>
        {renderFileInput(
          "Overview",
          overviewFiles,
          setOverviewFiles,
          "overviewFiles",
          "image/*",
          true,
          5
        )}
      </section>

      {/* Weather */}
      <section style={sectionStyle}>
        <h2 style={headerStyle}>Weather</h2>
        {/* <p style={descriptionStyle}>
          Attach the weather report to your daily log.
        </p> */}
        {renderFileInput(
          "Weather",
          weatherFiles,
          setWeatherFiles,
          "weatherFiles",
          "image/*",
          true,
          5
        )}
      </section>

      {/* Schedule */}
      <section style={sectionStyle}>
        <h2 style={headerStyle}>Schedule</h2>
        {/* <p style={descriptionStyle}>
          Capture completed items/tasks automatically from the schedule.
        </p> */}
        {renderFileInput(
          "Schedule",
          workingDaysFiles,
          setWorkingDaysFiles,
          "workingDaysFiles",
          "image/*",
          true,
          5
        )}
      </section>

      {/* Team */}
      <section style={sectionStyle}>
        <h2 style={headerStyle}>Labor & Team</h2>
        {/* <p style={descriptionStyle}>
          Team members who enter hours will automatically show here.
        </p> */}
        {renderFileInput(
          "Team",
          LaborTeamFiles,
          setLaborTeamFiles,
          "LaborTeamFiles",
          "image/*",
          true,
          5
        )}
      </section>

      {/* Daily Report PDF (Optional) */}
      {/* <section style={sectionStyle}>
        <h2 style={headerStyle}>Daily Report PDF</h2>
        <p style={descriptionStyle}>Optionally upload the report in PDF.</p>
        {renderFileInput(
          "Daily Report",
          dailyReportPdf,
          setDailyReportPdf,
          "dailyReportPdf",
          ".pdf",
          false
        )}
      </section> */}

      {/* Actions */}
      <section className="flex justify-end gap-4">
        <Button
          type="text"
          onClick={handleCancel}
          className="flex-1 h-12 px-6 rounded cancel text-base font-medium leading-6"
        >
          Cancel
        </Button>
        <Button
          htmlType="submit"
          type="primary"
          className="flex-1 h-12 px-6 bg-[#001D01] rounded text-white text-base font-medium leading-6 tracking-wide"
          loading={creating}
        >
          Create
        </Button>
      </section>
    </form>
  );
};

export default ReportForm;
