import React from "react";

interface CustomPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex justify-evenly items-center  pb-10 mt-20">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={`px-4 py-2 rounded border ${
          page <= 1
            ? "text-[#001D01] border-[#001D01]"
            : "text-[#001D01] border-[#001D01] hover:bg-[#e6f4ea]"
        }`}
      >
        Previous
      </button>

      <div className="text-gray-700">
        Page {page} of {totalPages}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className={`px-4 py-2 rounded border ${
          page >= totalPages
            ? "text-[#001D01] border-[#001D01]"
            : "text-[#001D01] border-[#001D01] hover:bg-[#e6f4ea]"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default CustomPagination;
