/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type React from "react";
import { useState, useEffect } from "react";
import { Button, Input, DatePicker, Upload, message, Spin } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";

import dayjs from "dayjs";
import {
  useGetSingleSiteReportQuery,
  useUpdateSiteReportMutation,
} from "../Redux/features/projects/project/siteReportPictures/reportApi";
import { successAlert } from "../utils/alerts";

const { TextArea } = Input;

interface SiteReportDetailProps {
  reportId: string;
  mode: "view" | "edit";
  onBack: () => void;
  onModeChange: (mode: "view" | "edit") => void;
  refetchReports: () => void;
}

const SiteReportDetail: React.FC<SiteReportDetailProps> = ({
  refetchReports,
  reportId,
  mode,
  onBack,
  onModeChange,
}) => {
  console.log(
    "Rendering SiteReportDetail with reportId:",
    reportId,
    "and mode:",
    mode
  );
  const {
    data: report,
    isLoading,
    error,
  } = useGetSingleSiteReportQuery(reportId);
  const [updateReport, { isLoading: isUpdating }] =
    useUpdateSiteReportMutation();

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    overviewText: "",
    overviewFile: [] as File[],
    weather: [] as File[],
    workingDays: [] as File[],
    LaborTeam: [] as File[],
  });

  useEffect(() => {
    if (report) {
      setFormData({
        title: report.title,
        date: report.date,
        overviewText: report.overviewText,
        overviewFile: [],
        weather: [],
        workingDays: [],
        LaborTeam: [],
      });
    }
  }, [report]);

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("overviewText", formData.overviewText);
      // Append files
      formData.overviewFile.forEach((file) => {
        formDataToSend.append("overviewFile", file);
      });
      formData.weather.forEach((file) => {
        formDataToSend.append("weather", file);
      });
      formData.workingDays.forEach((file) => {
        formDataToSend.append("workingDays", file);
      });
      formData.LaborTeam.forEach((file) => {
        formDataToSend.append("LaborTeam", file);
      });
      await updateReport({ id: reportId, data: formDataToSend }).unwrap();
      refetchReports();
      successAlert("Report updated successfully");
      onModeChange("view");
    } catch (error) {
      message.error("Failed to update report");
    }
  };

  const handleFileChange = (field: keyof typeof formData, fileList: any[]) => {
    const files = fileList
      .map((file) => file.originFileObj || file)
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, [field]: files }));
  };

  const renderImages = (images: string[] | undefined, placeholder: string) => {
    if (!images || images.length === 0) {
      return (
        <div className="flex gap-4">
          <img
            src="/placeholder.svg?height=163&width=210"
            alt={placeholder}
            className="w-[210px] h-[163px] bg-gray-200 rounded"
          />
          <img
            src="/placeholder.svg?height=163&width=210"
            alt={placeholder}
            className="w-[210px] h-[163px] bg-gray-200 rounded"
          />
        </div>
      );
    }

    return (
      <div className="flex gap-4">
        {images.map((image, index) => (
          <img
            key={index}
            src={image || "/placeholder.svg?height=163&width=210"}
            alt={`${placeholder} ${index + 1}`}
            className="w-[210px] h-[163px] bg-gray-200 rounded object-cover"
          />
        ))}
      </div>
    );
  };

  const renderUploadSection = (field: keyof typeof formData, title: string) => (
    <div className="p-4 bg-gray-100 rounded flex flex-col gap-4">
      <div className="text-gray-700 text-sm font-medium">{title}</div>
      <Upload
        multiple
        beforeUpload={() => false}
        onChange={({ fileList }) => handleFileChange(field, fileList)}
        className="w-full"
      >
        <Button icon={<UploadOutlined />}>Upload Images</Button>
      </Upload>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="text-center text-red-500 p-8">Failed to load report</div>
    );
  }

  return (
    <div className="w-full h-full px-2 py-6 bg-white rounded flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2.5 border-b border-gray-200">
        <div className="flex items-center gap-1">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={onBack}
            className="p-0 w-6 h-6"
          />
          {mode === "edit" ? (
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="text-xl font-bold border-none p-0 bg-transparent"
              style={{ fontSize: "20px", fontWeight: "700", color: "#172B4D" }}
            />
          ) : (
            <div className="text-xl font-bold text-gray-800">
              {report.title}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {mode === "edit" ? (
            <DatePicker
              value={formData.date ? dayjs(formData.date) : null}
              onChange={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  date: date ? date.format("YYYY-MM-DD") : "",
                }))
              }
              format="ddd, DD MMM, YYYY"
            />
          ) : (
            <div className="text-xl font-bold text-gray-800">
              {dayjs(report.date).format("ddd, DD MMM, YYYY")}
            </div>
          )}
          {mode === "view" && (
            <Button
              type="primary"
              onClick={() => onModeChange("edit")}
              className="bg-green-800"
            >
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Overview Section */}
      <div className="p-4 bg-gray-100 rounded flex flex-col gap-4">
        <div className="text-gray-700 text-sm font-medium">Overview</div>
        {/* Overview Section */}
        <div className="p-4 bg-gray-100 rounded flex flex-col gap-4">
          <div className="text-gray-700 text-sm font-medium">Overview</div>

          {mode === "view" ? (
            <>
              {renderImages(report.overviewFile, "Overview")}
              <div className="text-black text-base leading-6 whitespace-pre-wrap">
                {
                  // Remove any HTML tags and show plain text
                  report.overviewText
                    ? report.overviewText.replace(/<\/?[^>]+(>|$)/g, "")
                    : "No description available."
                }
              </div>
            </>
          ) : (
            <>
              {renderUploadSection("overviewFile", "Upload Overview Images")}
              <TextArea
                value={
                  // Clean text if it comes with tags
                  formData.overviewText.replace(/<\/?[^>]+(>|$)/g, "")
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    overviewText: e.target.value,
                  }))
                }
                rows={4}
                placeholder="Enter overview text..."
              />
            </>
          )}
        </div>
      </div>

      {/* Weather Condition Section */}
      <div className="p-4 bg-gray-100 rounded flex flex-col gap-4">
        <div className="text-gray-700 text-sm font-medium">
          Weather condition
        </div>
        {mode === "view"
          ? renderImages(report.weather, "Weather condition")
          : renderUploadSection("weather", "Upload Weather Images")}
      </div>

      {/* Working Days Section */}
      <div className="p-4 bg-gray-100 rounded flex flex-col gap-4">
        <div className="text-gray-700 text-sm font-medium">Working days</div>
        {mode === "view"
          ? renderImages(report.workingDays, "Working days")
          : renderUploadSection("workingDays", "Upload Working Days Images")}
      </div>

      {/* Labour & Team Section */}
      <div className="p-4 bg-gray-100 rounded flex flex-col gap-4">
        <div className="text-gray-700 text-sm font-medium">Labour & team</div>
        {mode === "view"
          ? renderImages(report.LaborTeam, "Labour & team")
          : renderUploadSection("LaborTeam", "Upload Labour & Team Images")}
      </div>

      {/* Action Buttons */}
      <div className="px-4 flex gap-4">
        {mode === "edit" ? (
          <>
            <Button
              type="primary"
              size="large"
              onClick={handleSave}
              loading={isUpdating}
              className="flex-1 h-12 bg-green-800 hover:bg-green-700"
            >
              Save Changes
            </Button>
            <Button
              size="large"
              onClick={() => onModeChange("view")}
              className="flex-1 h-12"
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            type="primary"
            size="large"
            onClick={onBack}
            className="flex-1 h-12 bg-green-800 hover:bg-green-700"
          >
            Done
          </Button>
        )}
      </div>
    </div>
  );
};

export default SiteReportDetail;
