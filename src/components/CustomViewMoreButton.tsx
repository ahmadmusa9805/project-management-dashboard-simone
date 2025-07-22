import { Dropdown, Menu, Button } from 'antd';
import { EllipsisVertical } from 'lucide-react';
import type { MenuProps } from 'antd';

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
      overlay={
        <Menu
          items={items}
          onClick={handleClick}
          style={{ minWidth: 160 }}
        />
      }
      trigger={['click']}
      placement="bottomRight"
    >
      <Button type="text" className="hover:bg-gray-100 rounded-full">
        <EllipsisVertical size={18} />
      </Button>
    </Dropdown>
  );
};

export default CustomViewMoreButton;
