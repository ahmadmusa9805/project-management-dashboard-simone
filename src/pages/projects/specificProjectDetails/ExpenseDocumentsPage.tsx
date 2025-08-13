import { useLocation, useNavigate } from "react-router-dom";
import type {
  ExpenseItem,
  ExpenseType,
} from "../../../types/projectAllTypes/expense";
import ExpenseTable from "../../../components/ExpenseTable";

import { useGetAllLabourExpensesQuery } from "../../../Redux/features/projects/project/costManagenent/labourExpensesApi";
import { useGetAllMaterialExpensesQuery } from "../../../Redux/features/projects/project/costManagenent/materialExpensesApi";
import { useGetAllSubContractorsQuery } from "../../../Redux/features/projects/project/costManagenent/subContractorExpensesApi";

const ExpenseDocumentsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as {
    quoteTitle: string;
    documents?: ExpenseItem[];
    expenseType: string;
    projectId: string;
  };

  // const { quoteTitle, expenseType, projectId } = state;
  const { quoteTitle, expenseType } = state;

  // Queries
  const subcontractorRes = useGetAllSubContractorsQuery(undefined);
  const labourRes = useGetAllLabourExpensesQuery(undefined);
  const materialRes = useGetAllMaterialExpensesQuery(undefined);
  // const subcontractorRes = useGetAllSubContractorsQuery({ projectId });
  // const labourRes = useGetAllLabourExpensesQuery({ projectId });
  // const materialRes = useGetAllMaterialExpensesQuery({ projectId });

  let expenses: ExpenseItem[] = [];
  let isLoading = false;
  let isError = false;
  let refetchFn: (() => void) | undefined;

  switch (expenseType) {
    case "Labour":
      expenses = labourRes.data || [];
      isLoading = labourRes.isLoading;
      isError = labourRes.isError;
      refetchFn = labourRes.refetch;
      break;
    case "Material":
      expenses = materialRes.data || [];
      isLoading = materialRes.isLoading;
      isError = materialRes.isError;
      refetchFn = materialRes.refetch;
      break;
    case "Subcontractor":
      expenses = subcontractorRes.data || [];
      isLoading = subcontractorRes.isLoading;
      isError = subcontractorRes.isError;
      refetchFn = subcontractorRes.refetch;
      break;
  }
  if (!state) {
    return <div className="p-4 text-red-600">No expense data found.</div>;
  }
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading expenses.</div>;

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
        title={expenseType as ExpenseType}
        expenses={expenses.map((item) => ({
          ...item,
        }))}
        isLoading={isLoading}
        refetch={refetchFn}
      />
    </div>
  );
};

export default ExpenseDocumentsPage;
