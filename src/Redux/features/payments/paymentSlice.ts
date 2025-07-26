// store/features/payments/paymentSlice.ts
import { createSlice } from "@reduxjs/toolkit";

export interface DocumentItem {
  id: number;
  title: string;
  amount?: number;
  fileUrl?: string;
}

export interface PaymentItem {
  id: number;
  title: string;
  value: string;
  documents?: DocumentItem[]; // ✅ Add this line
}

interface PaymentState {
  payments: Record<string, PaymentItem[]>; // grouped by projectId
}

const initialState: PaymentState = {
  payments: {},
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentsForProject(state, action) {
      const { projectId, payments } = action.payload;
      state.payments[projectId] = payments;
    },
  },
});

export const { setPaymentsForProject } = paymentSlice.actions;
export default paymentSlice.reducer;
