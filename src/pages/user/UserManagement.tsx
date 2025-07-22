import  { useState } from 'react';
import { Input,  Select,  type GetProps } from 'antd';
import CustomSearchInput from '../../components/CustomSearchInput';
import CustomCreateButton from '../../components/CustomCreateButton';
import CustomViewMoreButton from '../../components/CustomViewMoreButton';
import { Drawer } from 'antd';
import UserCreateEditPage from './UserCreateEditPage';
import getStatusClasses from '../../utils/getStatusClasses';
import type { StatusType } from '../../types/userAllTypes/user';
import { useLocation } from 'react-router-dom';
// adjust the path if needed







interface DataItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: StatusType;
  userType: 'super-admin'|'prime-admin' | 'basic-admin' | 'client';
  quoteValue?: string;
  projectName?: string;
}

type SearchProps = GetProps<typeof Input.Search>;


// Sample data
const initialData: DataItem[] = [
  { id: 1, name: 'Daniel Carter', email: 'danielcarter@gmail.com', phone: '+44 7911 123456', status: 'Active', userType: 'prime-admin' },
  { id: 2, name: 'Sophia Mitchell', email: 'sophiamitchess@gmail.com', phone: '+44 7911 123457', status: 'In pipeline', userType: 'client', quoteValue: '$5000', projectName: 'E-commerce Site' },
  { id: 3, name: 'Liam Bennett', email: 'liambennet@gmail.com', phone: '+44 7911 123458', status: 'Disable', userType: 'basic-admin' },
  { id: 4, name: 'Emily Harrison', email: 'emilyharrison@gmail.com', phone: '+44 7911 123459', status: 'Suspended', userType: 'client', quoteValue: '$3000', projectName: 'CRM System' },
  // ...
];


const ITEMS_PER_PAGE = 5;




const AdminTable = () => {
const [page, setPage] = useState(1);
const [searchText, setSearchText] = useState('');
const [openDrawer, setOpenDrawer] = useState(false);
const [mode, setMode] = useState<'create' | 'edit'>('create');
const [selectedUser, setSelectedUser] = useState<DataItem | null>(null);
const [userData, setUserData] = useState<DataItem[]>(initialData);
const location = useLocation();
const pathname = location.pathname;

let routeUserType: DataItem['userType'] | null = null;

if (pathname === '/clients') routeUserType = 'client';
else if (pathname === '/prime-admins') routeUserType = 'prime-admin';
else if (pathname === '/basic-admins') routeUserType = 'basic-admin';
else routeUserType = null; // fallback or handle error

const role = localStorage.getItem('role') as DataItem['userType'] | null;
if (role !== 'super-admin') {
  return <div className="text-red-600 p-4">You are not authorized to access this page.</div>;
}


const filteredData = userData
  .filter(user => user.userType === routeUserType)
  .filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.email.toLowerCase().includes(searchText.toLowerCase()) ||
    item.phone.includes(searchText)
  );

const currentData = filteredData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
const onSearch: SearchProps['onSearch'] = (value) => {
  setSearchText(value);
  setPage(1); // reset to page 1 on search
};


const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <>
     <div className="max-w-7xl mx-auto p-4 ">
      <div className='flex  justify-between'><h1 className="text-2xl font-semibold mb-4">Manage Admin Table</h1>    <CustomSearchInput onSearch={onSearch} />
</div>
   <div className='py-2 justify-end flex'>
    
  <CustomCreateButton
  title="Create User"
  onClick={() => {
    setMode('create');
    setSelectedUser(null);
    setOpenDrawer(true);
  }}
/>
 </div>

      <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden">
<thead className="bg-gray-50 border-b border-gray-200">
  <tr>
    <th className="text-left px-4 py-2 text-gray-700">Name</th>
    <th className="text-left px-4 py-2 text-gray-700">Email</th>
    <th className="text-left px-4 py-2 text-gray-700">Contact Number</th>
    <th className="text-left px-4 py-2 text-gray-700">Status</th>
    {routeUserType === 'client' && (
  <>
    <th className="text-left px-4 py-2 text-gray-700">Quote Value</th>
    <th className="text-left px-4 py-2 text-gray-700">Project Name</th>
  </>
)}
    <th className="text-left px-4 py-2 text-gray-700">Actions</th>
  </tr>
</thead>


<tbody>
  {currentData.map(({ id, name, email, phone, status, quoteValue, projectName, userType }) => (
    <tr key={id} className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-4 py-3 text-gray-900">{name}</td>
      <td className="px-4 py-3 text-gray-900">{email}</td>
      <td className="px-4 py-3 text-gray-900">{phone}</td>
      <td className="px-4 py-3">
        <div
          className={`inline-block px-3 py-1 rounded text-sm font-medium ${getStatusClasses(status)}`}
        >
          <Select
            size="small"
            value={status}
            onChange={(newStatus: StatusType) => {
              setUserData((prevData) =>
                prevData.map((user) =>
                  user.id === id ? { ...user, status: newStatus } : user
                )
              );
            }}
          
            
          >
            <Select.Option value="Active">Active</Select.Option>
            <Select.Option value="Disable">Disable</Select.Option>
            <Select.Option value="Suspended">Suspended</Select.Option>
            <Select.Option value="In pipeline">In pipeline</Select.Option>
          </Select>
        </div>
      </td>
     {routeUserType === 'client' && (
  <>
    <td className="px-4 py-3 text-gray-900">{quoteValue}</td>
    <td className="px-4 py-3 text-gray-900">{projectName}</td>
  </>
)}

      <td className="px-4 py-3">
        <CustomViewMoreButton
          items={[
            { key: 'view', label: 'View User Details' },
            { key: 'edit', label: 'Edit User' },
          ]}
          onClick={(key) => {
            switch (key) {
              case 'view':
                console.log('View user');
                break;
              case 'edit':
                setMode('edit');
               setSelectedUser({ id, name, email, phone, status, quoteValue, projectName, userType });

                setOpenDrawer(true);
                break;
            }
          }}
        />
      </td>
    </tr>
  ))}
</tbody>


      </table>

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className={`px-4 py-2 rounded border ${
            page === 1
              ? 'text-gray-400 border-gray-300 cursor-not-allowed'
              : 'text-blue-600 border-blue-600 hover:bg-blue-50'
          }`}
        >
          Previous
        </button>

        <div className="text-gray-700">
          Page {page} of {totalPages}
        </div>

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded border ${
            page === totalPages
              ? 'text-gray-400 border-gray-300 cursor-not-allowed'
              : 'text-blue-600 border-blue-600 hover:bg-blue-50'
          }`}
        >
          Next
        </button>
      </div>
    </div>
    
    <Drawer
  open={openDrawer}
  onClose={() => setOpenDrawer(false)}
  width={720}
  title={mode === 'create' ? 'Create New User' : 'Edit User'}
>
  <UserCreateEditPage
  mode={mode}
  defaultValues={selectedUser ?? undefined}
  onSubmitSuccess={() => {
    // Optional: reload or update data
    setOpenDrawer(false);
  }}
  onCancel={() => setOpenDrawer(false)}
/>
</Drawer>

    
    </>
   
  );
};

export default AdminTable;
