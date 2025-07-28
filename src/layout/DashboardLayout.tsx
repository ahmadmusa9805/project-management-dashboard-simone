import React, { useState } from "react";
import "./dashboard.css";
import type { MenuProps } from "antd";
import { Breadcrumb, Button, Layout, Menu, Modal } from "antd";
import {
  useLocation,
  useNavigate,
  useParams,
  Outlet,
  Link,
} from "react-router-dom";
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
import UserProfileEdit from "../pages/user/UserProfileEdit";

const { Content, Footer, Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];
type Role = "super-admin" | "prime-admin" | "basic-admin" | "client";

const DashboardLayout: React.FC = () => {
  // We'll use a ref to store the previous page URL
  const [collapsed, setCollapsed] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notifications, setNotifications] = useState(notificationData);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
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

  // On avatar click, open modal
  const handleAvatarClick = () => {
    setIsProfileModalOpen(true);
  };

  const handleProfileModalClose = () => {
    setIsProfileModalOpen(false);
  };
  const redirectPath = userRole === "super-admin" ? "/dashboard" : "/projects";
  return (
    <>
      <div className="bg-white h-20 w-full fixed top-0 left-0 z-50 shadow-sm flex items-center justify-between px-6 ">
        <Link to={redirectPath} className="block">
          <div className="flex items-center justify-center m-8 cursor-pointer">
            <img src={logo} alt="Logo" className="w-10 h-10 mr-2" />
            <span className="text-3xl text-[#0d542b] font-bold leading-none">MVV Portal</span>
          </div>
        </Link>

        <div className="flex items-center justify-between mt-2 ">
          <div className="relative">
            <Button
            className="text-[#0d542b]"
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
                <span className="absolute top-0 left-6 bg-[#DA453F]  text-xs px-1 text-white border rounded-full">
                  {unreadCount}
                </span>
              )}
            </Button>
          </div>

          <div
            className="flex items-center gap-2 mr-8 ml-4 cursor-pointer text-[#0d542b]"
            onClick={handleAvatarClick}
          >
            {userInfo?.profileImg ? (
              <img
                src={userInfo.profileImg}
                className="w-8 h-8 object-cover rounded-full"
                alt="profile"
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

      <Modal
        title="Edit Profile"
        visible={isProfileModalOpen}
        onCancel={handleProfileModalClose}
        footer={null} // you can add footer buttons inside UserProfileEdit if needed
        width={900}
      >
        <UserProfileEdit />
      </Modal>

      <Layout style={{ minHeight: "100vh", paddingTop: 64 }}>
        <Sider
          width={300}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
         style={{ background: "#ffffff", position: "relative" }} 
        >
          <div className="custom-sidebar-menu-wrapper">
  <Menu
            selectedKeys={[location.pathname]}
            defaultSelectedKeys={[path]}
            onClick={({ key }) => navigate(key)}
            mode="inline"
            items={mainItems}
            className="custom-sidebar-menu"
          />
          </div>
        

          {/* Add this inline style block inside your component (just after return) */}
        </Sider>

        <Layout>
          <Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }} />
            <div className="bg-bg-white!">
              <Outlet />
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            themvv.co.uk ©{new Date().getFullYear()} Created by Ant UED
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
