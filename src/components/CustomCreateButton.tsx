import React from "react";

interface CustomCreateButtonProps {
  onClick?: () => void;
  title?: string;
}

const CustomCreateButton: React.FC<CustomCreateButtonProps> = ({
  onClick,
  title,
}) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-6 py-2 bg-[#001D01] text-white text-sm font-medium rounded"
    >
      {/* Plus Icon */}
      <div className="relative w-4 h-4">
        <span className="absolute left-1/2 top-1/4 w-[1.33px] h-2.5 bg-white transform -translate-x-1/2"></span>
        <span className="absolute left-1/4 top-1/2 h-[1.33px] w-2.5 bg-white transform -translate-y-1/2"></span>
      </div>

      {/* Button Text */}
      <span className="tracking-wide">{title}</span>
    </button>
  );
};

export default CustomCreateButton;
