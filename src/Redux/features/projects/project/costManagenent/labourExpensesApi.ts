/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "../../../../app/api/baseApi";

export const labourExpensesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ===== Labour Expenses =====
    getAllLabourExpenses: builder.query<any[], Record<string, any> | undefined>(
      {
        query: (params) => {
          const queryString = new URLSearchParams(params || {}).toString();
          return `/labour-expenses?${queryString}`;
        },
        providesTags: ["LabourExpenses"],
        transformResponse: (response: { success: boolean; data: any[] }) =>
          Array.isArray(response.data) ? response.data : [],
      }
    ),

    getSingleLabourExpense: builder.query<any, string>({
      query: (id) => `/labour-expenses/${id}`,
      providesTags: ["LabourExpenses"],
      transformResponse: (response: { success: boolean; data: any }) =>
        response.data,
    }),

    createLabourExpense: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: "/labour-expenses/create-labour-expense",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [
        "LabourExpenses",
        "ProjectCosts",
        "PaymentTrackers",
        "Notifications",
      ],
    }),

    updateLabourExpense: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => {
        return {
          url: `/labour-expenses/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["LabourExpenses", "ProjectCosts", "PaymentTrackers"],
    }),

    deleteLabourExpense: builder.mutation<any, string>({
      query: (id) => ({
        url: `/labour-expenses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LabourExpenses", "ProjectCosts", "PaymentTrackers"],
    }),
  }),
});

export const {
  // Labour
  useGetAllLabourExpensesQuery,
  useLazyGetSingleLabourExpenseQuery,
  useCreateLabourExpenseMutation,
  useUpdateLabourExpenseMutation,
  useDeleteLabourExpenseMutation,
} = labourExpensesApi;
