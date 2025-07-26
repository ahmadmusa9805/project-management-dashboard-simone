// types/expense.ts
export type ExpenseType = 'Labor' | 'Subcontractor' | 'Material';

export interface ExpenseItem {
  id: number;
  type?: ExpenseType;
  name: string;
  quantity: number;
  cost: number;
  vatRate: number;
  includesVat: boolean;
  date: string;
  time: string;
  description: string;
  files: File[] | any[];
}

// Sample mock data
export const initialExpenseData: ExpenseItem[] = [
  {
    id: 1,
    type: 'Labor',
    name: 'John Doe',
    quantity: 10,
    cost: 1000,
    vatRate: 5,
    includesVat: true,
    date: '2023-07-20',
    time: '09:00',
    description: 'Labor charge',
    files: [],
  },
  {
    id: 2,
    type: 'Material',
    name: 'Cement',
    quantity: 50,
    cost: 2000,
    vatRate: 10,
    includesVat: false,
    date: '2023-07-21',
    time: '10:00',
    description: 'Material purchase',
    files: [],
  },
  // Add more as needed
];
