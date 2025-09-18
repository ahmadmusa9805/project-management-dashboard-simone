/* eslint-disable @typescript-eslint/no-explicit-any */
// src/Redux/features/projects/project/snagging/snaggingListApi.ts

import { baseApi } from "../../../../app/api/baseApi";

export const snaggingListApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get All Snaggings
    getAllSnaggings: builder.query<any, Record<string, any> | void>({
      query: (params) => {
        const queryString = params
          ? `?${new URLSearchParams(
              params as Record<string, string>
            ).toString()}`
          : "";
        return `/snaggings${queryString}`;
      },
      providesTags: ["Snagging"],
      transformResponse: (response: {
        status: string;
        data: any[];
        meta?: any;
      }) => {
        return {
          data: Array.isArray(response.data) ? response.data : [],
          meta: response.meta,
        };
      },
    }),

    // ✅ Get Single Snagging by ID
    getSingleSnagging: builder.query<any, string>({
      query: (id) => `/snaggings/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Snagging", id }],
      transformResponse: (response: { status: string; data: any }) =>
        response.data,
    }),

    // ✅ Create Snagging (multipart with files)
    createSnagging: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: "/snaggings/create-snagging",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Snagging", "Notifications"],
    }),

    // ✅ Update Snagging
    updateSnagging: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => {
        return {
          url: `/snaggings/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: (_res, _err, { id }) => [{ type: "Snagging", id }],
    }),

    // ✅ Delete Snagging
    deleteSnagging: builder.mutation<any, string>({
      query: (id) => ({
        url: `/snaggings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Snagging"],
    }),

    // ✅ Share Snagging (updated to match certificate pattern)
    shareSnagging: builder.mutation<any, { id: string; sharedWith: any[] }>({
      query: ({ id, sharedWith }) => ({
        url: `/snaggings/${id}/share`,
        method: "POST",
        body: { sharedWith },
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: "Snagging", id }],
    }),

    // ✅ Unshare Snagging (updated to match certificate pattern)
    unShareSnagging: builder.mutation<any, { id: string; unShareWith: any[] }>({
      query: ({ id, unShareWith }) => ({
        url: `/snaggings/${id}/unshare`,
        method: "POST",
        body: { unShareWith },
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: "Snagging", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllSnaggingsQuery,
  useGetSingleSnaggingQuery,
  useCreateSnaggingMutation,
  useUpdateSnaggingMutation,
  useDeleteSnaggingMutation,
  useShareSnaggingMutation,
  useUnShareSnaggingMutation,
} = snaggingListApi;
