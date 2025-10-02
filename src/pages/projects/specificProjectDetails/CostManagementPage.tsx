// import { useNavigate, useParams } from "react-router-dom";
// import CustomSearchInput from "../../../components/CustomSearchInput";
// import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
// import { expenseFullMockData } from "../../../data/mockCostData";

// const CostManagementPage = () => {
//   const navigate = useNavigate();
//   const { projectId } = useParams();
//   console.log("projectId: ", projectId);
//   const documents = expenseFullMockData;

//   const calculateTotal = (type: "Labor" | "Subcontractor" | "Material") => {
//     return documents[type].reduce((total, item) => total + item.cost, 0);
//   };

//   const totalLabor = calculateTotal("Labor");
//   const totalSubcontractor = calculateTotal("Subcontractor");
//   const totalMaterial = calculateTotal("Material");
//   const totalProject = totalLabor + totalSubcontractor + totalMaterial;

//   const handleViewCost = (type: "Labor" | "Subcontractor" | "Material") => {
//     navigate(`/projects/${projectId}/expense-documents`, {
//       state: {
//         quoteTitle: `${type} Expense List`,
//         documents: expenseFullMockData[type],
//       },
//     });
//   };

//   return (
//     <div className="w-full h-full">
//       {/* Header */}
//       <div className="flex justify-between">
//         <h1 className="text-2xl font-semibold mb-4">Manage Cost Management</h1>
//         <CustomSearchInput onSearch={() => {}} />
//       </div>

//       {/* Cost Cards */}

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
//         <div className="p-4 bg-gray-100 border border-gray-300 rounded w-80 flex flex-col gap-4  hover:bg-gray-200 transition">
//           <div className="flex justify-between items-start w-full">
//             <h3 className="text-lg font-medium text-gray-900 truncate">
//               Total Material Expense
//             </h3>
//             <CustomViewMoreButton
//               items={[
//                 { key: "view Cost", label: "View Cost List" },
//                 { key: "share", label: "Share Cost" },
//               ]}
//               onClick={(key) => {
//                 if (key === "view Cost") handleViewCost("Material");
//               }}
//             />
//           </div>
//           <p className="text-lg font-medium text-gray-900">
//             Value $ : {totalMaterial}
//           </p>
//         </div>
//         <div className="p-4 bg-gray-100 border border-gray-300 rounded w-80 flex flex-col gap-4 cursor-pointer hover:bg-gray-200 transition">
//           <div className="flex justify-between items-start w-full">
//             <h3 className="text-lg font-medium text-gray-900  truncate">
//               Total Labor Expense
//             </h3>
//             <CustomViewMoreButton
//               items={[
//                 { key: "view Cost", label: "View Cost List" },
//                 { key: "share", label: "Share Cost" },
//               ]}
//               onClick={(key) => {
//                 if (key === "view Cost") handleViewCost("Labor");
//               }}
//             />
//           </div>
//           <p className="text-lg font-medium text-gray-900">
//             value $ : {totalLabor}
//           </p>
//         </div>
//         <div className="p-4 bg-gray-100 border border-gray-300 rounded w-80 flex flex-col gap-4 cursor-pointer hover:bg-gray-200 transition">
//           <div className="flex justify-between items-start w-full">
//             <h3 className="text-lg font-medium text-gray-900  truncate">
//               Total Sub Contractors Expenses
//             </h3>
//             <CustomViewMoreButton
//               items={[
//                 { key: "view Cost", label: "View Cost List" },
//                 { key: "share", label: "Share Cost" },
//               ]}
//               onClick={(key) => {
//                 if (key === "view Cost") handleViewCost("Subcontractor");
//               }}
//             />
//           </div>
//           <p className="text-lg font-medium text-gray-900">
//             value $ : {totalSubcontractor}
//           </p>
//         </div>
//         <div className="p-4 bg-gray-100 border border-gray-300 rounded w-80 flex flex-col gap-4 cursor-pointer hover:bg-gray-200 transition">
//           <div className="flex justify-between items-start w-full">
//             <h3 className="text-lg font-medium text-gray-900 w-36 truncate">
//               Total Project Cost
//             </h3>
//             <CustomViewMoreButton
//               items={[
//                 { key: "view Cost", label: "View Cost List" },
//                 { key: "share", label: "Share Cost" },
//               ]}
//               onClick={(key) => {
//                 switch (key) {
//                   case "view Cost List":
//                     break;
//                   case "share":
//                     console.log("Share");
//                     break;
//                 }
//               }}
//             />
//           </div>
//           <p className="text-lg font-medium text-gray-900">
//             value $ : {totalProject}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default CostManagementPage;

//TODO: after ckecked bellow delete
// import { useNavigate, useParams } from "react-router-dom";
// import CustomSearchInput from "../../../components/CustomSearchInput";
// import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
// import { useGetAllExpensesQuery } from "../../../Redux/features/projects/project/costManagenent/costManagementApi";

// const CostManagementPage = () => {
//   const navigate = useNavigate();
//   const { projectId } = useParams();

//   // Fetch expenses for the projectId
//   const {
//     data: response,
//     isLoading,
//     isError,
//   } = useGetAllExpensesQuery({ projectId });

//   if (isLoading) {
//     return <div>Loading cost data...</div>;
//   }
//   if (isError || !response) {
//     return <div>Error loading cost data. Please try again later.</div>;
//   }

//   // Extract the expenses array from the response data
//   const expensesArray = response || [];

//   // Helper to get amount by expense name (case insensitive)
//   const getAmountByName = (name: string) => {
//     const normalizedName = name.trim().toLowerCase();
//     const item = expensesArray.find(
//       (exp: { name: string }) =>
//         exp.name.trim().toLowerCase() === normalizedName
//     );
//     return item ? item.amount : 0;
//   };

//   const totalLabor = getAmountByName("Labour");
//   const totalMaterial = getAmountByName("Material");
//   const totalSubcontractor = getAmountByName("SubContractor");
//   const totalProject = getAmountByName("Total");

//   const handleViewCost = (type: string) => {
//     // You might want to fetch or pass detailed documents here
//     // For now, just navigate with the type name
//     navigate(`/projects/${projectId}/expense-documents`, {
//       state: {
//         quoteTitle: `${type} Expense List`,
//         documents: [],
//         expenseType: type,
//         projectId: projectId, // Replace with actual docs if available
//       },
//     });
//   };

//   return (
//     <div className="w-full bg-white h-full p-6 min-h-screen">
//       {/* Header */}
//       <div className="flex justify-between">
//         <h1 className="text-2xl font-semibold mb-4">Manage Cost Management</h1>
//         <CustomSearchInput onSearch={() => {}} />
//       </div>

//       {/* Cost Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//         {[
//           { label: "Material", value: totalMaterial },
//           { label: "Labour", value: totalLabor },
//           { label: "Subcontractor", value: totalSubcontractor },
//         ].map(({ label, value }) => (
//           <div
//             key={label}
//             className="p-6 bg-gray-100 rounded shadow flex flex-col justify-between"
//           >
//             <div className="flex justify-between items-start w-full">
//               <h3 className="text-lg font-medium text-gray-900 truncate">
//                 {`Total ${label} Expense${
//                   label === "Subcontractor" ? "s" : ""
//                 }`}
//               </h3>
//               <CustomViewMoreButton
//                 items={[
//                   { key: "view Cost", label: "👁️ View Cost" },

//                   // { key: "share", label: "🔗 Share Cost" },
//                   // { key: "unshare", label: "🚫 Unshare Cost" },
//                 ]}
//                 onClick={(key) => {
//                   if (key === "view Cost") handleViewCost(label);
//                   // if (key === "share") {
//                   //   console.log(`Share ${label} cost clicked`);
//                   // }
//                 }}
//               />
//             </div>
//             <p className="text-lg font-medium text-gray-900">
//               Value $ : {value}
//             </p>
//           </div>
//         ))}

//         <div className="p-6 bg-gray-100 rounded shadow flex flex-col justify-between">
//           <div className="flex justify-between items-start w-full">
//             <h3 className="text-lg font-medium text-gray-900 w-36 truncate">
//               Total Project Cost
//             </h3>
//             {/* <CustomViewMoreButton
//               items={[
//                 { key: "share", label: "🔗 Share Total Cost" },
//                 { key: "unshare", label: "🚫 Unshare Total Cost" },
//               ]}
//               onClick={(key) => {
//                 switch (key) {
//                   case "view Cost List":
//                     // Implement if needed
//                     break;
//                   case "share":
//                     console.log("Share total project cost");
//                     break;
//                 }
//               }}
//             /> */}
//           </div>
//           <p className="text-lg font-medium text-gray-900">
//             Value $ : {totalProject}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CostManagementPage;
import { useNavigate, useParams } from "react-router-dom";
import { Card, Col, Row, Spin, Statistic } from "antd"; // ← Import Spin here

import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
import { useGetAllExpensesQuery } from "../../../Redux/features/projects/project/costManagenent/costManagementApi";

const CostManagementPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  // Fetch expenses for the projectId
  const {
    data: response,
    isLoading,
    isError,
  } = useGetAllExpensesQuery(
    { projectId },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  // Extract the expenses array from the response data
  const expensesArray = response || [];

  // Helper to get amount by expense name (case insensitive)
  const getAmountByName = (name: string) => {
    const normalizedName = name.trim().toLowerCase();
    const item = expensesArray.find(
      (exp: { name: string }) =>
        exp.name.trim().toLowerCase() === normalizedName
    );
    return item ? item.amount : 0;
  };

  const totalLabor = getAmountByName("Labour");
  const totalMaterial = getAmountByName("Material");
  const totalSubcontractor = getAmountByName("SubContractor");
  const totalProject = getAmountByName("Total");

  const handleViewCost = (type: string) => {
    navigate(`/projects/${projectId}/expense-documents`, {
      state: {
        quoteTitle: `${type} Expense List`,
        documents: [],
        expenseType: type,
        projectId: projectId,
      },
    });
  };

  return (
    <div className="w-full bg-white h-full p-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between py-10">
        <h1 className="text-2xl font-semibold ">Project Cost</h1>
        {/* <CustomSearchInput onSearch={() => {}} /> */}
      </div>

      {/* Loading spinner */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : isError || !response ? (
        <div>Error loading cost data. Please try again later.</div>
      ) : (
        // Cost Cards
        <Row gutter={[16, 16]}>
          {[
            { label: "Material", value: totalMaterial },
            { label: "Labour", value: totalLabor },
            { label: "Subcontractor", value: totalSubcontractor },
          ].map(({ label, value }) => (
            <Col span={6} key={label}>
              <Card
                style={{ backgroundColor: "#f1f1f1" }}
                hoverable
                bodyStyle={{
                  backgroundColor: "#f1f1f1",
                  padding: "12px 24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
                onClick={() => handleViewCost(label)}
                title={
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {`${label} Expense${label === "Subcontractor" ? "s" : ""}`}
                  </h3>
                }
                extra={
                  <CustomViewMoreButton
                    items={[{ key: "view Cost", label: "👁️ View Cost" }]}
                    onClick={(key) => {
                      if (key === "view Cost") handleViewCost(label);
                    }}
                  />
                }
              >
                <div className="flex items-center justify-between w-full">
                  <Statistic
                    value={value}
                    prefix="$"
                    className="text-lg font-medium text-gray-900"
                  />
                  {/* <p className="font-semibold flex items-center text-green-700">
                    ✅ Recorded
                  </p> */}
                </div>
              </Card>
            </Col>
          ))}

          {/* Total Project Card */}
          <Col span={6}>
            <Card
              style={{ backgroundColor: "#f1f1f1" }}
              bodyStyle={{
                backgroundColor: "#f1f1f1",
                padding: "12px 24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
              title={
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  Total Project Cost
                </h3>
              }
            >
              <div className="flex items-center justify-between w-full">
                <Statistic
                  value={totalProject}
                  prefix="$"
                  className="text-lg font-medium text-gray-900"
                />
                <p className="font-semibold flex items-center text-blue-700">
                  📊 Summary
                </p>
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default CostManagementPage;
