/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useGetProjectsWithstatusQuery } from "../../Redux/features/projects/projectsApi";
import { useGetAllUsersQuery } from "../../Redux/features/users/usersApi";
import { Spin } from "antd";

interface CardProps {
  title: string;
  value: string;
}

const StatCard: React.FC<CardProps> = ({ title, value }) => {
  return (
    <div className="flex-1 bg-[#f1f1f1] border border-[#E6E7E7] rounded-sm px-6 pt-5 pb-2 overflow-hidden flex flex-col justify-start items-start">
      <div className="w-full flex flex-col items-start">
        <div className="h-8 flex items-center">
          <p className="text-[#2B3738] text-sm font-normal leading-[16.24px]">
            {title}
          </p>
        </div>

        <div className="w-full flex justify-between items-end">
          <p className="text-[34px] font-medium leading-[39.78px] text-[#000E0F]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

const DashboardSummaryCards = () => {
  const { data: projects = [], isLoading } = useGetProjectsWithstatusQuery(
    {},
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );
  const { data: users = [], isLoading: isLoadingUsers } = useGetAllUsersQuery(
    {
      status: undefined,
    },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  if (isLoading || isLoadingUsers)
    return (
      <div className="flex justify-center items-center h-40">
        <Spin size="large"></Spin>
      </div>
    );

  const completedProjects = Array.isArray(projects)
    ? projects.filter((p: any) => p.status === "completed")
    : [];

  const usersList =
    users &&
    typeof users === "object" &&
    "data" in users &&
    Array.isArray((users as any).data)
      ? (users as any).data
      : [];

  // ✅ Direct totals (no lastMonth needed)
  const totalProjects = projects.length;
  const completed = completedProjects.length;
  const totalEarnings = completedProjects.reduce(
    (sum: number, p: any) => sum + (p.value || 0),
    0
  );
  const totalUsers = usersList.length;

  return (
    <div className="w-full flex gap-6 my-5">
      <StatCard
        title="Total earning"
        value={`$${totalEarnings.toLocaleString()}`}
      />
      <StatCard title="Total projects" value={totalProjects.toString()} />
      <StatCard title="Completed projects" value={completed.toString()} />
      <StatCard title="Users" value={totalUsers.toString()} />
    </div>
  );
};

export default DashboardSummaryCards;
