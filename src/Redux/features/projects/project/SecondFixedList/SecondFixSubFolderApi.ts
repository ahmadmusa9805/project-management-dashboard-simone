/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../../../app/api/baseApi";

export const secondFixSubFolderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get All SecondFixSubFolders
    getAllSecondFixSubFolders: builder.query<any, Record<string, any> | void>({
      query: (params) => {
        const queryString = params
          ? `?${new URLSearchParams(
              params as Record<string, string>
            ).toString()}`
          : "";
        return `/sub-second-fix-folders${queryString}`;
      },
      providesTags: ["SecondFixSubFolders"],
      transformResponse: (response: {
        status: string;
        data: any[];
        meta?: any;
      }) => ({
        data: Array.isArray(response.data) ? response.data : [],
        meta: response.meta,
      }),
    }),

    // ✅ Get Single SecondFixSubFolder
    getSingleSecondFixSubFolder: builder.query<any, string>({
      query: (id) => `/sub-second-fix-folders/${id}`,
      providesTags: ["SecondFixSubFolders"],
      transformResponse: (response: { status: string; data: any }) =>
        response.data,
    }),

    // ✅ Create SecondFixSubFolder
    createSecondFixSubFolder: builder.mutation<any, any>({
      query: (data) => ({
        url: "/sub-second-fix-folders/create-sub-second-fix-folder",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SecondFixSubFolders"],
    }),

    // ✅ Update SecondFixSubFolder
    updateSecondFixSubFolder: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/sub-second-fix-folders/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SecondFixSubFolders"],
    }),

    // ✅ Delete SecondFixSubFolder
    deleteSecondFixSubFolder: builder.mutation<any, string>({
      query: (id) => ({
        url: `/sub-second-fix-folders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SecondFixSubFolders"],
    }),
  }),
});

export const {
  useGetAllSecondFixSubFoldersQuery,
  useGetSingleSecondFixSubFolderQuery,
  useCreateSecondFixSubFolderMutation,
  useUpdateSecondFixSubFolderMutation,
  useDeleteSecondFixSubFolderMutation,
} = secondFixSubFolderApi;
