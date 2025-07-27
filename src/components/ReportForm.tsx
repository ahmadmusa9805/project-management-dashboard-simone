/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "antd";
import dayjs from "dayjs";

import "antd/dist/reset.css";

import ToastEditor from "./ToastEditor"; // adjust path if needed

const scheduleOptions = [
  { label: "Morning Shift", value: "morning" },
  { label: "Evening Shift", value: "evening" },
  { label: "Night Shift", value: "night" },
];

const teamOptions = [
  { label: "Team Alpha", value: "alpha" },
  { label: "Team Beta", value: "beta" },
  { label: "Team Gamma", value: "gamma" },
];

const statusOptions = [
  { label: "Ongoing", value: "ongoing" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
];

const weatherOptions = [
  { label: "Sunny", value: "sunny" },
  { label: "Rainy", value: "rainy" },
  { label: "Cloudy", value: "cloudy" },
  { label: "Windy", value: "windy" },
  { label: "Stormy", value: "stormy" },
];

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

const descriptionStyle: React.CSSProperties = {
  color: "#000E0F",
  fontSize: 14,
  fontWeight: 400,
  lineHeight: 1.5,
};

const ReportForm = () => {
  const [overviewContent, setOverviewContent] = useState("");

  const { control, handleSubmit, reset, getValues } = useForm({
    defaultValues: {
      title: "",
      date: new Date(),
      overview: "",
      location: "",
      weather: "",
      schedule: "",
      team: "",
      status: "",
    },
  });

  const onSubmit = (data: any) => {
    const fullData = {
      ...data,
      overview: overviewContent,
    };
    console.log("Submitted Data:", fullData);
    alert("Form submitted! Check console for data.");
  };

  const handleCancel = () => {
    reset();
    setOverviewContent("");
  };

  const renderImageInput = (label: string, onChange: (url: string) => void) => (
    <div className="mt-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Upload {label} Image
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === "string") {
              onChange(reader.result);
            }
          };
          reader.readAsDataURL(file);
        }}
      />
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto bg-white rounded-md shadow-md p-6"
    >
      {/* Overview Section */}
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
                className="text-2xl font-bold flex-1 border-b border-gray-300 focus:outline-none focus:border-blue-600 px-2 py-1"
              />
            )}
          />
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={dayjs(field.value)}
                onChange={(date) => field.onChange(date?.toDate())}
                className="border rounded px-2 py-1"
                format="ddd, DD MMM, YYYY"
              />
            )}
          />
        </div>
        <div className="border border-gray-300 rounded min-h-[300px] px-4 py-3">
          <ToastEditor
            initialValue={getValues("overview") || ""}
            height="400px"
            previewStyle="vertical"
            theme="light"
            onChange={(val) => setOverviewContent(val)}
          />
        </div>
      </section>

      {/* Weather Section */}
      <section style={sectionStyle}>
        <h2 style={headerStyle}>Weather</h2>
        <p style={descriptionStyle}>
          Attach the weather report to your daily log.
        </p>
        <Controller
          name="weather"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              className="w-full border border-gray-300 rounded px-3 py-2  focus:ring-2 focus:ring-blue-500 mb-2"
            >
              <option value="">Select Weather Condition</option>
              {weatherOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        />
        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              placeholder="Add Location"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        />
        {renderImageInput("Weather", () => {})}
      </section>

      {/* Schedule Section */}
      <section style={sectionStyle}>
        <h2 style={headerStyle}>Schedule</h2>
        <p style={descriptionStyle}>
          Capture your completed items/tasks automatically from the schedule
          feature.
        </p>
        <Controller
          name="schedule"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              className="w-full border border-gray-300 rounded px-3 py-2  focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Schedule</option>
              {scheduleOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        />
        {renderImageInput("Schedule", () => {})}
      </section>

      {/* Team Section */}
      <section style={sectionStyle}>
        <h2 style={headerStyle}>Labor & Team</h2>
        <p style={descriptionStyle}>
          Team members who enter hours will automatically show here.
        </p>
        <Controller
          name="team"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              className="w-full border border-gray-300 rounded px-3 py-2  focus:ring-2 focus:ring-blue-500 mb-4"
            >
              <option value="">Select Team</option>
              {teamOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              className="w-full border border-gray-300 rounded px-3 py-2  focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Status</option>
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        />
        {renderImageInput("Team", () => {})}
      </section>

      {/* Attachments Section */}
      <section className="flex justify-end gap-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Save
        </button>
      </section>
    </form>
  );
};

export default ReportForm;
