import { useNavigate, useParams } from "react-router-dom";
import CustomSearchInput from "../../../components/CustomSearchInput";
import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
import { expenseFullMockData} from "../../../data/mockCostData";

const CostManagementPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  console.log("projectId: ", projectId);
   const documents = expenseFullMockData; 

  const calculateTotal = (type: "Labor" | "Subcontractor" | "Material") => {
    return documents[type].reduce((total, item) => total + item.cost, 0);
  };

  const totalLabor = calculateTotal("Labor");
  const totalSubcontractor = calculateTotal("Subcontractor");
  const totalMaterial = calculateTotal("Material");
  const totalProject = totalLabor + totalSubcontractor + totalMaterial;

 
const handleViewCost = (type: "Labor" | "Subcontractor" | "Material") => {
  navigate(`/projects/${projectId}/expense-documents`, {
    state: {
      quoteTitle: `${type} Expense List`,
      documents: expenseFullMockData[type],
    },
  });
};

  return (
    <div className="w-full h-full">
      {/* Header */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold mb-4">Manage Cost Management</h1>
        <CustomSearchInput onSearch={() => {}} />
      </div>

      {/* Cost Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
        <div className="p-4 bg-gray-100 border border-gray-300 rounded w-80 flex flex-col gap-4  hover:bg-gray-200 transition">
          <div className="flex justify-between items-start w-full">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              Total Material Expense
            </h3>
            <CustomViewMoreButton
              items={[
                { key: "view Cost", label: "View Cost List" },
                { key: "share", label: "Share Cost" },
              ]}
              onClick={(key) => {
                if (key === "view Cost") handleViewCost("Material");
              }}
            />
          </div>
          <p className="text-lg font-medium text-gray-900">
            Value $ : {totalMaterial}
          </p>
        </div>
        <div className="p-4 bg-gray-100 border border-gray-300 rounded w-80 flex flex-col gap-4 cursor-pointer hover:bg-gray-200 transition">
          <div className="flex justify-between items-start w-full">
            <h3 className="text-lg font-medium text-gray-900  truncate">
              Total Labor Expense
            </h3>
            <CustomViewMoreButton
              items={[
                { key: "view Cost", label: "View Cost List" },
                { key: "share", label: "Share Cost" },
              ]}
              onClick={(key) => {
                if (key === "view Cost") handleViewCost("Labor");
              }}
            />
          </div>
          <p className="text-lg font-medium text-gray-900">
            value $ : {totalLabor}
          </p>
        </div>
        <div className="p-4 bg-gray-100 border border-gray-300 rounded w-80 flex flex-col gap-4 cursor-pointer hover:bg-gray-200 transition">
          <div className="flex justify-between items-start w-full">
            <h3 className="text-lg font-medium text-gray-900  truncate">
              Total Sub Contractors Expenses
            </h3>
            <CustomViewMoreButton
              items={[
                { key: "view Cost", label: "View Cost List" },
                { key: "share", label: "Share Cost" },
              ]}
              onClick={(key) => {
                if (key === "view Cost") handleViewCost("Subcontractor");
              }}
            />
          </div>
          <p className="text-lg font-medium text-gray-900">
            value $ : {totalSubcontractor}
          </p>
        </div>
        <div className="p-4 bg-gray-100 border border-gray-300 rounded w-80 flex flex-col gap-4 cursor-pointer hover:bg-gray-200 transition">
          <div className="flex justify-between items-start w-full">
            <h3 className="text-lg font-medium text-gray-900 w-36 truncate">
              Total Project Cost
            </h3>
            <CustomViewMoreButton
              items={[
                { key: "view Cost", label: "View Cost List" },
                { key: "share", label: "Share Cost" },
              ]}
              onClick={(key) => {
                switch (key) {
                  case "view Cost List":
                    break;
                  case "share":
                    console.log("Share");
                    break;
                }
              }}
            />
          </div>
          <p className="text-lg font-medium text-gray-900">
            value $ : {totalProject}
          </p>
        </div>
      </div>
    </div>
  );
};
export default CostManagementPage;
