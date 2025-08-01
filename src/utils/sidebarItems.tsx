// ✅ src/utils/sidebarItems.tsx
import React from "react";

import type { MenuProps } from "antd";
import {
  BanknoteIcon,
  CalendarClockIcon,
  ChartBarBigIcon,
  ClipboardListIcon,
  Crown,
  FileBadgeIcon,
  FilePenLineIcon,
  FolderOpenIcon,
  HandshakeIcon,
  HardHatIcon,
  ImageIcon,
  Layers,
  LayoutDashboardIcon,
  ListChecksIcon,
  ListTodoIcon,
  RefreshCw,
  ShieldCheckIcon,
  SquareUserRoundIcon,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { USER_ROLE } from "../types/userAllTypes/user";

type Role ="superAdmin" | "primeAdmin" | "basicAdmin" | "client";

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
    icon: <LayoutDashboardIcon />,
    allowedRoles: [USER_ROLE.superAdmin],
  },
  {
    key: "/projects",
    label: "Projects",
    icon: <Layers />,
    allowedRoles: [USER_ROLE.superAdmin,USER_ROLE.primeAdmin,USER_ROLE.basicAdmin,USER_ROLE.client],
    children: [
      {
  key: "/projects?status=ongoing", // Correct spelling: ongoing (not onging)
  label: "Ongoing Projects",
  icon: <RefreshCw />,
  allowedRoles: [USER_ROLE.superAdmin,USER_ROLE.primeAdmin,USER_ROLE.basicAdmin,],
},
{
  key: "/projects?status=completed",
  label: "Completed Projects",
  icon: <ShieldCheckIcon />,
  allowedRoles: [USER_ROLE.superAdmin,USER_ROLE.primeAdmin,USER_ROLE.basicAdmin,],
}
    ],
  },
  {
    key: "/prime-admins",
    label: "Prime Admins",
    icon: <Crown />,
    allowedRoles: [USER_ROLE.superAdmin],
  },
  {
    key: "/basic-admins",
    label: "Basic Admins",
    icon: <Users />,
    allowedRoles: [USER_ROLE.superAdmin],
  },
  {
    key: "/labours",
    label: "Labour Management",
    icon: <HardHatIcon />,
    allowedRoles: [USER_ROLE.superAdmin],
  },
  {
    key: "/clients",
    label: "Clients",
    icon: <UserPlus></UserPlus>,
    allowedRoles: [USER_ROLE.superAdmin],
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
      icon: <LayoutDashboardIcon />,
      allowedRoles: [USER_ROLE.superAdmin,USER_ROLE.primeAdmin,],
    },
    // {
    //   key: `/projects/${projectId}/details`,
    //   label: "Project Details",
    //   allowedRoles: ["super-admin", "prime-admin", "basic-admin"],
    // },
    {
      key: `/projects/${projectId}/quote-details`,
      label: "Quote Details",
      icon: <ClipboardListIcon />,
      allowedRoles: [USER_ROLE.superAdmin,USER_ROLE.primeAdmin, "client"],
    },
    {
      key: `/projects/${projectId}/interim-evaluation`,
      label: "Interim Evaluations",
      icon: <ChartBarBigIcon />,
      allowedRoles: [USER_ROLE.superAdmin,USER_ROLE.primeAdmin,],
    },
    {
      key: `/projects/${projectId}/live-project-costs`,
      label: "Live Project Costs",
      icon: <TrendingUp />,
      allowedRoles: [USER_ROLE.superAdmin,USER_ROLE.primeAdmin,],
    },
    {
      key: `/projects/${projectId}/payments-track`,
      label: "Payments Track",
      icon: <BanknoteIcon />,
      allowedRoles: [USER_ROLE.superAdmin,USER_ROLE.primeAdmin,],
    },
    {
      key: `/projects/${projectId}/site-pictures-reports`,
      label: "Site Pictures & Reports",
      icon: <ImageIcon />,
      allowedRoles: [USER_ROLE.superAdmin,USER_ROLE.primeAdmin,USER_ROLE.basicAdmin,USER_ROLE.client],
    },

    {
      key: `/projects/${projectId}/certificates`,
      label: "Certificates",
      icon: <FileBadgeIcon />,
      allowedRoles: [USER_ROLE.superAdmin,USER_ROLE.primeAdmin,USER_ROLE.basicAdmin],
    },
    {
      key: `/projects/${projectId}/documents`,
      label: "Documents",
      icon: <FolderOpenIcon />,
      allowedRoles: [USER_ROLE.superAdmin,USER_ROLE.primeAdmin,USER_ROLE.basicAdmin,USER_ROLE.client],
    },
    {
      key: `/projects/${projectId}/second-fixed-list-material`,
      label: "Second Fixed List",
      icon: <ListChecksIcon />,
      allowedRoles: [USER_ROLE.superAdmin,USER_ROLE.primeAdmin,USER_ROLE.basicAdmin],
    },
    {
      key: `/projects/${projectId}/handover-tool`,
      label: "Handover Tool",
      icon: <HandshakeIcon />,
      allowedRoles: [USER_ROLE.superAdmin,USER_ROLE.primeAdmin],
    },
    {
      key: `/projects/${projectId}/time-schedule`,
      label: "Time Schedule",
      icon: <CalendarClockIcon />,
      allowedRoles: [USER_ROLE.superAdmin,USER_ROLE.primeAdmin,USER_ROLE.basicAdmin,USER_ROLE.client],
    },
    {
      key: `/projects/${projectId}/snagging-list`,
      label: "Snagging List",
      icon: <ListTodoIcon />,
      allowedRoles: [USER_ROLE.superAdmin,USER_ROLE.primeAdmin,USER_ROLE.basicAdmin,USER_ROLE.client],
    },
    {
      key: `/projects/${projectId}/notes`,
      label: "Notes",
      icon: <FilePenLineIcon />,
      allowedRoles: [USER_ROLE.superAdmin,USER_ROLE.primeAdmin,USER_ROLE.basicAdmin,USER_ROLE.client],
    },
    // {
    //   key: `/projects/${projectId}/labour`,
    //   label: "Labour",
    //   allowedRoles: ["super-admin", "prime-admin", "basic-admin"],
    // },
    {
      key: `/projects/${projectId}/client-details`,
      label: "Client Details",
      icon: <SquareUserRoundIcon />,
      allowedRoles: [USER_ROLE.superAdmin,USER_ROLE.primeAdmin],
    },
  ];

  return allItems
    .filter((item) => item.allowedRoles.includes(role))
    .map((item) => ({
      key: item.key,
      label: item.label,
      icon: item?.icon,
    }));
}
