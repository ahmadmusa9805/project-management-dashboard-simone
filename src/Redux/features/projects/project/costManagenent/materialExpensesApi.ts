/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "../../../../app/api/baseApi";

export const materialExpensesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ===== Material Expenses =====
    getAllMaterialExpenses: builder.query<
      any[],
      Record<string, any> | undefined
    >({
      query: (params) => {
        const queryString = new URLSearchParams(params || {}).toString();
        return `/material-expenses?${queryString}`;
      },
      providesTags: ["MaterialExpenses"],
      transformResponse: (response: { success: boolean; data: any[] }) =>
        Array.isArray(response.data) ? response.data : [],
    }),

    getSingleMaterialExpense: builder.query<any, string>({
      query: (id) => `/material-expenses/${id}`,
      providesTags: ["MaterialExpenses"],
      transformResponse: (response: { success: boolean; data: any }) =>
        response.data,
    }),

    createMaterialExpense: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: "/material-expenses/create-material-expense",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["MaterialExpenses", "ProjectCosts", "PaymentTrackers"],
    }),

    updateMaterialExpense: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => {
        return {
          url: `/material-expenses/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["MaterialExpenses", "ProjectCosts", "PaymentTrackers"],
    }),

    deleteMaterialExpense: builder.mutation<any, string>({
      query: (id) => ({
        url: `/material-expenses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MaterialExpenses", "ProjectCosts", "PaymentTrackers"],
    }),
  }),
});

export const {
  // Material
  useGetAllMaterialExpensesQuery,
  useLazyGetSingleMaterialExpenseQuery,
  useCreateMaterialExpenseMutation,
  useUpdateMaterialExpenseMutation,
  useDeleteMaterialExpenseMutation,
} = materialExpensesApi;
