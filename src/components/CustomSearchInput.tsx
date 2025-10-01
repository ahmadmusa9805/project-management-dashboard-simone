import { Input, Button } from "antd";
import type { GetProps } from "antd";
import "../components/css/CustomSearchInput.css";
import { SearchIcon } from "lucide-react";

const { Search } = Input;
type SearchProps = GetProps<typeof Input.Search>;

const CustomSearchInput = ({
  onSearch,
  onChange,
}: {
  onSearch: SearchProps["onSearch"];
  onChange?: (value: string) => void;
}) => {
  return (
    <Search
      className="mb-4 custom-search-input"
      size="large"
      placeholder="Search..."
      allowClear={false}
      onSearch={onSearch}
      onChange={(e) => onChange?.(e.target.value)} // ✅ Add this
      enterButton={
        <Button type="primary" className="custom-search-button">
          <SearchIcon />
        </Button>
      }
      style={{
        width: 400,
        paddingLeft: 12,
        paddingRight: 12,
        display: "flex",
        alignItems: "center",
      }}
    />
  );
};

export default CustomSearchInput;
