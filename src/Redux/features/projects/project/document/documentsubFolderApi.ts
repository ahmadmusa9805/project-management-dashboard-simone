/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../../../app/api/baseApi";

export const documentSubFolderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get All Subfolders
    getAllDocumentSubfolders: builder.query<any, Record<string, any> | void>({
      query: (params) => {
        const queryString = params
          ? `?${new URLSearchParams(
              params as Record<string, string>
            ).toString()}`
          : "";
        return `/sub-documents${queryString}`;
      },
      providesTags: ["DocumentSubfolders"],
      transformResponse: (response: {
        status: string;
        data: any[];
        meta?: any;
      }) => ({
        data: Array.isArray(response.data) ? response.data : [],
        meta: response.meta,
      }),
    }),

    // ✅ Get Single Subfolder
    getSingleDocumentSubfolder: builder.query<any, string>({
      query: (id) => `/sub-documents/${id}`,
      providesTags: ["DocumentSubfolders"],
      transformResponse: (response: { status: string; data: any }) =>
        response.data,
    }),

    // ✅ Create Subfolder
    createDocumentSubfolder: builder.mutation<any, any>({
      query: (data) => ({
        url: "/sub-documents/create-sub-document",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["DocumentSubfolders", "Notifications"],
    }),

    // ✅ Update Subfolder
    updateDocumentSubfolder: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/sub-documents/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["DocumentSubfolders"],
    }),

    // ✅ Delete Subfolder
    deleteDocumentSubfolder: builder.mutation<any, string>({
      query: (id) => ({
        url: `/sub-documents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DocumentSubfolders"],
    }),
  }),
});

export const {
  useGetAllDocumentSubfoldersQuery,
  useGetSingleDocumentSubfolderQuery,
  useCreateDocumentSubfolderMutation,
  useUpdateDocumentSubfolderMutation,
  useDeleteDocumentSubfolderMutation,
} = documentSubFolderApi;
