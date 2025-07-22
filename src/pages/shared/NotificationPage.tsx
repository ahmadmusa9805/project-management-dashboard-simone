// NotificationModal.tsx
import React from 'react';
import { Modal } from 'antd';
import { IoNotificationsOutline } from 'react-icons/io5';

interface NotificationItem {
  _id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  isDeleted: boolean;
  __v: number;
}

export interface NotificationModalProps {
  open: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
}

const NotificationModal: React.FC<NotificationModalProps> = ({ open, onClose, notifications }) => {
  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-lg font-semibold">
          <IoNotificationsOutline size={20} /> Notification
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={450}
    >
      <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3">
        {notifications.map((item) => (
          <div
            key={item._id}
            className="bg-gray-100 p-3 rounded hover:bg-gray-200 transition-all duration-200"
          >
            <div className="text-sm font-medium text-gray-800">
              {item.message}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(item.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}{' '}
              {new Date(item.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default NotificationModal;
