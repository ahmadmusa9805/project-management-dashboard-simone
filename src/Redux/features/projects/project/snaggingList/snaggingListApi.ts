// src/Redux/features/projects/project/snagging/snaggingListApi.ts

import { baseApi } from "../../../../app/api/baseApi";

export const snaggingListApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ✅ Get All Snaggings
    getAllSnaggings: build.query({
      query: () => ({
        url: "/snaggings",
        method: "GET",
      }),
      providesTags: ["Snagging"],
    }),

    // ✅ Get Single Snagging by ID
    getSingleSnagging: build.query({
      query: (id: string) => ({
        url: `/snaggings/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "Snagging", id }],
    }),

    // ✅ Create Snagging (multipart with files)
    createSnagging: build.mutation({
      query: (formData: FormData) => ({
        url: "/snaggings/create-snagging",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Snagging"],
    }),

    // ✅ Update Snagging
    updateSnagging: build.mutation({
      query: ({ id, formData }: { id: string; formData: FormData }) => ({
        url: `/snaggings/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: "Snagging", id }],
    }),

    // ✅ Delete Snagging
    deleteSnagging: build.mutation({
      query: (id: string) => ({
        url: `/snaggings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Snagging"],
    }),

    // ✅ Share Snagging
    shareSnagging: build.mutation({
      query: (id: string) => ({
        url: `/snaggings/${id}/share`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, id) => [{ type: "Snagging", id }],
    }),

    // ✅ Unshare Snagging
    unShareSnagging: build.mutation({
      query: (id: string) => ({
        url: `/snaggings/${id}/unshare`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, id) => [{ type: "Snagging", id }],
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
