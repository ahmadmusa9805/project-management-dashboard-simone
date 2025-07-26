// pages/ExpenseDocumentsPage.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import type { ExpenseItem } from '../../../types/projectAllTypes/expense';
import ExpenseTable from '../../../components/ExpenseTable';


const ExpenseDocumentsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as {
    quoteTitle: string;
    documents: ExpenseItem[];
  };

  if (!state) {
    return <div className="p-4 text-red-600">No expense data found.</div>;
  }

  const { quoteTitle, documents } = state;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{quoteTitle}</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>

      <ExpenseTable
        
        data={documents.map((item, index) => ({ ...item, id: index + 1 }))}
        
      />
    </div>
  );
};

export default ExpenseDocumentsPage;
