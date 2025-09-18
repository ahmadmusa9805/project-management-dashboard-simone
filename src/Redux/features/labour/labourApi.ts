/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/labour/labourApi.ts
import { baseApi } from "../../app/api/baseApi";

export const labourApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all labours
    getAllLabours: builder.query<any, void>({
      query: () => `/labours`,
      transformResponse: (response: any) => response,
      providesTags: ["Labours"],
    }),

    // ✅ Get single labour by ID
    getLabourById: builder.query<any, string>({
      query: (id) => `/labours/${id}`,
      transformResponse: (res: any) => res.data,
      providesTags: (_result, _error, id) => [{ type: "Labours", id }],
    }),

    // ✅ Create labour (with FormData)
    createLabour: builder.mutation({
      query: (formData: FormData) => ({
        url: `/labours/create-labour`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Labours", "Notifications", "Users"],
    }),

    // ✅ Update labour (with FormData)
    updateLabour: builder.mutation({
      query: ({ id, body }: { id: string; body: FormData }) => ({
        url: `/labours/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Labours",
        "Notifications",
        { type: "Labours", id },
      ],
    }),

    // ✅ Delete labour
    deleteLabour: builder.mutation({
      query: (id: string) => ({
        url: `/labours/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Labours", "Notifications"],
    }),
  }),
});

export const {
  useGetAllLaboursQuery,
  useGetLabourByIdQuery,
  useCreateLabourMutation,
  useUpdateLabourMutation,
  useDeleteLabourMutation,
} = labourApi;
