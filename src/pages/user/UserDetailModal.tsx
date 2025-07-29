import { Modal } from 'antd';
import React from 'react';
import { Download, ArrowLeft } from 'lucide-react';

interface UserData {
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: string;
  region?: string;
  postCode?: string;
  estimateNumber?: string;
  projectType?: string;
  password?: string;
  role?: 'super-admin'|'prime-admin' | 'basic-admin' | 'client';
}

interface UserDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  userData: UserData;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ visible, onClose, userData }) => {
  const renderDetailRow = (label: string, value?: string) => (
    <div className="w-full inline-flex justify-start items-center gap-3">
      <div className="flex-1 text-sm text-gray-700 font-normal">{label}</div>
      <div className="text-sm text-gray-800 font-medium">{value || 'N/A'}</div>
    </div>
  );

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
    >
      <div className="w-full h-full p-4 bg-white rounded flex flex-col gap-4">
        {/* Profile Header */}
        <div className="inline-flex items-center gap-2">
          <img
            src={userData.avatar || 'https://placehold.co/40x40'}
            alt="avatar"
            className="w-10 h-10 rounded-full bg-gray-300"
          />
          <div className="flex flex-col">
            <div className="text-base font-medium text-[#000E0F]">{userData.name}</div>
            <div className="text-xs font-medium text-[#2B3738] tracking-wide">{userData.email}</div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="flex flex-col gap-2">
          <div className="text-base font-medium text-[#000E0F]">Personal details</div>
          <div className="flex flex-col gap-2">
            {renderDetailRow('Contact number', userData.phone)}
            {renderDetailRow('Address', userData.address)}
            {renderDetailRow('Region', userData.region)}
            {renderDetailRow('Post code', userData.postCode)}
          </div>
        </div>

        {/* Account Details - Only for client users */}
        {userData.role === 'client' && (
          <>
            <div className="w-full h-px bg-[#E6E7E7]" />

            <div className="flex flex-col gap-2">
              <div className="text-base font-medium text-[#000E0F]">Account details</div>
              <div className="flex flex-col gap-2">
                {renderDetailRow('Estimate number', userData.estimateNumber)}
                {renderDetailRow('Project type', userData.projectType)}
              </div>
            </div>
          </>
        )}

        <div className="w-full h-px bg-[#E6E7E7]" />

        {/* Footer Buttons */}
        <div className="w-full flex gap-3 ">
          <button
            onClick={onClose}
            className="h-12 px-6 bg-[rgba(23,43,77,0.06)] rounded flex items-center justify-center gap-1 text-[#001D01] text-base font-medium"
          >
            <ArrowLeft size={18} /> Go back
          </button>

          <button
            className="h-12 px-6 bg-[#0d542b] rounded flex items-center justify-center  gap-2  text-base font-medium flex-1"
          >
            <span className='text-white h-12 px-6 bg-[#0d542b] rounded flex items-center justify-center  gap-2  text-base font-medium flex-1'>
              Download PDF <Download size={16} />
            </span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailsModal;
