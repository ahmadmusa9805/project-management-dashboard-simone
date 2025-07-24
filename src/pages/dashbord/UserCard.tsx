import React from 'react';


interface CardProps {
  title: string;
  value: string;
  percentage?: string;
  trend?: 'up' | 'down';
}

const StatCard: React.FC<CardProps> = ({ title, value, percentage, trend }) => {
  const isUp = trend === 'up';
  const isDown = trend === 'down';

  return (
    <div className="flex-1 bg-white border border-[#E6E7E7] rounded-sm px-6 pt-5 pb-2 overflow-hidden flex flex-col justify-start items-start">
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
          {percentage && (
            <div className={`flex items-center gap-1 ${isUp ? 'text-[#457205]' : 'text-[#D21F18]'}`}>
              <div className="relative w-6 h-6">
                <div
                  className={`absolute w-6 h-[14px] top-[5px] left-0 ${isUp ? 'bg-[#658A30]' : 'bg-[#DA453F]'}`}
                />
                <div
                  className={`absolute w-2 h-2 left-4 ${isUp ? 'top-[5px]' : 'top-[11px]'} ${isUp ? 'bg-[#658A30]' : 'bg-[#DA453F]'}`}
                />
              </div>
              <span className="text-sm font-medium leading-[16.24px]">{percentage}</span>
            </div>
          )}
        </div>

        <div className="w-full py-2.5 flex justify-center items-center gap-2.5" />
      </div>
    </div>
  );
};

const DashboardSummaryCards = () => {
  return (
    <div className="w-full flex gap-6">
      <StatCard title="Total earning" value="$54,973" percentage="+17%" trend="up" />
      <StatCard title="Total projects" value="174" percentage="+17%" trend="up" />
      <StatCard title="Completed projects" value="23" percentage="-2%" trend="down" />
      <StatCard title="Users" value="54,973" />
    </div>
  );
};

export default DashboardSummaryCards;
