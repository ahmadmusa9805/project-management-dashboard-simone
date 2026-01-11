import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Spin } from "antd";
import { useGetAnalyticsProfitByPeriodQuery } from "../../Redux/features/analytics/analyticsApi";

// Define chart data types
interface ChartDataPoint {
  period: string;
  "3 Months"?: number;
  "6 Months"?: number;
  "12 Months": number;
}

const EarningsChart: React.FC = () => {
  // Fetch data for different periods
  const { data: threeMonthData, isLoading: loading3M } =
    useGetAnalyticsProfitByPeriodQuery(3);
  const { data: sixMonthData, isLoading: loading6M } =
    useGetAnalyticsProfitByPeriodQuery(6);
  const { data: yearData, isLoading: loading12M } =
    useGetAnalyticsProfitByPeriodQuery(12);

  // Format data for chart
  const chartData = React.useMemo<ChartDataPoint[]>(() => {
    if (!threeMonthData?.data || !sixMonthData?.data || !yearData?.data) {
      return [];
    }

    const threeMonthValue = Math.abs(
      parseFloat(threeMonthData.data.totalProfit)
    );
    const sixMonthValue = Math.abs(parseFloat(sixMonthData.data.totalProfit));
    const yearValue = Math.abs(parseFloat(yearData.data.totalProfit));

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

    return months.map((month, index) => {
      const monthNumber = index + 1;
      return {
        period: month,
        "3 Months":
          monthNumber <= 3 ? (threeMonthValue / 3) * monthNumber : undefined,
        "6 Months":
          monthNumber <= 6 ? (sixMonthValue / 6) * monthNumber : undefined,
        "12 Months": (yearValue / 12) * monthNumber,
      };
    });
  }, [threeMonthData, sixMonthData, yearData]);

  // Calculate total earnings
  const totalEarnings = React.useMemo(() => {
    if (!yearData?.data?.totalProfit) return 0;
    return Math.abs(parseFloat(yearData.data.totalProfit));
  }, [yearData]);

  if (loading3M || loading6M || loading12M) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bg-[#f1f1f1] rounded shadow p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-700">
          Earnings Comparison (3M vs 6M vs 12M)
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-600">3 Month Earnings</p>
          <h4 className="text-xl font-bold text-gray-900">
            {`£ ${parseFloat(threeMonthData?.data?.totalProfit || "0")}`}
          </h4>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-600">6 Month Earnings</p>
          <h4 className="text-xl font-bold text-gray-900">
            {`£ ${parseFloat(sixMonthData?.data?.totalProfit || "0")}`}
          </h4>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-600">12 Month Earnings</p>
          <h4 className="text-xl font-bold text-gray-900">
            {`£ ${parseFloat(totalEarnings.toLocaleString() || "0")}`}
          </h4>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" padding={{ left: 30, right: 30 }} />
          <YAxis
            domain={[0, "auto"]}
            tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
          />
          <Tooltip
            formatter={(val: number) => [`£${val.toLocaleString()}`, ""]}
            labelFormatter={(label) => `Period: ${label}`}
          />
          <Legend />

          <Line
            type="monotone"
            dataKey="12 Months"
            stroke="#8884d8"
            strokeWidth={2}
            name="12 Months"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="6 Months"
            stroke="#82ca9d"
            strokeWidth={2}
            name="6 Months"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="3 Months"
            stroke="#ffc658"
            strokeWidth={2}
            name="3 Months"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningsChart;
