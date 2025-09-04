/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../../../app/api/baseApi";

export const interimApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all Interims
    getAllInterims: builder.query<any[], Record<string, any> | undefined>({
      query: (params) => {
        const queryString = new URLSearchParams(params || {}).toString();
        return `/interims?${queryString}`;
      },
      providesTags: ["Interims"],
      transformResponse: (response: { success: boolean; data: any[] }) =>
        Array.isArray(response.data) ? response.data : [],
    }),

    // Get single Interim
    getSingleInterim: builder.query<any, string>({
      query: (id) => `/interims/${id}`,
      providesTags: ["Interims"],
      transformResponse: (response: { success: boolean; data: any }) =>
        response.data,
    }),

    // Create Interim
    createInterim: builder.mutation<any, any>({
      query: (data) => {
        const formData = new FormData();
        if (data.file) {
          formData.append("file", data.file);
        }
        formData.append(
          "data",
          JSON.stringify({
            title: data.title,
            projectId: data.projectId,
            value: Number(data.value),
            status: data.status || "pending",
          })
        );
        return {
          url: "/interims/create-interim",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Interims"],
    }),

    // Update Interim
    updateInterim: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => {
        console.log(id, data);
        const formData = new FormData();
        if (data.file) {
          formData.append("file", data.file);
        }
        formData.append(
          "data",
          JSON.stringify({
            title: data.title,
            projectId: data.projectId,
            value: Number(data.value),
            status: data.status,
          })
        );
        return {
          url: `/interims/${id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["Interims"],
    }),

    // Delete Interim
    deleteInterim: builder.mutation<any, string>({
      query: (id) => ({
        url: `/interims/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Interims"],
    }),

    // Share Interim
    shareInterim: builder.mutation<any, { id: string; sharedWith: any[] }>({
      query: ({ id, sharedWith }) => ({
        url: `/interims/${id}/share`,
        method: "POST",
        body: { sharedWith },
      }),
      invalidatesTags: ["Interims"],
    }),

    // Unshare Interim
    unShareInterim: builder.mutation<any, { id: string; unShareWith: any[] }>({
      query: ({ id, unShareWith }) => ({
        url: `/interims/${id}/unshare`,
        method: "POST",
        body: { unShareWith },
      }),
      invalidatesTags: ["Interims"],
    }),
  }),
});

export const {
  useGetAllInterimsQuery,
  useGetSingleInterimQuery,
  useCreateInterimMutation,
  useUpdateInterimMutation,
  useDeleteInterimMutation,
  useShareInterimMutation,
  useUnShareInterimMutation,
} = interimApi;
