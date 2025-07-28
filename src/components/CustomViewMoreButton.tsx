import { Dropdown, Menu, Button } from 'antd';
import { EllipsisVertical } from 'lucide-react';
import type { MenuProps } from 'antd';
import '../pages/projects/css/projects.css'

interface CustomViewMoreButtonProps {
  items: MenuProps['items']; // Pass an array of menu items
  onClick?: (key: string) => void; // Handle action based on key
}

const CustomViewMoreButton: React.FC<CustomViewMoreButtonProps> = ({ items, onClick }) => {
  const handleClick: MenuProps['onClick'] = (info) => {
    if (onClick) {
      onClick(info.key);
    }
  };

  return (
    <Dropdown
  menu={{
    items,
    onClick: handleClick,
    className: 'custom-dropdown-menu', // works, but not directly on .ant-menu-item
  }}
  trigger={['click']}
  placement="bottomRight"
>
  <Button type="text" className="rounded-full">
    <EllipsisVertical size={18} />
  </Button>
</Dropdown>


  );
};

export default CustomViewMoreButton;
