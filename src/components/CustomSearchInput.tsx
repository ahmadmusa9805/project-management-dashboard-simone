// import { Input, Button } from "antd";
// import type { GetProps } from "antd";
// import "../components/css/CustomSearchInput.css";
// import { SearchIcon } from "lucide-react";

// const { Search } = Input;
// type SearchProps = GetProps<typeof Input.Search>;

// const CustomSearchInput = ({
//   onSearch,
//   onChange,
// }: {
//   onSearch: SearchProps["onSearch"];
//   onChange?: (value: string) => void;
// }) => {
//   return (
//     <Search
//       className="mb-4 custom-search-input"
//       size="large"
//       placeholder="Search..."
//       allowClear={false}
//       onSearch={onSearch}
//       onChange={(e) => onChange?.(e.target.value)} // ✅ Add this
//       enterButton={
//         <Button type="primary" className="custom-search-button">
//           <SearchIcon />
//         </Button>
//       }
//       style={{
//         width: 400,
//         paddingLeft: 12,
//         paddingRight: 12,
//         display: "flex",
//         alignItems: "center",
//       }}
//     />
//   );
// };

// export default CustomSearchInput;

import { Input, Button } from "antd";
import type { GetProps } from "antd";
import "../components/css/CustomSearchInput.css";
import { SearchIcon } from "lucide-react";

const { Search } = Input;
type SearchProps = GetProps<typeof Input.Search>;

interface CustomSearchInputProps {
  onSearch: SearchProps["onSearch"];
  onChange?: (value: string) => void;
  value?: string;
  placeholder?: string;
  className?: string;
  allowClear?: boolean;
  loading?: boolean;
  style?: React.CSSProperties;
}

export const CustomSearchInput: React.FC<CustomSearchInputProps> = ({
  onSearch,
  onChange,
  value,
  placeholder = "Search...",
  className = "mb-4 custom-search-input",
  allowClear = true,
  loading = false,
  style,
}) => {
  return (
    <Search
      className={className}
      size="large"
      placeholder={placeholder}
      allowClear={allowClear}
      value={value}
      onSearch={onSearch}
      loading={loading}
      onChange={(e) => onChange?.(e.target.value)}
      enterButton={
        <Button
          type="primary"
          htmlType="submit"
          className="custom-search-button"
        >
          <SearchIcon />
        </Button>
      }
      style={{
        width: 400,
        paddingLeft: 12,
        paddingRight: 12,
        display: "flex",
        alignItems: "center",
        ...style,
      }}
    />
  );
};

// Add CSS styles in CustomSearchInput.css
