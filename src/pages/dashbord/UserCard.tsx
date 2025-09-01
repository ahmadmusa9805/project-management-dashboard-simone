/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useGetProjectsWithstatusQuery } from "../../Redux/features/projects/projectsApi";
import { useGetAllUsersQuery } from "../../Redux/features/users/usersApi";
import dayjs from "dayjs";
import { TrendingUp, TrendingDown } from "lucide-react"; // ✅ import icons

interface CardProps {
  title: string;
  value: string;
  percentage?: string;
  trend?: "up" | "down";
  tooltipText?: string;
}

const StatCard: React.FC<CardProps> = ({
  title,
  value,
  percentage,
  trend,
  tooltipText,
}) => {
  const isUp = trend === "up";

  return (
    <div className="flex-1 bg-white border border-[#E6E7E7] rounded-sm px-6 pt-5 pb-2 overflow-hidden flex flex-col justify-start items-start">
      <div className="w-full flex flex-col items-start">
        <div className="h-8 flex items-center">
          <p className="text-[#2B3738] text-sm font-normal leading-[16.24px]">
            {title}
          </p>
        </div>

        <div className="w-full flex justify-between items-end">
          <p className="text-[34px] font-medium leading-[39.78px] text-[#000E0F] flex items-center gap-1">
            {value}
            {trend && value !== "0" && (
              <>
                {isUp ? (
                  <TrendingUp className="text-[#457205]" />
                ) : (
                  <TrendingDown className="text-[#D21F18]" />
                )}
              </>
            )}
          </p>

          {percentage && (
            <div
              className={`flex items-center gap-1 ${
                isUp ? "text-[#457205]" : "text-[#D21F18]"
              }`}
              title={tooltipText}
            >
              <span className="text-sm font-medium leading-[16.24px]">
                {percentage}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ✅ Utility: calculate percentage change
const calculateChange = (
  current: number,
  previous: number
): { percentage: string; trend: "up" | "down" } => {
  if (!previous || previous === 0) return { percentage: "0%", trend: "up" };
  const change = ((current - previous) / previous) * 100;
  return {
    percentage: `${change.toFixed(1)}%`,
    trend: change >= 0 ? "up" : "down",
  };
};

// ✅ Utility: group data by month
const groupByMonth = (items: any[], field: string) => {
  const grouped: Record<string, number> = {};
  items.forEach((item) => {
    const month = dayjs(item.createdAt).format("YYYY-MM");
    grouped[month] =
      (grouped[month] || 0) + (field === "count" ? 1 : item.value || 0);
  });
  return grouped;
};

const DashboardSummaryCards = () => {
  const { data: projects = [], isLoading } = useGetProjectsWithstatusQuery();
  const { data: users = [], isLoading: isLoadingUsers } = useGetAllUsersQuery({
    status: undefined,
  });

  if (isLoading || isLoadingUsers) return <div>Loading...</div>;

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

  const projectCountsByMonth = groupByMonth(projects, "count");
  const completedByMonth = groupByMonth(completedProjects, "count");
  const earningsByMonth = groupByMonth(completedProjects, "value");
  const usersByMonth = groupByMonth(usersList, "count");

  const months = Object.keys({
    ...projectCountsByMonth,
    ...completedByMonth,
    ...earningsByMonth,
    ...usersByMonth,
  }).sort();

  const lastMonth = months[months.length - 1];
  const prevMonth = months[months.length - 2];

  const totalProjects = projectCountsByMonth[lastMonth] || 0;
  const prevProjects = projectCountsByMonth[prevMonth] || 0;

  const completed = completedByMonth[lastMonth] || 0;
  const prevCompleted = completedByMonth[prevMonth] || 0;

  const totalEarnings = earningsByMonth[lastMonth] || 0;
  const prevEarnings = earningsByMonth[prevMonth] || 0;

  const totalUsers = usersByMonth[lastMonth] || 0;
  const prevUsers = usersByMonth[prevMonth] || 0;

  const projectsChange = calculateChange(totalProjects, prevProjects);
  const completedChange = calculateChange(completed, prevCompleted);
  const earningsChange = calculateChange(totalEarnings, prevEarnings);
  const usersChange = calculateChange(totalUsers, prevUsers);

  return (
    <div className="w-full flex gap-6">
      <StatCard
        title="Total earning"
        value={`$${totalEarnings.toLocaleString()}`}
        percentage={earningsChange.percentage}
        trend={earningsChange.trend}
        tooltipText="Compared to previous month earnings"
      />
      <StatCard
        title="Total projects"
        value={totalProjects.toString()}
        percentage={projectsChange.percentage}
        trend={projectsChange.trend}
        tooltipText="Compared to previous month total projects"
      />
      <StatCard
        title="Completed projects"
        value={completed.toString()}
        percentage={completedChange.percentage}
        trend={completedChange.trend}
        tooltipText="Compared to previous month completed projects"
      />
      <StatCard
        title="Users"
        value={totalUsers.toString()}
        percentage={usersChange.percentage}
        trend={usersChange.trend}
        tooltipText="Compared to previous month users"
      />
    </div>
  );
};

export default DashboardSummaryCards;
