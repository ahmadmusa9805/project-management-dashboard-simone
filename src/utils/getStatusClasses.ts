import type { StatusType } from "../types/userAllTypes/user";

// Utility function
const getStatusClasses = (status: StatusType) => {
  switch (status) {
    case "active":
      return "text-green-700 bg-green-100";
    case "blocked":
      return "text-red-600 bg-red-100"
  }
};
export default getStatusClasses;
