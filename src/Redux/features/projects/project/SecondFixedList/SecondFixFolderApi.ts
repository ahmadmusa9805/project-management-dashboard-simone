/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../../../app/api/baseApi";

export const secondFixFolderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get All SecondFixFolders
    getAllSecondFixFolders: builder.query<any, Record<string, any> | void>({
      query: (params) => {
        const queryString = params
          ? `?${new URLSearchParams(
              params as Record<string, string>
            ).toString()}`
          : "";
        return `/second-fix-folders${queryString}`;
      },
      providesTags: ["SecondFixFolders"],
      transformResponse: (response: {
        status: string;
        data: any[];
        meta?: any;
      }) => ({
        data: Array.isArray(response.data) ? response.data : [],
        meta: response.meta,
      }),
    }),

    // ✅ Get Single SecondFixFolder
    getSingleSecondFixFolder: builder.query<any, string>({
      query: (id) => `/second-fix-folders/${id}`,
      providesTags: ["SecondFixFolders"],
      transformResponse: (response: { status: string; data: any }) =>
        response.data,
    }),

    // ✅ Create SecondFixFolder
    createSecondFixFolder: builder.mutation<any, any>({
      query: (data) => ({
        url: "/second-fix-folders/create-second-fix-folder",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SecondFixFolders"],
    }),

    // ✅ Update SecondFixFolder
    updateSecondFixFolder: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/second-fix-folders/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SecondFixFolders"],
    }),

    // ✅ Delete SecondFixFolder
    deleteSecondFixFolder: builder.mutation<any, string>({
      query: (id) => ({
        url: `/second-fix-folders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SecondFixFolders"],
    }),
  }),
});

export const {
  useGetAllSecondFixFoldersQuery,
  useGetSingleSecondFixFolderQuery,
  useCreateSecondFixFolderMutation,
  useUpdateSecondFixFolderMutation,
  useDeleteSecondFixFolderMutation,
} = secondFixFolderApi;
