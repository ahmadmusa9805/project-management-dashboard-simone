/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../../../app/api/baseApi";

export const documentFileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get All Document Files
    getAllDocumentFiles: builder.query<any, Record<string, any> | void>({
      query: (params) => {
        const queryString = params
          ? `?${new URLSearchParams(
              params as Record<string, string>
            ).toString()}`
          : "";
        return `/document-files${queryString}`;
      },
      providesTags: ["DocumentFiles"],
      transformResponse: (response: {
        status: string;
        data: any[];
        meta?: any;
      }) => ({
        data: Array.isArray(response.data) ? response.data : [],
        meta: response.meta,
      }),
    }),

    // ✅ Get Single Document File
    getSingleDocumentFile: builder.query<any, string>({
      query: (id) => `/document-files/${id}`,
      providesTags: ["DocumentFiles"],
      transformResponse: (response: { status: string; data: any }) =>
        response.data,
    }),

    // ✅ Create Document File (Fixed to match certificate pattern)
    createDocumentFile: builder.mutation<any, any>({
      query: (data) => {
        const formData = new FormData();

        // Append file if exists
        if (data.file) {
          formData.append("file", data.file);
        }
        console.log(data.title);
        // Create the data object exactly as backend expects
        const requestData = {
          title: data.title,
          documentSubFolderId: data.documentSubFolderId,
          projectId: data.projectId,
        };

        // Stringify and append as "data" field (same as certificate API)
        formData.append("data", JSON.stringify(requestData));

        return {
          url: "/document-files/create-document-file",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["DocumentFiles", "Notifications"],
    }),

    // ✅ Update Document File
    updateDocumentFile: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => {
        const formData = new FormData();
        if (data.file) {
          formData.append("file", data.file);
        }
        formData.append(
          "data",
          JSON.stringify({
            title: data.title,
            documentSubFolderId: data.documentSubFolderId,
            projectId: data.projectId,
          })
        );
        return {
          url: `/document-files/${id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["DocumentFiles"],
    }),

    // ✅ Delete Document File
    deleteDocumentFile: builder.mutation<any, string>({
      query: (id) => ({
        url: `/document-files/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DocumentFiles"],
    }),

    // ✅ Share Document File
    shareDocumentFile: builder.mutation<any, { id: string; sharedWith: any[] }>(
      {
        query: ({ id, sharedWith }) => ({
          url: `/document-files/${id}/share`,
          method: "POST",
          body: { sharedWith },
        }),
        invalidatesTags: ["DocumentFiles"],
      }
    ),

    // ✅ Unshare Document File
    unShareDocumentFile: builder.mutation<
      any,
      { id: string; unShareWith: any[] }
    >({
      query: ({ id, unShareWith }) => ({
        url: `/document-files/${id}/unshare`,
        method: "POST",
        body: { unShareWith },
      }),
      invalidatesTags: ["DocumentFiles"],
    }),
  }),
});

export const {
  useGetAllDocumentFilesQuery,
  useGetSingleDocumentFileQuery,
  useCreateDocumentFileMutation,
  useUpdateDocumentFileMutation,
  useDeleteDocumentFileMutation,
  useShareDocumentFileMutation,
  useUnShareDocumentFileMutation,
} = documentFileApi;
