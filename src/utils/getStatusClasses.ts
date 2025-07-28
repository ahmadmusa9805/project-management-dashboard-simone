import type { StatusType } from "../types/userAllTypes/user";

// Utility function
const getStatusClasses = (status: StatusType) => {
  switch (status) {
    case "Active":
      return "text-green-700 bg-green-100";
    case "Disable":
      return "text-gray-700 bg-gray-100";
    case "Suspended":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-700 bg-gray-100";
  }
};
export default getStatusClasses;
