/* eslint-disable @typescript-eslint/no-explicit-any */
// types/expense.ts
export type ExpenseType = "Labour" | "Subcontractor" | "Material";

export interface ExpenseItem {
  _id: string;
  type?: ExpenseType;
  name: string;
  quantity?: number;
  unit?: string;
  unitPrice?: number;
  days?: number;
  vat?: number;
  ratePerDay?: number;
  amount?: number;
  file?: string | any;
  date?: string;
  description?: string;
}

// Sample mock data
export const initialExpenseData: ExpenseItem[] = [
  // Add more as needed
];
export interface ExpenseFormValues {
  _id?: string;
  type?: ExpenseType;
  name: string;
  quantity?: number;
  unit?: string;
  unitPrice?: number;
  days?: number;
  vat?: number;
  ratePerDay?: number;
  amount?: number;
  file?: string | any;
  date?: string;
  description?: string;
}
