// ✅ src/utils/sidebarItems.tsx
import React from "react";
import {
  PieChartOutlined,
  DesktopOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

type Role = "super-admin" | "prime-admin" | "basic-admin" | "client";

// ✅ MenuItem type from Ant Design
type MenuItem = Required<MenuProps>["items"][number];

export interface SidebarItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  allowedRoles: Role[];
  children?: SidebarItem[];
}

// ✅ Raw sidebar definitions
const rawSidebarItems: SidebarItem[] = [
  {
    key: "/dashboard",
    label: "Dashboard",
    icon: <PieChartOutlined />,
    allowedRoles: ["super-admin", "prime-admin"],
  },
  {
    key: "/projects",
    label: "Projects",
    icon: <DesktopOutlined />,
    allowedRoles: ["super-admin", "prime-admin", "basic-admin", "client"],
    children: [
      {
        key: "/projects?status=onging",
        label: "Ongoing Projects",
        allowedRoles: ["super-admin", "prime-admin", "basic-admin"],
      },
      {
        key: "/projects?status=completed",
        label: "Completed Projects",
        allowedRoles: ["super-admin", "prime-admin", "basic-admin"],
      },
    ],
  },
  {
    key: "/prime-admins",
    label: "Prime Admins",
    icon: <TeamOutlined />,
    allowedRoles: ["super-admin"],
  },
  {
    key: "/basic-admins",
    label: "Basic Admins",
    icon: <TeamOutlined />,
    allowedRoles: ["super-admin"],
  },
  {
    key: "/labours",
    label: "Labour Management",
    icon: <TeamOutlined />,
    allowedRoles: ["super-admin"],
  },
  {
    key: "/clients",
    label: "Clients",
    icon: <TeamOutlined />,
    allowedRoles: ["super-admin"],
  },
];

// ✅ Convert SidebarItem[] to MenuItem[] for Ant Design
export function getSidebarMenuItems(role: Role): MenuItem[] {
  const filterItems = (items: SidebarItem[]): MenuItem[] => {
    return items
      .filter((item) => item.allowedRoles.includes(role))
      .map((item) => ({
        key: item.key,
        label: item.label,
        icon: item.icon,
        children: item.children ? filterItems(item.children) : undefined,
      }));
  };

  return filterItems(rawSidebarItems);
}

// ✅ Project menu builder (dynamic submenu items per project)
export function getProjectMenuItems(projectId: string, role: Role): MenuItem[] {
  const allItems: SidebarItem[] = [
    {
      key: `/projects/${projectId}/dashboard`,
      label: "Dashboard",
      allowedRoles: ["super-admin", "prime-admin"],
    },
    // {
    //   key: `/projects/${projectId}/details`,
    //   label: "Project Details",
    //   allowedRoles: ["super-admin", "prime-admin", "basic-admin"],
    // },
    {
      key: `/projects/${projectId}/quote-details`,
      label: "Quote Details",
      allowedRoles: ["super-admin", "prime-admin", "client"],
    },
    {
      key: `/projects/${projectId}/interim-evaluation`,
      label: "Interim Evaluations",
      allowedRoles: ["super-admin", "prime-admin"],
    },
    {
      key: `/projects/${projectId}/live-project-costs`,
      label: "Live Project Costs",
      allowedRoles: ["super-admin", "prime-admin"],
    },
    {
      key: `/projects/${projectId}/payments-track`,
      label: "Payments Track",
      allowedRoles: ["super-admin", "prime-admin"],
    },
    {
      key: `/projects/${projectId}/site-pictures-reports`,
      label: "Site Pictures & Reports",
      allowedRoles: ["super-admin", "prime-admin", "basic-admin", "client"],
    },

    {
      key: `/projects/${projectId}/certificates`,
      label: "Certificates",
      allowedRoles: ["super-admin", "prime-admin", "basic-admin"],
    },
    {
      key: `/projects/${projectId}/documents`,
      label: "Documents",
      allowedRoles: ["super-admin", "prime-admin", "basic-admin", "client"],
    },
    {
      key: `/projects/${projectId}/second-fixed-list-material`,
      label: "Second Fixed List",
      allowedRoles: ["super-admin", "prime-admin", "basic-admin"],
    },
    {
      key: `/projects/${projectId}/handover-tool`,
      label: "Handover Tool",
      allowedRoles: ["super-admin", "prime-admin"],
    },
    {
      key: `/projects/${projectId}/time-schedule`,
      label: "Time Schedule",
      allowedRoles: ["super-admin", "prime-admin", "basic-admin", "client"],
    },
    {
      key: `/projects/${projectId}/snagging-list`,
      label: "Snagging List",
      allowedRoles: ["super-admin", "prime-admin", "basic-admin", "client"],
    },
    {
      key: `/projects/${projectId}/notes`,
      label: "Notes",
      allowedRoles: ["super-admin", "prime-admin", "basic-admin", "client"],
    },
    // {
    //   key: `/projects/${projectId}/labour`,
    //   label: "Labour",
    //   allowedRoles: ["super-admin", "prime-admin", "basic-admin"],
    // },
    {
      key: `/projects/${projectId}/client-details`,
      label: "Client Details",
      allowedRoles: ["super-admin", "prime-admin"],
    },
  ];

  return allItems
    .filter((item) => item.allowedRoles.includes(role))
    .map((item) => ({
      key: item.key,
      label: item.label,
      icon: <TeamOutlined />,
    }));
}
