import React, {  useEffect, useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Button, Layout, Menu, theme } from 'antd';
import {  useLocation, matchPath,  Link, useNavigate } from 'react-router-dom';
import logo from '../assets/green-logo.png';
import { FaRegUser } from "react-icons/fa6";
import { IoNotificationsOutline } from 'react-icons/io5';
import { notificationData } from '../data/notification';
import NotificationModal from '../pages/shared/NotificationPage';

const {  Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];
interface UserInfo {
  profileImg?: string;
  name?: {
    firstName?: string;
    lastName?: string;
  };
}




function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

// Submenu for Super / Prime Admin
const projectSubMenuSuperPrime: MenuItem[] = [
  getItem('Cost Management', '/cost-management', <TeamOutlined />),
  getItem('Payment Tracker', '/payment-tracker', <TeamOutlined />),
  getItem('Handover Tool', '/handover-tool', <TeamOutlined />),
  getItem('Notes', '/notes', <TeamOutlined />),
  getItem('Snagging List', '/snagging-list', <TeamOutlined />),
];

// Submenu for Basic Admin
const projectSubMenuBasic: MenuItem[] = [
  getItem('Cost Management', '/cost-management', <TeamOutlined />),
  getItem('Handover Tool', '/handover-tool', <TeamOutlined />),
  getItem('Notes', '/notes', <TeamOutlined />),
  getItem('Snagging List', '/snagging-list', <TeamOutlined />),
];

// Main navigation items (always visible)
const mainItemsForSuperAdmin: MenuItem[] = [
  getItem('Dashboard', '/welcome', <PieChartOutlined />),
  getItem('Ongoing Projects', '/projects', <DesktopOutlined />),
  getItem('Completed Projects', '/projects?status=completed', <FileOutlined />),
  getItem("super-admin", '/super-admin', <TeamOutlined />),
  getItem('Prime Admins', '/prime-admins', <TeamOutlined />),
  getItem('Basic Admins', '/basic-admins', <TeamOutlined />),
  getItem('Clients', '/clients', <TeamOutlined />),
];



const mainItemsForPrimeAndBasicAdmin: MenuItem[] = [
  getItem('Dashboard', '/welcome', <PieChartOutlined />),
  getItem('Ongoing Projects', '/projects', <DesktopOutlined />),
  getItem('Completed Projects', '/projects?status=completed', <FileOutlined />),
];
interface DashboardLayoutProps {
  children: React.ReactNode;
}



// DashboardLayout component starts here


const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notifications, setNotifications] = useState(notificationData);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const navigate = useNavigate();
const [onProfilePage, setOnProfilePage] = useState(false);
const location = useLocation();

useEffect(() => {
  setOnProfilePage(location.pathname === '/profile');
}, [location.pathname]);



const handleOpenNotification = () => {
  setIsNotificationModalOpen(true);

  // Mark all as read
  setNotifications(prev =>
    prev.map(notification => ({ ...notification, isRead: true }))
  );
};



  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  
 

  const userRole = localStorage.getItem('role');

   // 🚨 If role is missing or invalid, redirect early
  const validRoles = ['super-admin', 'prime-admin', 'basic-admin', 'client'];
  if (!userRole || !validRoles.includes(userRole)) {
    navigate('/welcome', { replace: true });
    return null; // ⛔ Prevent further rendering
  }

  // Check if user is viewing a specific project detail page (e.g. /projects/123)
  const isInProjectDetail =
    matchPath("/projects/:id/*", location.pathname) ||
    location.pathname.startsWith('/cost-management') ||
    location.pathname.startsWith('/payment-tracker') ||
    location.pathname.startsWith('/handover-tool') ||
    location.pathname.startsWith('/notes') ||
    location.pathname.startsWith('/snagging-list');


let mainItems: MenuItem[] = [];
    if (userRole === 'super-admin') {
    mainItems = [...mainItemsForSuperAdmin];
  } else if (userRole === 'prime-admin' || userRole === 'basic-admin') {
    mainItems = [...mainItemsForPrimeAndBasicAdmin];
  } else {
    navigate('/welcome', { replace: true }); // ✅ Proper redirection
    return null; // ✅ Stop rendering layout
  }

  // Build the sidebar items
  let items: MenuItem[] = [...mainItems];

 if (isInProjectDetail) {
  if (userRole === 'super-admin' || userRole === 'prime-admin') {
    items = [...projectSubMenuSuperPrime];
  } else if (userRole === 'basic-admin') {
    items = [...projectSubMenuBasic];
  }
 }
 const path = useLocation().pathname;

const rawUser = localStorage.getItem("user");
const userInfo: UserInfo = rawUser ? JSON.parse(rawUser) : {};
// const unreadCount = 5; // Example unread notification count, replace with actual logic

  return (
    <>
     <div className='bg-white h-16 w-full fixed top-0 left-0 z-50 shadow-sm flex items-center justify-between px-6 '>
     {/* <div className='bg-[oklch(92.9% 0.013 255.508)] h-18 oklch(92.9% 0.013 255.508)'> */}
       <div className='flex items-center justify-between m-8'>
       <img src={logo} alt="Logo" 
       className={`w-8 h-4 mx-auto my-6 `}
      //  className={`${collapsed ? "w-8 h-4" : "w-10 h-6"} mx-auto my-6 `}
       />
       <p className='text-lg font-bold m-4'>MVV Portal</p>

       {/* <MediumOutlined style={{ fontSize: '24px', color: '#00392A' }}/> */}
       {/* <img
            src={AllImages.logo}
            className={`${collapsed ? "w-10 h-6" : "w-12 h-8"} mx-auto my-6 bg-black`}
          /> */}
       </div>
       <div className='flex items-center justify-between mt-2 '>
         <div className="relative">
            <Button type="text" onClick={handleOpenNotification}>
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
  onClick={() => {
    if (onProfilePage) {
      navigate(-1);
    } else {
      navigate('/profile');
    }
  }}
>
  {userInfo?.profileImg ? (
    <img
      src={userInfo.profileImg}
      className="w-8 h-8 object-cover rounded-full"
      alt="Profile"
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

            

          {/* <div className='flex items-center justify-between mr-12 p-2'>
             <div className='border rounded-full p-2'><FaRegUser  /></div>
             <h1 className='ml-4'>Ahmad Musa</h1>
          </div> */}
       </div>
     </div>
    <Layout style={{ minHeight: '100vh',  paddingTop: 64 }}>
  <Sider
        className="w-[400px]"
        width={250}
        collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)} style={{ background: "#ffffff", width: "500px" }}>
          <div className="demo-logo-vertical" />
          <Menu
           defaultSelectedKeys={[path]}
            onClick={({ key }) => {
    navigate(key); // 👈 Navigate to the route using the item's key
  }}
           mode="inline"
           items={items}
           expandIcon={({ isOpen }) => (
           <span style={{ marginLeft: 8, display: 'flex', alignItems: 'center' }}>
          <svg
           style={{
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: '0.3s',
          }}
          width="12"
          height="12"
          viewBox="0 0 1024 1024"
        >
          <path d="M384 192l384 320-384 320z" fill="currentColor" />
        </svg>
      </span>
    )}
  />
        {/* <Menu defaultSelectedKeys={[path]} mode="inline" items={menuItems} /> */}
        {/* <Menu theme="dark" defaultSelectedKeys={[path]} mode="inline" items={menuItems} /> */}
      </Sider>
      <Layout>
        
      <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}  />
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
    
    {/* Notification Modal */}
      <NotificationModal
  open={isNotificationModalOpen}
  onClose={() => setIsNotificationModalOpen(false)}
  notifications={notifications}
/>
    
    </>
  );
};

export default DashboardLayout;
