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
import { useGetMeUserQuery} from "../Redux/features/users/usersApi";
import { USER_ROLE } from "../types/userAllTypes/user";

const { Content, Footer, Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];
type Role = "superAdmin" | "primeAdmin" | "basicAdmin" | "client";

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
  const validRoles = [USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin,USER_ROLE.client];
  // const { data: allProfileInfo } = useGetUserByIdQuery(String(user?.id), {
  //   skip: !user?.id,
  // });
  // const profileInfo = allProfileInfo?.data;
  // console.log(profileInfo);
  if (!userRole || !validRoles.includes(userRole)) {
    return null; // Don't render hooks or layout before navigating
  }

  const isInProjectDetail =
    location.pathname.startsWith("/projects/") && !!projectId;

  let mainItems: MenuItem[] = [];

  if (isInProjectDetail && projectId) {
    mainItems = getProjectMenuItems(projectId, userRole);
  } else {
    mainItems = getSidebarMenuItems(userRole);
  }
  const { data: userInfo, isLoading: userLoading } = useGetMeUserQuery();
 

  if (userLoading || !userInfo) return <div>Loading user info...</div>;

  // On avatar click, open modal
  const handleAvatarClick = () => {
    setIsProfileModalOpen(true);
  };

  const handleProfileModalClose = () => {
    setIsProfileModalOpen(false);
  };



  const redirectPath = userRole === USER_ROLE.superAdmin ? "/dashboard" : "/projects";
  return (
    <>
      <div className="bg-white h-20 w-full fixed top-0 left-0 z-50 shadow-sm flex items-center justify-between px-6 ">
        <Link to={redirectPath} className="block">
          <div className="flex items-center justify-center m-8 cursor-pointer">
            <img src={logo} alt="Logo" className="w-10 h-10 mr-2" />
            <span className="text-3xl text-[#0d542b] font-bold leading-none">
              MVV Portal
            </span>
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
    <div className="w-8 h-8 flex items-center justify-center border rounded-full">
      <FaRegUser />
    </div>
  )}

  <span className="font-medium">{userInfo?.name}</span>
</div>

        </div>
      </div>

      <Modal
  title="Edit Profile"
  visible={isProfileModalOpen}
  onCancel={handleProfileModalClose}
  footer={null}
  width={900}
>
  <UserProfileEdit user={userInfo} />
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
              selectedKeys={[location.pathname + location.search]}
              defaultSelectedKeys={[path + location.search]}
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
