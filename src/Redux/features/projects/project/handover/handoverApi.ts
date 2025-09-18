/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../../../app/api/baseApi";

export const handoverApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get All Handovers
    getAllHandovers: builder.query<any, Record<string, any> | void>({
      query: (params) => {
        const queryString = params
          ? `?${new URLSearchParams(
              params as Record<string, string>
            ).toString()}`
          : "";
        return `/handovers${queryString}`;
      },
      providesTags: ["Handover"],
      transformResponse: (response: {
        status: string;
        data: any[];
        meta?: any;
      }) => ({
        data: Array.isArray(response.data) ? response.data : [],
        meta: response.meta,
      }),
    }),

    // ✅ Get Single Handover
    getSingleHandover: builder.query<any, string>({
      query: (id) => `/handovers/${id}`,
      providesTags: ["Handover"],
      transformResponse: (response: { status: string; data: any }) =>
        response.data,
    }),

    // ✅ Create Handover (with file upload support)
    createHandover: builder.mutation<any, any>({
      query: (data) => {
        const formData = new FormData();

        // Append all fields to formData
        Object.keys(data).forEach((key) => {
          if (key === "file") {
            formData.append("file", data.file);
          } else {
            formData.append(key, data[key]);
          }
        });

        return {
          url: "/handovers/create-handover",
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ["Handover", "Notifications"],
    }),

    // ✅ Update Handover (with file upload support)
    updateHandover: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => {
        const formData = new FormData();

        // Append all fields to formData
        Object.keys(data).forEach((key) => {
          if (key === "file") {
            if (data.file) {
              formData.append("file", data.file);
            }
          } else {
            formData.append(key, data[key]);
          }
        });

        return {
          url: `/handovers/${id}`,
          method: "PATCH",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ["Handover"],
    }),

    // ✅ Delete Handover
    deleteHandover: builder.mutation<any, string>({
      query: (id) => ({
        url: `/handovers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Handover"],
    }),

    shareHandoverFile: builder.mutation<any, { id: string; sharedWith: any[] }>(
      {
        query: ({ id, sharedWith }) => ({
          url: `/handovers/${id}/share`,
          method: "POST",
          body: { sharedWith },
        }),
        invalidatesTags: ["Handover"],
      }
    ),

    // ✅ Unshare Certificate
    unShareHandoverFile: builder.mutation<
      any,
      { id: string; unShareWith: any[] }
    >({
      query: ({ id, unShareWith }) => ({
        url: `/handovers/${id}/unshare`,
        method: "POST",
        body: { unShareWith },
      }),
      invalidatesTags: ["Handover"],
    }),
  }),
});

export const {
  useGetAllHandoversQuery,
  useGetSingleHandoverQuery,
  useCreateHandoverMutation,
  useUpdateHandoverMutation,
  useDeleteHandoverMutation,
  useShareHandoverFileMutation,
  useUnShareHandoverFileMutation,
} = handoverApi;
