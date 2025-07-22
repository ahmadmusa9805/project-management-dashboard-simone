import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useNavigate, useLocation, matchPath, redirect } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

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

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = localStorage.getItem('role');

  // Check if user is viewing a specific project detail page (e.g. /projects/123)
  const isInProjectDetail =
    matchPath("/projects/:id/*", location.pathname) ||
    location.pathname.startsWith('/cost-management') ||
    location.pathname.startsWith('/payment-tracker') ||
    location.pathname.startsWith('/handover-tool') ||
    location.pathname.startsWith('/notes') ||
    location.pathname.startsWith('/snagging-list');

let mainItems: MenuItem[] = [];
    if(userRole==='super-admin'){
      // Super Admin has access to all main items
      mainItems = [...mainItemsForSuperAdmin];

    }else if(userRole==='prime-admin' || userRole==='basic-admin'){
      // Prime and Basic Admins have access to a subset of main items
      mainItems = [...mainItemsForPrimeAndBasicAdmin];
    }
    else{
      redirect('/welcome');
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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
          onClick={({ key }) => navigate(key.toString())}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }} items={[{ title: 'Dashboard' }]} />
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
  );
};

export default DashboardLayout;
