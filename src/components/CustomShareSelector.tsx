/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
// import { Input, Checkbox, Button } from "antd";
// import { SearchOutlined } from "@ant-design/icons";
// import { useGetAllUsersQuery } from "../Redux/features/users/usersApi";

// // interface User {
// //   id: number;
// //   name: string;
// //   email?: string;
// //   role: string;
// //   photo?: string;
// // }

// interface CustomShareSelectorProps {
//   title?: string;
//   roles: string[]; // Example: ['prime-admin', 'basic-admin', 'client']
//   onShare: (selectedUserIds: string[]) => void;
// }

// const CustomShareSelector = ({
//   title = "Share with",
//   roles,
//   onShare,
// }: CustomShareSelectorProps) => {
//   const { data: response } = useGetAllUsersQuery({ status: 'active' });
//  const users = (response?.data || []).filter(
//   (item: any) => item._id && item.name && item.role && item.email
// );

//   const [searchText, setSearchText] = useState("");
//   const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
//   const [selectedRole, setSelectedRole] = useState<string>("all");

//  const filteredUsers = users.filter((user) => {
//   const matchesName = user.name.toLowerCase().includes(searchText.toLowerCase());
//   const matchesRole =
//     selectedRole === "all" || user.role.toLowerCase() === selectedRole.toLowerCase();
//   return matchesName && matchesRole;
// });

//   const handleToggleUser = (id: string) => {
//     setSelectedUserIds((prev) =>
//       prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
//     );
//   };

//   return (
//     <div className="w-full h-full p-4 bg-white rounded flex flex-col gap-4">
//       {/* Title */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-lg font-medium text-[#000E0F]">{title}</h2>
//         <div className="w-6 h-6 bg-[#001D01] rounded" />
//       </div>

//       {/* Role Filter Buttons */}
//       <div className="flex gap-2 flex-wrap">
//         <div
//           onClick={() => setSelectedRole("all")}
//           className={`px-3 py-2 rounded-full text-sm font-medium cursor-pointer border ${
//             selectedRole === "all" ? "bg-[#e6f4ea] border-[#0d542b]" : "border-[#969C9D]"
//           }`}
//         >
//           All
//         </div>
//         {roles.map((role) => (
//           <div
//             key={role}
//             onClick={() => setSelectedRole(role)}
//             className={`px-3 py-2 rounded-full text-sm font-medium cursor-pointer border ${
//               selectedRole === role ? "bg-[#e6f4ea] border-[#0d542b]" : "border-[#969C9D]"
//             }`}
//           >
//             {role.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
//           </div>
//         ))}
//       </div>

//       {/* Search Bar */}
//       <div className="flex items-center gap-3 px-2 py-3 border-2 border-gray-200 rounded">
//         <div className="flex items-center gap-1">
//           {filteredUsers.slice(0, 3).map((user) => (
//             <img
//               key={user._id}
//               className="w-6 h-6 rounded-full border border-gray-300"
//               src={user.profileImg}
//               alt={user.name}
//             />
//           ))}
//         </div>
//         <Input
//           placeholder="Search..."
//           bordered={false}
//           prefix={<SearchOutlined />}
//           className="flex-1 text-[#6B7374] text-base"
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//         />
//       </div>

//       {/* User List */}
//       <div className="flex flex-col gap-4 max-h-60 overflow-y-auto">
//         {filteredUsers.length > 0 ? (
//           filteredUsers.map((user) => (
//             <div
//               key={user._id}
//               className="w-full flex items-center justify-between gap-4 border-b border-[#E6E7E7] py-4"
//             >
//               <div className="flex items-center gap-4">
//                 <img
//                   className="w-10 h-10 p-2 bg-[#E6E7E7] rounded-full"
//                   src={user.profileImg}
//                   alt={user.name}
//                 />
//                 <div>
//                   <span className="text-[#172B4D] text-base font-medium">
//                     {user.name}
//                   </span>
//                   <div className="text-xs text-[#6B7374] ">{user.role.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</div>
//                 </div>
//               </div>
//               <Checkbox
//               className="border-[#E6E7E7]"
//                 checked={selectedUserIds.includes(user._id)}
//                 onChange={() => handleToggleUser(user._id)}
//               />
//             </div>
//           ))
//         ) : (
//           <div className="text-center text-sm text-gray-500">No users found</div>
//         )}
//       </div>

//       {/* Share Button */}
//       <Button
//         type="primary"
//         className="w-full bg-[#001D01] text-white text-base font-medium h-12"
//         onClick={() => onShare(selectedUserIds)}
//       >
//         Share
//       </Button>
//     </div>
//   );
// };

// export default CustomShareSelector;

// components/CustomShareSelector.tsx
import { useState } from "react";
import { Input, Checkbox, Button, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

import { useGetAllUsersQuery } from "../Redux/features/users/usersApi";
import type { RootState } from "../Redux/app/store";

export type SharedUser = { userId: string; role: string };

interface CustomShareSelectorProps {
  title?: string;
  shareing?: boolean;
  roles: string[];
  onShare: (selectedUsers: SharedUser[]) => void;
}

const CustomShareSelector = ({
  title = "Share with",
  roles,
  shareing,
  onShare,
}: CustomShareSelectorProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const userRole = user?.role;

  const { data: response, isLoading } = useGetAllUsersQuery({
    status: "active",
  });

  // Filter users who have all required info and optionally exclude superAdmin if logged-in user is superAdmin
  const users = (response?.data || []).filter(
    (item: any) =>
      item._id &&
      item.name &&
      item.role &&
      item.email &&
      !(userRole === "superAdmin" && item.role === "superAdmin")
  );

  const [searchText, setSearchText] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<SharedUser[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const filteredUsers = users.filter((user) => {
    const matchesName = user.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesRole =
      selectedRole === "all" ||
      user.role.toLowerCase() === selectedRole.toLowerCase();
    return matchesName && matchesRole;
  });

  const handleToggleUser = (id: string, role: string) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.userId === id)
        ? prev.filter((u) => u.userId !== id)
        : [...prev, { userId: id, role }]
    );
  };

  // Filter roles for buttons: remove superAdmin if logged-in user is superAdmin
  const filteredRoles =
    userRole === "superAdmin" ? roles.filter((r) => r !== "superAdmin") : roles;

  return (
    <div className="w-full h-full p-4 bg-white rounded flex flex-col gap-4">
      {/* Title */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-[#000E0F]">{title}</h2>
      </div>

      {/* Role Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        <div
          onClick={() => setSelectedRole("all")}
          className={`px-3 py-2 rounded-full text-sm font-medium cursor-pointer border ${
            selectedRole === "all"
              ? "bg-[#e6f4ea] border-[#0d542b]"
              : "border-[#969C9D]"
          }`}
        >
          All
        </div>
        {filteredRoles.map((role) => (
          <div
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`px-3 py-2 rounded-full text-sm font-medium cursor-pointer border ${
              selectedRole === role
                ? "bg-[#e6f4ea] border-[#0d542b]"
                : "border-[#969C9D]"
            }`}
          >
            {role.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </div>
        ))}
      </div>

      {/* Search and Users (remain unchanged) */}
      <div className="flex items-center gap-3 px-2 py-3 border-2 border-gray-200 rounded">
        <div className="flex items-center gap-1">
          {filteredUsers.slice(0, 3).map((user) => (
            <img
              key={user._id}
              className="w-6 h-6 rounded-full border border-gray-300"
              src={user.profileImg}
              alt={user.name}
            />
          ))}
        </div>
        <Input
          placeholder="Search..."
          bordered={false}
          prefix={<SearchOutlined />}
          className="flex-1 text-[#6B7374] text-base"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-4 max-h-60 overflow-y-auto">
        {isLoading && <Spin size="large" />}
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className="w-full flex items-center justify-between gap-4 border-b border-[#E6E7E7] py-4"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-10 h-10 p-2 bg-[#E6E7E7] rounded-full"
                  src={user.profileImg}
                  alt={user.name}
                />
                <div>
                  <span className="text-[#172B4D] text-base font-medium">
                    {user.name}
                  </span>
                  <div className="text-xs text-[#6B7374] ">
                    {user.role
                      .replace("-", " ")
                      .replace(/\b\w/g, (c: string) => c.toUpperCase())}
                  </div>
                </div>
              </div>
              <Checkbox
                checked={selectedUsers.some((u) => u.userId === user._id)}
                onChange={() => handleToggleUser(user._id, user.role)}
              />
            </div>
          ))
        ) : (
          <div className="text-center text-sm text-gray-500">
            No users found
          </div>
        )}
      </div>

      <Button
        type="primary"
        className="w-full bg-[#001D01] text-white text-base font-medium h-12"
        disabled={selectedUsers.length === 0}
        onClick={() => {
          onShare(selectedUsers);
          setSelectedUsers([]);
        }}
        loading={shareing}
      >
        {shareing ? "Sharing..." : "Share"}
      </Button>
    </div>
  );
};

export default CustomShareSelector;
