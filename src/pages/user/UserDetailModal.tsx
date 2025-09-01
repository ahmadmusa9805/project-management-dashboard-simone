import { Modal, Spin } from "antd";
import React from "react";
import { ArrowLeft } from "lucide-react";
import { useGetUserByIdQuery } from "../../Redux/features/users/usersApi";

interface UserDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  visible,
  onClose,
  userId,
}) => {
  const { data, isLoading, error } = useGetUserByIdQuery(userId);

  console.log("Modal userId:", userId);
  console.log("Fetched user data:", data);

  if (isLoading) return <Spin />;
  if (error || !data) return <div>Failed to load user details.</div>;

  const renderDetailRow = (label: string, value?: string) => (
    <div className="w-full inline-flex justify-start items-center gap-3">
      <div className="flex-1 text-sm text-gray-700 font-normal">{label}</div>
      <div className="text-sm text-gray-800 font-medium">{value || "N/A"}</div>
    </div>
  );

  return (
    <Modal open={visible} onCancel={onClose} footer={null} width={900} centered>
      <div className="w-full h-full p-20 bg-white rounded flex flex-col gap-10">
        {/* Profile Header */}
        <div className="inline-flex items-center gap-5">
          <img
            src={data.profileImg || "https://placehold.co/40x40"}
            alt="avatar"
            className="w-10 h-10 rounded-full bg-gray-300"
          />
          <div className="flex flex-col">
            <div className="text-base font-medium text-[#000E0F]">
              {data.name}
            </div>
            <div className="text-xs font-medium text-[#2B3738] tracking-wide">
              {data.email}
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="flex flex-col gap-5">
          <div className="text-base font-medium text-[#000E0F]">
            Personal details
          </div>
          <div className="flex flex-col gap-2">
            {renderDetailRow("Contact number", data.contactNo)}
            {renderDetailRow("Address", data.address)}
            {renderDetailRow("Post code", data.postCode)}
          </div>
        </div>

        {/* Account Details - Only for client users */}
        {data.role === "client" && (
          <>
            <div className="w-full h-px bg-[#E6E7E7]" />
            <div className="flex flex-col gap-2">
              <div className="text-base font-medium text-[#000E0F]">
                Account details
              </div>
              <div className="flex flex-col gap-2">
                {renderDetailRow("Estimate number", data.estimateNumber)}
                {renderDetailRow("Project type", data.projectType)}
              </div>
            </div>
          </>
        )}

        <div className="w-full h-px bg-[#E6E7E7]" />

        {/* Footer Buttons */}
        <div className="w-full flex gap-3">
          <button
            onClick={onClose}
            className="h-12 px-6 bg-[rgba(23,43,77,0.06)] rounded flex items-center justify-center gap-1 text-[#001D01] text-base font-medium"
          >
            <ArrowLeft size={18} /> Go back
          </button>

          {/* <button className="h-12 px-6 bg-[#0d542b] rounded flex items-center justify-center gap-2 text-white text-base font-medium flex-1">
            Download PDF <Download size={16} />
          </button> */}
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailsModal;
