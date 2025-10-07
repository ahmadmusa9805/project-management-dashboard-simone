/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card, Typography, Divider, Button } from "antd";
import { FileOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

interface ViewSnaggingAndTimeScheduleProps {
  data: any;
  type: "snagging" | "timeSchedule";
  onClose: () => void;
}

const ViewSnaggingAndTimeSchedule: React.FC<
  ViewSnaggingAndTimeScheduleProps
> = ({ data, type, onClose }) => {
  if (!data) return null;

  // Normalize file data
  const fileList =
    type === "snagging" ? data?.file || [] : data?.file ? [data.file] : [];

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>
          {type === "snagging" ? "Snagging Details" : "Time Schedule Details"}
        </Title>
        <Button onClick={onClose} type="text" className="cancel">
          Close
        </Button>
      </div>

      <Divider />

      <Card bordered={false} className="bg-gray-50 rounded-xl">
        <Title level={4}>{data.title}</Title>

        {data.description && (
          <Paragraph className="text-gray-700">{data.description}</Paragraph>
        )}

        {/* Time Schedule specific fields */}
        {type === "timeSchedule" && (
          <div className="mb-4 text-gray-600">
            <Text strong>Start Date: </Text>
            {data.startDate
              ? new Date(data.startDate).toLocaleDateString()
              : "N/A"}
            <br />
            <Text strong>End Date: </Text>
            {data.endDate ? new Date(data.endDate).toLocaleDateString() : "N/A"}
          </div>
        )}

        {/* Files */}
        {fileList.length > 0 && (
          <>
            <Divider />
            <Text strong className="text-gray-800">
              Attached Files:
            </Text>
            <ul className="mt-2 space-y-1">
              {fileList.map((file: string, index: number) => (
                <li key={index}>
                  <a
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-2"
                  >
                    <FileOutlined />
                    {file.split("/").pop()}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>
    </div>
  );
};

export default ViewSnaggingAndTimeSchedule;
