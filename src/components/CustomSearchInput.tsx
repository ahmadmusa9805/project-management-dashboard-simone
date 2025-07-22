
import { Input } from 'antd';
import type { GetProps } from 'antd';

const { Search } = Input;
type SearchProps = GetProps<typeof Input.Search>;

const CustomSearchInput = ({ onSearch }: { onSearch: SearchProps['onSearch'] }) => {
  return (
    <Search 
    className='mb-4'
    size='large'
      placeholder="Search..."
      allowClear={false}
      enterButton
      onSearch={onSearch}
      style={{
        width: 400,
        paddingLeft: 12,
        paddingRight: 12,
        display: 'flex',
        alignItems: 'center',
      }}
    />
  );
};

export default CustomSearchInput;
