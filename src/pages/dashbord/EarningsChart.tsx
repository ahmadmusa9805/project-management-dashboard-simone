import React, { useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from 'recharts/types/state/store';

import { fetchProjects, selectProject } from '../../Redux/features/projects/dashbordSlice';
import { dummyEarnings } from '../../data/mockEarningsData';
import type { RootState } from '../../Redux/app/store';

const EarningsChart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, selectedProject } = useSelector((state: RootState) => state.earnings);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(selectProject(event.target.value));
  };

  // 🧠 Combine total earnings from all projects by month
  const chartData = useMemo(() => {
    const months = dummyEarnings[Object.keys(dummyEarnings)[0]].map((d) => d.month);

    return months.map((month, index) => {
      let total = 0;
      let selected = 0;

      for (const projectId in dummyEarnings) {
        const earningEntry = dummyEarnings[projectId][index];
        total += earningEntry?.earning || 0;

        if (projectId === selectedProject) {
          selected = earningEntry?.earning || 0;
        }
      }

      return {
        month,
        totalEarning: total,
        selectedEarning: selectedProject ? selected : null,
      };
    });
  }, [selectedProject]);

  const totalEarnings = chartData.reduce((acc, curr) => acc + (curr.selectedEarning || 0), 0);

  return (
    <div className="bg-white rounded shadow p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-700">Earnings Comparison (Last 6 Months)</h3>
        <div className="flex items-center gap-2 border border-gray-400 px-4 py-2 rounded">
          <select
            onChange={handleChange}
            value={selectedProject}
            className="outline-none bg-transparent text-gray-800 font-medium"
          >
            {projects.map((proj: any) => (
              <option key={proj.id} value={proj.id}>{proj.name}</option>
            ))}
          </select>
          <div className="w-3 h-2 bg-gray-800" />
        </div>
      </div>

      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        ${totalEarnings.toLocaleString()}
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[0, 10000]} tickFormatter={(val) => `$${val / 1000}k`} />
          <Tooltip formatter={(val: number) => `$${val}`} />

          {/* Total Line (All projects) */}
          <Line type="monotone" dataKey="totalEarning" stroke="#8884d8" strokeWidth={2} name="All Projects" />

          {/* Selected Project Line */}
          {selectedProject && (
            <Line
              type="monotone"
              dataKey="selectedEarning"
              stroke="#82ca9d"
              strokeWidth={2}
              name="Selected Project"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningsChart;
