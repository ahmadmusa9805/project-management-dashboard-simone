/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "../../../../app/api/baseApi";

export const costManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ===== All Expenses =====
    getAllExpenses: builder.query<any[], Record<string, any> | undefined>({
      query: (params) => {
        const queryString = new URLSearchParams(params || {}).toString();
        return `/live-project-costs/get-all-type-costs?${queryString}`;
      },
      providesTags: ["ProjectCosts"],
      transformResponse: (response: { success: boolean; data: any[] }) =>
        Array.isArray(response.data) ? response.data : [],
    }),
  }),
});

export const { useGetAllExpensesQuery } = costManagementApi;
