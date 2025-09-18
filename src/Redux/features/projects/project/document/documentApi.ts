/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../../../app/api/baseApi";

export const documentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get All Documents
    getAllDocuments: builder.query<any, Record<string, any> | void>({
      query: (params) => {
        const queryString = params
          ? `?${new URLSearchParams(
              params as Record<string, string>
            ).toString()}`
          : "";
        return `/documents${queryString}`;
      },
      providesTags: ["Documents"],
      transformResponse: (response: {
        status: string;
        data: any[];
        meta?: any;
      }) => ({
        data: Array.isArray(response.data) ? response.data : [],
        meta: response.meta,
      }),
    }),

    // ✅ Get Single Document
    getSingleDocument: builder.query<any, string>({
      query: (id) => `/documents/${id}`,
      providesTags: ["Documents"],
      transformResponse: (response: { status: string; data: any }) =>
        response.data,
    }),

    // ✅ Create Document
    createDocument: builder.mutation<any, any>({
      query: (data) => ({
        url: "/documents/create-document",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Documents", "Notifications"],
    }),

    // ✅ Update Document
    updateDocument: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/documents/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Documents"],
    }),

    // ✅ Delete Document
    deleteDocument: builder.mutation<any, string>({
      query: (id) => ({
        url: `/documents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Documents"],
    }),
  }),
});

export const {
  useGetAllDocumentsQuery,
  useGetSingleDocumentQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
} = documentApi;
