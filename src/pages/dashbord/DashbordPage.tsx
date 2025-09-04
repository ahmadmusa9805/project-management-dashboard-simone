/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Spin } from "antd";
import DashboardSummaryCards from "./UserCard";
import EarningsChart from "./EarningsChart";
import { useGetProjectsWithstatusQuery } from "../../Redux/features/projects/projectsApi";

// Helper: Group projects by month
const groupByMonth = (projects: any[]) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const result: { month: string; count: number }[] = months.map((m) => ({
    month: m,
    count: 0,
  }));

  projects.forEach((project) => {
    if (project.createdAt) {
      const date = new Date(project.createdAt);
      const monthIndex = date.getMonth();
      result[monthIndex].count += 1;
    }
  });

  return result;
};

const DashboardAnalytics: React.FC = () => {
  const { data: ongoingProjects = [], isLoading } =
    useGetProjectsWithstatusQuery(
      { status: "ongoing" },
      {
        refetchOnFocus: true,
        refetchOnReconnect: true,
      }
    );

  // Format ongoing projects by month
  const ongoingData = groupByMonth(ongoingProjects);

  return (
    <div className="w-full  gap-4 bg-white min-h-screen p-6">
      {/* Users Section */}
      <DashboardSummaryCards />

      {/* Ongoing Projects Chart Section */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : (
        <div className="bg-[#f1f1f1] rounded shadow p-6 mb-5">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-medium ">Ongoing Projects</h3>
            <p className="text-xl font-medium text-gray-600">
              Total: {ongoingProjects.length}
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={ongoingData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name="Projects"
                stroke="#0d542b"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Earnings Section */}
      <EarningsChart />
    </div>
  );
};

export default DashboardAnalytics;
