// src/components/CustomViewMoreButton.tsx
import { Dropdown, Button } from "antd";
import { EllipsisVertical } from "lucide-react";
import type { MenuProps } from "antd";
import React from "react";
import "../pages/projects/css/projects.css";

interface CustomViewMoreButtonProps {
  items: MenuProps["items"]; // Array of menu items
  onClick?: (key: string, e: React.MouseEvent) => void;
}

const CustomViewMoreButton: React.FC<CustomViewMoreButtonProps> = ({
  items,
  onClick,
}) => {
  // Handle dropdown menu click
  const handleClick: MenuProps["onClick"] = (info) => {
    if (onClick) {
      onClick(info.key, info.domEvent as React.MouseEvent);
      info.domEvent.stopPropagation(); // Prevent parent div click
    }
  };

  return (
    <Dropdown
      menu={{
        items,
        onClick: handleClick,
        className: "custom-dropdown-menu", // Optional CSS class
      }}
      trigger={["click"]}
      placement="bottomRight"
    >
      <Button
        type="text"
        className="rounded-full"
        onClick={(e) => e.stopPropagation()} // Stop parent click when button is clicked
      >
        <EllipsisVertical size={18} />
      </Button>
    </Dropdown>
  );
};

export default CustomViewMoreButton;
