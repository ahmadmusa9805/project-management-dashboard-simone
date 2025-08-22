import React from "react";

interface CertificateCardProps {
  title: string;
  size: string;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ title, size }) => {
  // Define dropdown actions

  return (
    <div className="p-4 bg-[#F1F1F1] rounded border border-[#E6E7E7] flex flex-col items-start gap-4">
      {/* Top Row */}
      <div className="w-[151px] flex justify-between items-start">
        {/* Icon (mock) */}
        <div className="w-10 h-10 relative overflow-hidden">
          <div className="absolute left-[4.25px] top-[1.17px] w-[31.5px] h-[37.65px] bg-white" />
          <div className="absolute left-[4.25px] top-[1.17px] w-[7.09px] h-[7.08px] bg-[#D2DBEA]" />
          <div className="absolute left-[2.35px] top-[21.29px] w-[35.29px] h-[11.72px] bg-[#F14F4A]" />
          <div className="absolute left-[9.1px] top-[12.47px] w-[21.8px] h-[5.41px] bg-[#D2DBEA]" />
          <div className="absolute left-[12.41px] top-[24.24px] w-[4.46px] h-[5.81px] bg-white" />
          <div className="absolute left-[12.26px] top-[24.09px] w-[10.65px] h-[6.1px] bg-white" />
          <div className="absolute left-[17.82px] top-[24.09px] w-[10.3px] h-[6.06px] bg-white" />
          <div className="absolute left-[24.02px] top-[24.09px] w-[4.24px] h-[6.1px] bg-white" />
        </div>

        {/* Dropdown Actions */}
      </div>

      {/* Title and Size */}
      <div className="flex flex-col items-start gap-2 w-full">
        <div className="text-[#2B3738] text-[18px] font-medium">{title}</div>
        <div className="text-[#6B7374] text-sm font-normal">{size}</div>
      </div>
    </div>
  );
};

export default CertificateCard;
