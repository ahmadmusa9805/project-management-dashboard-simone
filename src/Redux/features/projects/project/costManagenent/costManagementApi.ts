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

    // ===== Labour Expenses =====
    // ✅ Share All Labor Expenses
    shareAllLaborExpenses: builder.mutation<
      any,
      { id: string; sharedWith: any[] }
    >({
      query: ({ id, sharedWith }) => ({
        url: `/certificates/${id}/share`,
        method: "POST",
        body: { sharedWith },
      }),
      invalidatesTags: ["ProjectCosts"],
    }),

    // ✅ Unshare All Labor Expenses
    unSharAllLaborExpenses: builder.mutation<
      any,
      { id: string; unShareWith: any[] }
    >({
      query: ({ id, unShareWith }) => ({
        url: `/certificates/${id}/unshare`,
        method: "POST",
        body: { unShareWith },
      }),
      invalidatesTags: ["ProjectCosts"],
    }),

    // ===== Material Expenses =====
    shareAllMaterialExpenses: builder.mutation<
      any,
      { id: string; sharedWith: any[] }
    >({
      query: ({ id, sharedWith }) => ({
        url: `/certificates/${id}/share`,
        method: "POST",
        body: { sharedWith },
      }),
      invalidatesTags: ["ProjectCosts"],
    }),

    // ✅ Unshare All Material Expenses
    unShareAllMaterialExpenses: builder.mutation<
      any,
      { id: string; unShareWith: any[] }
    >({
      query: ({ id, unShareWith }) => ({
        url: `/certificates/${id}/unshare`,
        method: "POST",
        body: { unShareWith },
      }),
      invalidatesTags: ["ProjectCosts"],
    }),

    // ===== Subcontractor Expenses =====
    shareAllSubContractExpenses: builder.mutation<
      any,
      { id: string; sharedWith: any[] }
    >({
      query: ({ id, sharedWith }) => ({
        url: `/certificates/${id}/share`,
        method: "POST",
        body: { sharedWith },
      }),
      invalidatesTags: ["ProjectCosts"],
    }),

    // ✅ Unshare All Subcontractor Expenses
    unShareAllSubContractExpenses: builder.mutation<
      any,
      { id: string; unShareWith: any[] }
    >({
      query: ({ id, unShareWith }) => ({
        url: `/certificates/${id}/unshare`,
        method: "POST",
        body: { unShareWith },
      }),
      invalidatesTags: ["ProjectCosts"],
    }),
    shareAllExpenses: builder.mutation<any, { id: string; sharedWith: any[] }>({
      query: ({ id, sharedWith }) => ({
        url: `/certificates/${id}/share`,
        method: "POST",
        body: { sharedWith },
      }),
      invalidatesTags: ["ProjectCosts"],
    }),

    // ✅ Unshare All Expenses
    unShareAllExpenses: builder.mutation<
      any,
      { id: string; unShareWith: any[] }
    >({
      query: ({ id, unShareWith }) => ({
        url: `/certificates/${id}/unshare`,
        method: "POST",
        body: { unShareWith },
      }),
      invalidatesTags: ["ProjectCosts"],
    }),
  }),
});

export const { useGetAllExpensesQuery } = costManagementApi;
