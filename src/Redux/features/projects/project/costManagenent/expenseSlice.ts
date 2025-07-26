import { createSlice, type PayloadAction  } from "@reduxjs/toolkit";
import type { ExpenseItem } from "../../../../../types/projectAllTypes/expense";

interface ExpenseState {
 expenseTitle: string;
  documents: ExpenseItem[];
}

const initialState: ExpenseState = {
  expenseTitle: "",
  documents: [],
};

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    setExpenseDocuments(state, action: PayloadAction<ExpenseState>) {
      state.expenseTitle = action.payload.expenseTitle;
      state.documents = action.payload.documents;
    },
  },
});

export const { setExpenseDocuments } = expenseSlice.actions;
export default expenseSlice.reducer;
