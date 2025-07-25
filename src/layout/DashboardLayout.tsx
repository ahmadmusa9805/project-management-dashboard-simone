import React, { useState } from "react";

import type { MenuProps } from "antd";
import { Breadcrumb, Button, Layout, Menu } from "antd";
import { useLocation, useNavigate, useParams, Outlet } from "react-router-dom";
import logo from "../assets/green-logo.png";
import { FaRegUser } from "react-icons/fa6";
import { IoNotificationsOutline } from "react-icons/io5";
import { notificationData } from "../data/notification";
import NotificationModal from "../pages/shared/NotificationPage";
import { useSelector } from "react-redux";
import type { RootState } from "../Redux/app/store";

import {
  getProjectMenuItems,
  getSidebarMenuItems,
} from "../utils/sidebarItems";

const { Content, Footer, Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];
type Role = "super-admin" | "prime-admin" | "basic-admin" | "client";

const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notifications, setNotifications] = useState(notificationData);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();
  const user = useSelector((state: RootState) => state.auth.user);

  const path = location.pathname;
  const userRole = user?.role;
  const validRoles = ["super-admin", "prime-admin", "basic-admin", "client"];

  if (!userRole || !validRoles.includes(userRole)) {
    return null; // Don't render hooks or layout before navigating
  }

  const isInProjectDetail =
    location.pathname.startsWith("/projects/") && !!projectId;

  let mainItems: MenuItem[] = [];

  if (isInProjectDetail && projectId) {
    mainItems = getProjectMenuItems(projectId, userRole as Role);
  } else {
    mainItems = getSidebarMenuItems(userRole as Role);
  }
  const rawUser = localStorage.getItem("user");
  const userInfo = rawUser ? JSON.parse(rawUser) : {};

  return (
    <>
      <div className="bg-white h-16 w-full fixed top-0 left-0 z-50 shadow-sm flex items-center justify-between px-6 ">
        <div className="flex items-center justify-between m-8">
          <img src={logo} alt="Logo" className={`w-8 h-4 mx-auto my-6 `} />
          <p className="text-lg font-bold m-4">MVV Portal</p>
        </div>
        <div className="flex items-center justify-between mt-2 ">
          <div className="relative">
            <Button
              type="text"
              onClick={() => {
                setIsNotificationModalOpen(true);
                setNotifications((prev) =>
                  prev.map((n) => ({ ...n, isRead: true }))
                );
              }}
            >
              <IoNotificationsOutline size={22} />
              {unreadCount > 0 && (
                <span className="absolute top-0 left-6 bg-[#031F04] text-xs px-1 text-white border rounded-full">
                  {unreadCount}
                </span>
              )}
            </Button>
          </div>
          <div
            className="flex items-center gap-2 mr-8 ml-4 cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            {userInfo?.profileImg ? (
              <img
                src={userInfo.profileImg}
                className="w-8 h-8 object-cover rounded-full"
              />
            ) : (
              <div className="border rounded-full p-2">
                <FaRegUser />
              </div>
            )}
            <h3 className="text-gray-500 font-semibold">
              {userInfo?.name?.firstName} {userInfo?.name?.lastName}
            </h3>
          </div>
        </div>
      </div>

      <Layout style={{ minHeight: "100vh", paddingTop: 64 }}>
        <Sider
          width={250}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          style={{ background: "#ffffff" }}
        >
          <Menu
            selectedKeys={[location.pathname]}
            defaultSelectedKeys={[path]}
            onClick={({ key }) => navigate(key)}
            mode="inline"
            items={mainItems}
          />
        </Sider>

        <Layout>
          <Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }} />
            <div>
              <Outlet />
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
          </Footer>
        </Layout>
      </Layout>

      <NotificationModal
        open={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notifications={notifications}
      />
    </>
  );
};

export default DashboardLayout;
