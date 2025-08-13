/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "../../../../app/api/baseApi";

export const subContractorExpensesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ===== Sub Contractor Expenses =====
    getAllSubContractors: builder.query<any[], Record<string, any> | undefined>(
      {
        query: (params) => {
          const queryString = new URLSearchParams(params || {}).toString();
          return `/sub-contractor-expenses?${queryString}`;
        },
        providesTags: ["SubContractorsExpenses"],
        transformResponse: (response: { success: boolean; data: any[] }) =>
          Array.isArray(response.data) ? response.data : [],
      }
    ),

    getSingleSubContractor: builder.query<any, string>({
      query: (id) => `/sub-contractor-expenses/${id}`,
      providesTags: ["SubContractorsExpenses"],
      transformResponse: (response: { success: boolean; data: any }) =>
        response.data,
    }),

    createSubContractor: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: "/sub-contractor-expenses/create-sub-contractor-expense",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["SubContractorsExpenses"],
    }),

    updateSubContractor: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => {
        return {
          url: `/sub-contractor-expenses/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["SubContractorsExpenses"],
    }),

    deleteSubContractor: builder.mutation<any, string>({
      query: (id) => ({
        url: `/sub-contractor-expenses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SubContractorsExpenses"],
    }),
  }),
});

export const {
  useGetAllSubContractorsQuery,
  useLazyGetSingleSubContractorQuery,
  useCreateSubContractorMutation,
  useUpdateSubContractorMutation,
  useDeleteSubContractorMutation,
} = subContractorExpensesApi;
