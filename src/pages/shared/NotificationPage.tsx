import React, { useState } from "react";
import { Modal, Button } from "antd";
import { IoNotificationsOutline } from "react-icons/io5";
import {
  useGetUnreadNotificationsQuery,
  useMarkAllAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "../../Redux/features/notificationApi";

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  isDeleted: boolean;
  __v: number;
}

export interface NotificationModalProps {
  open: boolean;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  open,
  onClose,
}) => {
  const { data, isLoading } = useGetUnreadNotificationsQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [markAllAsRead, { isLoading: isMarkingAllAsRead }] =
    useMarkAllAsReadMutation();
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();

  // ✅ Track single notification loading
  const [loadingNotificationId, setLoadingNotificationId] =
    useState<string>("");

  const notifications: NotificationItem[] = data?.data || [];

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead({}).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkSingleAsRead = async (id: string) => {
    try {
      setLoadingNotificationId(id); // Start loading for this notification
      await markNotificationAsRead(id).unwrap();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingNotificationId(""); // Stop loading
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <IoNotificationsOutline size={30} /> Notifications
          </div>
          {notifications.length > 0 && (
            <Button
              type="link"
              loading={isMarkingAllAsRead}
              onClick={handleMarkAllAsRead}
            >
              Mark All as Read
            </Button>
          )}
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
    >
      <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3">
        {isLoading ? (
          <p>Loading...</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-500">No unread notifications 🎉</p>
        ) : (
          notifications.map((item) => (
            <div
              key={item._id}
              className="bg-gray-100 p-3 rounded hover:bg-[#e6f4ea] transition-all duration-200 flex justify-between items-center"
            >
              <div>
                <div className="text-sm gap-3 flex font-medium text-gray-800">
                  <IoNotificationsOutline size={20} /> {item.message}
                </div>
                <div className="ml-8 text-xs text-gray-500 mt-1">
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  {new Date(item.createdAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              {!item.isRead && (
                <Button
                  type="link"
                  size="small"
                  loading={loadingNotificationId === item._id} // ✅ Only show loading for this notification
                  onClick={() => handleMarkSingleAsRead(item._id)}
                >
                  Mark as Read
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};

export default NotificationModal;
