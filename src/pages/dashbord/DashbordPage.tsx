import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import DashboardSummaryCards from './UserCard';
import EarningsChart from './EarningsChart';



const clientData = [
  { month: 'Jan', thisYear: 5000, lastYear: 4000 },
  { month: 'Feb', thisYear: 6000, lastYear: 4500 },
  { month: 'Mar', thisYear: 5500, lastYear: 4200 },
  { month: 'Apr', thisYear: 7000, lastYear: 5000 },
  { month: 'May', thisYear: 8000, lastYear: 6200 },
  { month: 'Jun', thisYear: 9000, lastYear: 7000 },
  { month: 'Jul', thisYear: 9500, lastYear: 7200 },
  { month: 'Aug', thisYear: 9700, lastYear: 7400 },
  { month: 'Sep', thisYear: 10000, lastYear: 8000 },
  { month: 'Oct', thisYear: 8700, lastYear: 7600 },
  { month: 'Nov', thisYear: 9200, lastYear: 7800 },
  { month: 'Dec', thisYear: 9400, lastYear: 8100 },
];

// const earningsData = [
//   { month: 'May', earning: 3000 },
//   { month: 'June', earning: 3500 },
//   { month: 'July', earning: 4000 },
//   { month: 'Aug', earning: 2800 },
//   { month: 'Sep', earning: 3200 },
//   { month: 'Oct', earning: 3760 },
// ];

const DashboardAnalytics: React.FC = () => {
  return (
    <div className="p-6 space-y-10">
      {/* Users Section */}
      <DashboardSummaryCards />

      {/* Clients Chart Section */}
      <div className="bg-white rounded shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-medium">Clients</h3>
            <p className="text-sm text-gray-500">Last 12 months report</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#0d542b] rounded" />
              <span className="text-sm text-gray-700">This year</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-400 rounded" />
              <span className="text-sm text-gray-700">Last year</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={clientData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="thisYear" stroke="#001D01" strokeWidth={2} />
            <Line type="monotone" dataKey="lastYear" stroke="#969C9D" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Earnings Section */}
     <EarningsChart></EarningsChart> 
    </div>
  );
};

export default DashboardAnalytics;
