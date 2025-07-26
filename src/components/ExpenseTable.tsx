import { useState, useEffect } from 'react';
import { Input, Drawer } from 'antd';
import type { ExpenseItem } from '../types/projectAllTypes/expense';
import CustomSearchInput from './CustomSearchInput';
import CustomViewMoreButton from './CustomViewMoreButton';
import CustomCreateButton from './CustomCreateButton';
import ExpenseForm from './ExpenseForm';

const ITEMS_PER_PAGE = 5;

interface ExpenseTableProps {
  data: ExpenseItem[];
}

const ExpenseTable = ({ data }: ExpenseTableProps) => {
  const [expenseData, setExpenseData] = useState<ExpenseItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('edit');

  // Load incoming data into local state
  useEffect(() => {
    setExpenseData(data);
  }, [data]);

  const filteredData = expenseData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const paginatedData = filteredData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const handleEdit = (item: ExpenseItem) => {
    setMode('edit');
    setEditingItem(item);
    setDrawerOpen(true);
  };

  const handleSubmit = (newItem: ExpenseItem) => {
    if (mode === 'edit') {
      const updated = expenseData.map((e) => (e.id === newItem.id ? newItem : e));
      setExpenseData(updated);
    } else {
      const newId = Math.max(0, ...expenseData.map((e) => e.id)) + 1;
      setExpenseData([...expenseData, { ...newItem, id: newId }]);
    }
    setDrawerOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header: Title + Search + Create */}
      <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
       
         <div className="ml-auto">
    <CustomCreateButton
      title="Create Expense"
      onClick={() => {
        setMode('create');
        setEditingItem(null);
        setDrawerOpen(true);
      }}
    />
  </div>
      </div>

      {/* Expense Table */}
      <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-2 text-gray-700">Name</th>
            <th className="text-left px-4 py-2 text-gray-700">Quantity</th>
            <th className="text-left px-4 py-2 text-gray-700">Cost</th>
            <th className="text-left px-4 py-2 text-gray-700">Date</th>
            <th className="text-left px-4 py-2 text-gray-700">Time</th>
            <th className="text-left px-4 py-2 text-gray-700">Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedData.map((item) => (
            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">{item.quantity}</td>
              <td className="px-4 py-2">${item.cost.toFixed(2)}</td>
              <td className="px-4 py-2">{item.date}</td>
              <td className="px-4 py-2">{item.time}</td>
              <td className="px-4 py-2">
                <CustomViewMoreButton
                  items={[{ key: 'edit', label: 'Edit Expense' }]}
                  onClick={(key) => {
                    if (key === 'edit') handleEdit(item);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className={`px-4 py-2 border rounded ${
            page === 1
              ? 'text-gray-400 border-gray-300 cursor-not-allowed'
              : 'text-blue-600 border-blue-600 hover:bg-blue-50'
          }`}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className={`px-4 py-2 border rounded ${
            page === totalPages
              ? 'text-gray-400 border-gray-300 cursor-not-allowed'
              : 'text-blue-600 border-blue-600 hover:bg-blue-50'
          }`}
        >
          Next
        </button>
      </div>

      {/* Drawer for Create/Edit */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={mode === 'edit' ? 'Edit Expense' : 'Create Expense'}
        width={720}
      >
        <ExpenseForm
          mode={mode}
          defaultValues={
            editingItem ?? {
              id: 0,
              type: 'Labor',
              name: '',
              quantity: 1,
              cost: 0,
              vatRate: 0,
              includesVat: false,
              date: '',
              time: '',
              description: '',
              files: [],
            }
          }
          onSubmit={()=>handleSubmit}
          onCancel={() => setDrawerOpen(false)}
        />
      </Drawer>
    </div>
  );
};

export default ExpenseTable;
